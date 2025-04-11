package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sort"
	"strings"
	"time"

	ics "github.com/arran4/golang-ical"
)

func ScheduleHandler(writer http.ResponseWriter, request *http.Request) {
	fmt.Println("Accessed Schedule")
	writer.Write([]byte(*GetRaceWeekends()))
}

type Race_Weekend struct {
	Country string
	Events  []Scheduled_Event
	IsOver  bool
}

type Scheduled_Event struct {
	Name  string
	Start time.Time
	End   time.Time
	Date  time.Weekday
}

func GetRaceWeekends() *string {
	// ret: race weekends in date-sorted order
	calUrl := "https://ics.ecal.com/ecal-sub/6738026ac199e20008e3938c/Formula%201.ics"

	res, err := http.Get(calUrl)
	if err != nil {
		fmt.Println("Error getting Calendar")
	}

	defer res.Body.Close()

	cal, err := ics.ParseCalendar(res.Body)

	if err != nil {
		fmt.Println("Error Parsing Calendar")
	}

	allEvents := cal.Events()
	sort.Slice(allEvents, func(i, j int) bool {
		date1, _ := allEvents[i].GetStartAt()
		date2, _ := allEvents[j].GetStartAt()
		return date1.Before(date2)
	})

	prevCountry := allEvents[0].GetProperty(ics.ComponentPropertyLocation).Value

	raceWeekends := []Race_Weekend{}

	for _, event := range allEvents {
		summary := event.GetProperty(ics.ComponentPropertySummary).Value
		parsedSummary := strings.Split(summary, "-")
		country := event.GetProperty(ics.ComponentPropertyLocation).Value
		if country == "" {
			// removes useless events (reminders...ect)
			continue
		}
		startTime, err := event.GetStartAt()
		if err != nil {
			fmt.Println("Error getting start time:", err)
			continue
		}
		endTime, err := event.GetEndAt()
		if err != nil {
			fmt.Println("Error getting endtime")
			continue
		}
		event := Scheduled_Event{parsedSummary[len(parsedSummary)-1], startTime, endTime, startTime.Weekday()}
		if country == prevCountry {
			if len(raceWeekends) == 0 {
				raceWeekends = append(raceWeekends, *new(Race_Weekend))
				raceWeekends[0].Events = append(raceWeekends[0].Events, event)
				raceWeekends[0].Country = country
			}
			raceWeekends[len(raceWeekends)-1].Events = append(raceWeekends[len(raceWeekends)-1].Events, event)
		} else {
			raceWeekends[len(raceWeekends)-1].IsOver = raceWeekends[len(raceWeekends)-1].Events[len(raceWeekends[len(raceWeekends)-1].Events)-1].End.Before(time.Now())
			newWeekend := new(Race_Weekend)
			newWeekend.Country = country
			newWeekend.Events = append(newWeekend.Events, event)
			raceWeekends = append(raceWeekends, *newWeekend)
		}
		prevCountry = country
	}

	var ret, _ = json.Marshal(raceWeekends)
	result := string(ret)
	return &result
}
