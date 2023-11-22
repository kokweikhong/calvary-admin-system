package utils

import (
	"io"
	"mime/multipart"
	"net/http"
)

func UploadFile(file multipart.File, filename, saveDir string) (string, error) {
	const uploadURL = "http://localhost:8080/uploads"
	client := http.Client{}

	// create request
	req, err := http.NewRequest("POST", uploadURL, file)
	if err != nil {
		return "", err
	}

	// set headers
	req.Header.Set("Content-Type", "multipart/form-data")
	req.Header.Set("X-Filename", filename)
	req.Header.Set("X-Save-Dir", saveDir)

	// send request
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}

	defer resp.Body.Close()

	// get response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	return string(body), nil
}
