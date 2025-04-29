package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	models "github.com/umar-j/f1dash/api/Models"
)

func StandingsHandler(writer http.ResponseWriter, request *http.Request) {
	writer.Write(*getDriverStandings())
}

func ConstructorStandingsHandler(writer http.ResponseWriter, request *http.Request) {
	data, err := getConstructorStandings()
	if err != nil {
		http.Error(writer, "Failed to fetch constructor standings", http.StatusInternalServerError)
		return
	}
	writer.Header().Set("Content-Type", "application/json")
	writer.Write(*data)
}

func getDriverStandings() *[]byte {
	resp, err := http.Get("https://api.jolpi.ca/ergast/f1/current/driverstandings//?format=json")
	if err != nil {

	}
	defer resp.Body.Close()
	var leaderboard models.DriverStandingsResponse
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil
	}

	err = json.Unmarshal(body, &leaderboard)
	if err != nil {
		log.Println(err)
	}
	simpleLeaderboard := make([]models.DriverStanding, 0, 20)

	for _, data := range leaderboard.MRData.StandingsTable.StandingsLists[0].DriverStandings {
		simpleLeaderboard = append(simpleLeaderboard,
			models.DriverStanding{
				Name:   fmt.Sprintf("%s %s", data.Driver.GivenName, data.Driver.FamilyName),
				Points: data.Points,
				Team:   data.Constructors[0].Name,
			})
	}

	jsonData, err := json.Marshal(simpleLeaderboard)
	if err != nil {
		log.Println(err)
	}

	return &jsonData
}

func getConstructorStandings() (*[]byte, error) {
	resp, err := http.Get("https://api.jolpi.ca/ergast/f1/current/constructorstandings/?format=json")

	if err != nil {
		return nil, nil
	}

	defer resp.Body.Close()

	data, err := io.ReadAll(resp.Body)

	if err != nil {
		return nil, nil
	}

	var leaderboardResponse models.ConstructorStandingsResponse

	err = json.Unmarshal(data, &leaderboardResponse)

	if err != nil {
		return nil, nil
	}

	leaderboard := make([]models.ConstructorStanding, 0, 20)
	for _, entry := range leaderboardResponse.MRData.StandingsTable.StandingsLists[0].ConstructorStandings {
		leaderboard = append(leaderboard, models.ConstructorStanding{
			Name:   entry.Constructor.Name,
			Points: entry.Points,
			Wins:   entry.Wins,
		})
	}
	json, err := json.Marshal(leaderboard)
	if err != nil {
		return nil, nil
	}
	return &json, nil
}
