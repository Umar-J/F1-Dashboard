package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
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

// Server endpoint for accessing live data
func DashboardHandler(writer http.ResponseWriter, request *http.Request) {
	log.Println("Accessed dashboard")
	initClientConnection(writer)
	establishF1SignalRSession(writer, request)
}

// Sets up the SSE Stream to the client
func initClientConnection(writer http.ResponseWriter) {
	writer.Header().Set("Content-Type", "text/event-stream")
	writer.Header().Set("Cache-Control", "no-cache")
	writer.Header().Set("Connection", "keep-alive")

	writer.Header().Set("Access-Control-Allow-Origin", "*")
	writer.(http.Flusher).Flush()
}

// Establishes a connection to the F1 SignalR endpoint to recieve data.
// Starts message queue, recieves, processes, and sends data to the client
func establishF1SignalRSession(writer http.ResponseWriter, request *http.Request) {
	encodedConnData := url.QueryEscape("[{\"name\": \"Streaming\"}]")
	connUrl := fmt.Sprintf("https://livetiming.formula1.com/signalr/negotiate?connectionData=%s&clientProtocol=1.5", encodedConnData)

	resp, err := http.Get(connUrl)
	if err != nil {
		log.Println(err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Println("Error reading response body:", err)
		return
	}

	var negotiationResult NegotiationResult
	err = json.Unmarshal(body, &negotiationResult)
	if err != nil {
		log.Println("Error unmarshalling response body:", err)
		return
	}

	negotiationResult.Cookie = resp.Header.Get("Set-Cookie")

	ctx, cancel := context.WithCancel(request.Context())
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
		log.Println("WebSocket dial error:", err)
		return
	}
	defer c.CloseNow()

	err = c.Write(ctx, websocket.MessageText, []byte(SIGNALR_SUBSCRIBE))
	if err != nil {
		log.Println("WebSocket write error:", err)
		return
	}
	startMessageQueue(c, ctx, writer)
}

func startMessageQueue(c *websocket.Conn, ctx context.Context, writer http.ResponseWriter) {
	rc := http.NewResponseController(writer)
	c.SetReadLimit(655360)

outerLoop:
	for {
		_, data, err := c.Reader(ctx)
		if err != nil {
			log.Println("WebSocket read error:", err)
			return
		}

		if data == nil {
			log.Println("Received nil data from WebSocket")
			continue // Skip processing this message
		}

		dataBytes, err := io.ReadAll(data)
		if err != nil {
			log.Println("Error reading data:", err)
			return
		}
		if len(dataBytes) == 2 {
			continue
		}

		var messageJson map[string]any

		err = json.Unmarshal(dataBytes, &messageJson)
		if err != nil {
			log.Println("error printing message", err)
		}

		// Bulk Data
		if data, exists := messageJson["R"]; exists {
			if jsonData, ok := json.Marshal(data); ok == nil {
				fmt.Fprintf(writer, "event: new\ndata:%s\n\n", jsonData)
				rc.Flush()
			} else {
				log.Println("new data json error")
			}
		}

		// Updates
		if data, exists := messageJson["M"]; exists && len(data.([]any)) > 0 {
			if jsonData, ok := json.Marshal(data); ok == nil {
				fmt.Fprintf(writer, "event: update\ndata:%s\n\n", jsonData)
				rc.Flush()
			} else {
				log.Println("update data json error")
			}
		}
		select {
		case <-ctx.Done():
			break outerLoop
		default:
		}
	}
}
