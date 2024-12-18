package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
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

func GetWeatherData() (*[]byte, error) {
	// replace with live
	weatherURL := "https://api.openf1.org/v1/weather?meeting_key=1208&wind_direction%3E=130&track_temperature%3E=52"
	weatherResp, err := http.Get(weatherURL)
	if err != nil {
		fmt.Println("Error gettting weather")
		return nil, err
	}
	defer weatherResp.Body.Close()
	readData, _ := ioutil.ReadAll(weatherResp.Body)
	//fmt.Println("Raw JSON data:", string(readData)) // Debugging statement

	var weatherData []Weather_Info // since starts with [], it requires to pass a list into the unmarshal()
	err = json.Unmarshal(readData, &weatherData)
	if err != nil {
		fmt.Println("Unmarshal error:", err) // Debugging statement
		return nil, err
	}

	fmt.Println("airTemp", weatherData[0].AirTemperature)
	fmt.Println("TrackTemperature", weatherData[0].TrackTemperature)
	fmt.Println("Humidity", weatherData[0].Humidity)
	fmt.Println("Rain", weatherData[0].Rain)
	fmt.Println("WindDirection", weatherData[0].WindDirection)
	fmt.Println("WindSpeed", weatherData[0].WindSpeed)

	// setup SSE (server side event) channel
	weatherJson, _ := json.Marshal(weatherData[len(weatherData)-1])
	return &weatherJson, nil
}

func DashboardHandler(writer http.ResponseWriter, request *http.Request) {
	fmt.Println("Accessed Dashboard") // Debug

	writer.Header().Set("Content-Type", "text/event-stream")
	writer.Header().Set("Cache-Control", "no-cache")
	writer.Header().Set("Connection", "keep-alive")
	writer.Header().Set("Access-Control-Allow-Origin", "*")
	writer.(http.Flusher).Flush()

	// todo, run this in goroutine, once every minute, getting latest data
	// 1. make sure this "dashboard handler" doensnt return
	// 2. implement way to finish routine? - if http request recieved (later)
	var wg sync.WaitGroup
	wg.Add(1)
	go FetchWeatherData(writer, request, &wg)
	wg.Wait()
}

func FetchWeatherData(writer http.ResponseWriter, request *http.Request, wg *sync.WaitGroup) {
	defer wg.Done()
	weatherJson, err := GetWeatherData()

	if err != nil {
		http.Error(writer, "Failed to parse weather data", http.StatusInternalServerError)
		return
	}

	for {
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
