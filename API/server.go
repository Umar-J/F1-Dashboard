package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"sort"
	"strings"
	"time"

	ics "github.com/arran4/golang-ical"
)

func handler(writer http.ResponseWriter, request *http.Request) {
	writer.Header().Set("Access-Control-Allow-Origin", "*")
	fmt.Println("Accessed Homepage")
	url := "https://api.openf1.org/v1/drivers?&session_key=9636"
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		fmt.Println(err.Error())
	}

	response, responseError := http.DefaultClient.Do(req)
	if responseError != nil {
		fmt.Println(responseError.Error())
	}
	defer response.Body.Close()

	read, readErr := ioutil.ReadAll(response.Body)

	if readErr != nil {
		fmt.Println(readErr.Error())
	}
	fmt.Fprintf(writer, string(read))
}

func ScheduleHandler(writer http.ResponseWriter, request *http.Request) {
	fmt.Println("Accessed Schedule")
	fmt.Fprint(writer, GetRaceWeekends())
}

// TODO : find way to parse these to json, in a format that can be displayed on the Client

type Race_Weekend struct {
	Country string
	Events  []Scheduled_Event
	IsOver  bool
	// start date, end date (day only)
	// gp name (formula 1 pirelli... ect)
}

type Scheduled_Event struct {
	Name  string
	Start time.Time // change to time (in hours only)
	End   time.Time
	Date  time.Weekday
	// day of week enum
}

func GetRaceWeekends() string {
	// TODO: Assess performance and make changes accordinly
	// ret: race weekends in date-sorted order
	// TODO: Calculate the 'day-of-week' of each event & start/end of weekend (dates)
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
	// get next session (fp,sprint,quali)
	// get next race
	// need : country, date, time of all sessins and session name
	// convert to local times
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
	// Debug
	// for i, weekend := range raceWeekends {
	// 	fmt.Printf("Weekend %d: %+v\n", i, weekend)
	// }
	var ret, _ = json.Marshal(raceWeekends)
	return string(ret)
}

func main() {
	port := "8080"
	fmt.Println("Server Running on port " + port +
		"\nAccess by going to http://localhost:" + port + "/")
	http.HandleFunc("/data", handler)
	http.HandleFunc("/schedule", ScheduleHandler)
	http.ListenAndServe(":"+port, nil)
}
