package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

type ApiResponse struct { // not needed
	Message string `json:"message"`
}

func dataHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("hi")
	response := ApiResponse{Message: "Hello from the Golang API!"}
	json.NewEncoder(w).Encode(response)
}

func handler(writer http.ResponseWriter, request *http.Request) {
	fmt.Println("bye")
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

func main() {
	http.HandleFunc("/apitest", dataHandler)
	http.HandleFunc("/data", handler)
	http.ListenAndServe(":8080", nil)
	fmt.Println("hi")
}
