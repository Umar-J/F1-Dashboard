package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"

	"github.com/coder/websocket"
)

type NegotiationResult struct {
	ConnectionToken string
	Cookie          string `json:"Set-Cookie"`
}

const SIGNALR_SUBSCRIBE = `{
    "H": "Streaming",
    "M": "Subscribe",
    "A": [[
        "Heartbeat",
        "CarData.z",
        "Position.z",
        "ExtrapolatedClock",
        "TopThree",
        "RcmSeries",
        "TimingStats",
        "TimingAppData",
        "WeatherData",
        "TrackStatus",
        "DriverList",
        "RaceControlMessages",
        "SessionInfo",
        "SessionData",
        "LapCount",
        "TimingData",
        "TeamRadio",
        "PitLaneTimeCollection",
        "ChampionshipPrediction"
    ]],
    "I": 1
}`

func DashboardHandler(writer http.ResponseWriter, request *http.Request) {
	connectGetData(writer, request)
}

func connectGetData(writer http.ResponseWriter, request *http.Request) {
	writer.Header().Set("Content-Type", "text/event-stream")
	writer.Header().Set("Cache-Control", "no-cache")
	writer.Header().Set("Connection", "keep-alive")

	writer.Header().Set("Access-Control-Allow-Origin", "*")
	writer.(http.Flusher).Flush()

	fmt.Println("Accessed dashboard")
	encodedConnData := url.QueryEscape("[{\"name\": \"Streaming\"}]")

	connUrl := fmt.Sprintf("https://livetiming.formula1.com/signalr/negotiate?connectionData=%s&clientProtocol=1.5", encodedConnData)

	resp, err := http.Get(connUrl)
	if err != nil {
		fmt.Println(err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading response body:", err)
		return
	}

	var negotiationResult NegotiationResult
	err = json.Unmarshal(body, &negotiationResult)
	if err != nil {
		fmt.Println("Error unmarshalling response body:", err)
		return
	}

	negotiationResult.Cookie = resp.Header.Get("Set-Cookie")

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	escapedToken := url.QueryEscape(negotiationResult.ConnectionToken)

	wssUrl := fmt.Sprintf("wss://livetiming.formula1.com/signalr/connect?clientProtocol=1.5&transport=webSockets&connectionToken=%s&connectionData=%s", escapedToken, encodedConnData)

	headers := http.Header{}
	headers.Add("User-Agent", "BestHTTP")
	headers.Add("Accept-Encoding", "gzip,identity")
	headers.Add("Cookie", negotiationResult.Cookie)
	c, _, err := websocket.Dial(ctx, wssUrl, &websocket.DialOptions{
		HTTPHeader: headers,
	})
	if err != nil {
		fmt.Println("WebSocket dial error:", err)
		return
	}
	defer c.CloseNow()
	mType, data, err := c.Read(ctx)
	if err != nil {
		fmt.Println("WebSocket read error:", err)
		return
	}

	fmt.Printf("Message type: %v, Data: %s\n", mType, string(data))

	err = c.Write(ctx, websocket.MessageText, []byte(SIGNALR_SUBSCRIBE))
	if err != nil {
		fmt.Println("WebSocket write error:", err)
		return
	}
	c.SetReadLimit(655360)
	rc := http.NewResponseController(writer)

outerLoop:
	for {
		_, data2, err2 := c.Reader(ctx)
		if err2 != nil {
			fmt.Println("WebSocket read error:", err2)
			return
		}

		if data2 == nil {
			fmt.Println("Received nil data from WebSocket")
			continue // Skip processing this message
		}

		dataBytes, err := io.ReadAll(data2)
		if err != nil {
			fmt.Println("Error reading data2:", err)
			return
		}
		if len(dataBytes) == 2 {
			continue
		}

		var messageJson map[string]any

		err = json.Unmarshal(dataBytes, &messageJson)
		if err != nil {
			fmt.Println("error printing message", err)
		}

		// Bulk Data
		if data, exists := messageJson["R"]; exists {
			if jsonData, ok := json.Marshal(data); ok == nil {
				fmt.Printf("\n\n\nR key is found \n\n\n value is:%s", jsonData)
				fmt.Fprintf(writer, "event: new\ndata:%s\n\n", jsonData)
				rc.Flush()
			} else {
				fmt.Println("json error")
			}
		}

		// Updates
		if data, exists := messageJson["M"]; exists && len(data.([]any)) > 0 {
			if jsonData, ok := json.Marshal(data); ok == nil {
				fmt.Printf("\n\n%s", jsonData)
				fmt.Fprintf(writer, "event: update\ndata:%s\n\n", jsonData)
				rc.Flush()
			}
		}
		select {
		case <-request.Context().Done():
			break outerLoop
		default:
		}
	}
}

func handleMessages(message *[]byte) *[]byte {
	var messageJson map[string]any
	var jsonData []byte

	err := json.Unmarshal(*message, &messageJson)
	if err != nil {
		fmt.Println("error printing message", err)
	}

	// Bulk Data
	if data, exists := messageJson["R"]; exists {
		if jsonData, ok := json.Marshal(data); ok == nil {
			fmt.Printf("\n\n\nR key is found \n\n\n value is:%s", jsonData)
		} else {
			fmt.Println("json error")
		}
	}

	// Updates
	if data, exists := messageJson["M"]; exists && len(data.([]any)) > 0 {
		if jsonData, ok := json.Marshal(data); ok == nil {
			fmt.Printf("\n\n%s", jsonData)
		}
	}
	return &jsonData
}
