package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
)

const deleteFilepath = "uploads/personal/users/1185be44-80f4-4eb6-b249-8e421ed7a3d6.pdf"

func main() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)
	getFiles()
	getFile()
}

func getFile() {
	client := http.Client{}

	// request body in json with filename key
	requestBody := map[string]string{
		"filename": deleteFilepath,
	}

	// convert body to json
	jsonBody, err := json.Marshal(requestBody)
	if err != nil {
		log.Fatal(err)
	}

	// create request
	req, err := http.NewRequest("GET", "http://localhost:8080/uploads", bytes.NewBuffer(jsonBody))
	if err != nil {
		log.Fatal(err)
	}

	resp, err := client.Do(req)
	if err != nil {
		log.Fatal(err)
	}

	defer resp.Body.Close()

	fmt.Println(resp.Status)

	// read response body

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(string(body))
}

func getFiles() {
	client := http.Client{}
	// create request
	req, err := http.NewRequest("GET", "http://localhost:8080/uploads/all", nil)
	if err != nil {
		log.Fatal(err)
	}

	resp, err := client.Do(req)
	if err != nil {
		log.Fatal(err)
	}

	defer resp.Body.Close()

	fmt.Println(resp.Status)

	// read response body

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(string(body))
}

func deleteFile() {
	client := http.Client{}

	// request body in json with filename key
	requestBody := map[string]string{
		"filename": deleteFilepath,
	}

	// convert body to json
	jsonBody, err := json.Marshal(requestBody)
	if err != nil {
		log.Fatal(err)
	}

	// create request
	req, err := http.NewRequest("DELETE", "http://localhost:8080/uploads", bytes.NewBuffer(jsonBody))
	if err != nil {
		log.Fatal(err)
	}

	// set content-type to application/json
	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		log.Fatal(err)
	}

	defer resp.Body.Close()

	fmt.Println(resp.Status)

	// read response body

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Fatal(err)
	}

	defer resp.Body.Close()

	fmt.Println(string(body))

}

func createFile() {
	client := http.Client{}

	filePath := "./test2.pdf"
	// send file to upload api
	file, err := os.Open(filePath)
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	// bodyFile := &bytes.Buffer{}
	// writer := multipart.NewWriter(bodyFile)
	// part, err := writer.CreateFormFile("file", "go.mod")
	// if err != nil {
	// 	log.Fatal(err)
	// }

	// // copy file content to part
	// _, err = io.Copy(part, file)

	// // set multipart/form-data
	// for key, val := range map[string]string{
	// 	"key1": "val1",
	// 	"key2": "val2",
	// } {
	// 	_ = writer.WriteField(key, val)
	// }

	// err = writer.Close()
	// if err != nil {
	// 	log.Fatal(err)
	// }

	// create request
	// body = {file: file}
	// header = {Content-Type: multipart/form-data}
	req, err := http.NewRequest("POST", "http://localhost:8080/uploads", file)
	if err != nil {
		log.Fatal(err)
	}

	// add file content to request body
	// set mutilpart/form-data
	req.Header.Set("Content-Type", "multipart/form-data")

	// create X-Filename and X-Save-Dir
	req.Header.Set("X-Filename", filePath)
	req.Header.Set("X-Save-Dir", "personal/users")

	resp, err := client.Do(req)
	if err != nil {
		log.Fatal(err)
	}
	defer resp.Body.Close()

	fmt.Println(resp.Status)

	// read response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Fatal(err)
	}

	defer resp.Body.Close()

	fmt.Println(string(body))

}
