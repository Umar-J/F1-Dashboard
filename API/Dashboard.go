package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"sync"
	"time"
)

type Weather_Info struct {
	TrackTemperature float32 `json:"track_temperature"`
	AirTemperature   float32 `json:"air_temperature"`
	Humidity         float32 `json:"humidity"`
	Rain             int     `json:"rainfall"`
	WindDirection    int     `json:"wind_direction"`
	WindSpeed        float32 `json:"wind_speed"`
}

type Session_Info struct {
	MeetingName string `json:"meeting_name"`
	SessionType string `json:"session_type"`
}

func GetWeatherData() (*[]byte, error) {
	weatherURL := "https://api.openf1.org/v1/weather?meeting_key=latest"
	weatherResp, err := http.Get(weatherURL)
	if err != nil {
		fmt.Println("Error gettting weather")
		return nil, err
	}
	defer weatherResp.Body.Close()
	readData, _ := io.ReadAll(weatherResp.Body)
	//fmt.Println("Raw JSON data:", string(readData)) // Debugging statement

	var weatherData []Weather_Info // since starts with '[', it requires to pass a list into the unmarshal()
	err = json.Unmarshal(readData, &weatherData)
	if err != nil {
		fmt.Println("Unmarshal error:", err) // Debugging statement
		return nil, err
	}

	// setup SSE (server side event) channel
	weatherJson, _ := json.Marshal(weatherData[len(weatherData)-1])
	return &weatherJson, nil
}

func DashboardHandler(writer http.ResponseWriter, request *http.Request) {
	var wg sync.WaitGroup
	fmt.Println("Accessed Dashboard")

	sessionInfo, err := GetSessionInfo()
	if err != nil {
		http.Error(writer, "Failed to get session info", http.StatusInternalServerError)
		return
	}

	writer.Header().Set("Content-Type", "text/event-stream")
	writer.Header().Set("Cache-Control", "no-cache")
	writer.Header().Set("Connection", "keep-alive")
	writer.Header().Set("Access-Control-Allow-Origin", "*")
	writer.(http.Flusher).Flush()

	writer.Write(*sessionInfo)
	writer.(http.Flusher).Flush()

	// todo, run this in goroutine, once every minute, getting latest data
	// 1. make sure this "dashboard handler" doensnt return
	// 2. implement way to finish routine? - if http request recieved (later)
	wg.Add(1)
	go FetchWeatherData(writer, request, &wg)
	wg.Wait()
}

func FetchWeatherData(writer http.ResponseWriter, request *http.Request, wg *sync.WaitGroup) {
	defer wg.Done()
	for {
		weatherJson, err := GetWeatherData()
		if err != nil {
			http.Error(writer, "Failed to parse weather data", http.StatusInternalServerError)
			return
		}

		fmt.Fprintf(writer, "event: weather\ndata:%s\n\n", *weatherJson)
		writer.(http.Flusher).Flush()
		time.Sleep(time.Second) // minute in actual application

		select {
		case <-request.Context().Done():
			return
		default:
		}
	}
}

func GetSessionInfo() (*[]byte, error) {
	// get venue name:
	url := "https://api.openf1.org/v1/meetings?meeting_key=latest"

	req, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer req.Body.Close()

	body, err := io.ReadAll(req.Body)
	if err != nil {
		return nil, err
	}

	sessionInfo := []Session_Info{}
	json.Unmarshal(body, &sessionInfo)
	meetingName := sessionInfo[0].MeetingName

	url2 := "https://api.openf1.org/v1/sessions?meeting_key=latest"

	req2, err := http.Get(url2)
	if err != nil {
		return nil, err
	}
	defer req2.Body.Close()

	body2, err := io.ReadAll(req2.Body)
	if err != nil {
		return nil, err
	}

	json.Unmarshal(body2, &sessionInfo)
	SessionType := sessionInfo[0].SessionType

	fmt.Println(meetingName, " + ", SessionType)
	returnSessionInfo := Session_Info{meetingName, SessionType}

	toReturn, err := json.Marshal(returnSessionInfo)
	if err != nil {
		return nil, err
	}

	return &toReturn, nil
}
