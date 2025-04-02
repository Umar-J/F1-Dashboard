package main

import (
	"fmt"
	"io"
	"net/http"

	handlers "github.com/umar-j/f1dash/api/Handlers"
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

	read, readErr := io.ReadAll(response.Body)

	if readErr != nil {
		fmt.Println(readErr.Error())
	}
	fmt.Fprintf(writer, string(read))
}

func main() {
	port := "8080"
	fmt.Println("Server Running on port " + port +
		"\nAccess by going to http://localhost:" + port + "/")
	http.HandleFunc("GET /data/", handler)
	http.HandleFunc("GET /schedule/", ScheduleHandler)
	http.HandleFunc("GET /dashboard/", DashboardHandler)
	http.HandleFunc("GET /standings/", handlers.StandingsHandler)
	http.HandleFunc("GET /constructor-standings/", handlers.ConstructorStandingsHandler)
	http.ListenAndServe("0.0.0.0:"+port, nil)
}
