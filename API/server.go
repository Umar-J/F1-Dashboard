package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
)

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
	port := "8080"
	fmt.Println("Server Running on port" + port +
		"\nAccess by going to http://localhost:" + port + "/")
	http.HandleFunc("/data", handler)
	http.ListenAndServe(":"+port, nil)
}
