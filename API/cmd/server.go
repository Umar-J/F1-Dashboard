package main

import (
	"log"
	"net/http"

	handlers "github.com/umar-j/f1dash/api/handlers"
)

func main() {
	port := "8080"
	log.Println("Server Running on port " + port +
		"\nAccess by going to http://localhost:" + port + "/")
	http.HandleFunc("GET /schedule/", handlers.ScheduleHandler)
	http.HandleFunc("GET /dashboard/", handlers.DashboardHandler)
	http.HandleFunc("GET /standings/", handlers.StandingsHandler)
	http.HandleFunc("GET /constructor-standings/", handlers.ConstructorStandingsHandler)
	http.ListenAndServe("0.0.0.0:"+port, nil)
}
