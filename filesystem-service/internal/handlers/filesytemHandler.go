package handlers

import (
	"encoding/json"
	"io"
	"log/slog"
	"net/http"

	"github.com/kokweikhong/calvary-admin-system/filesystem-service/internal/services"
	"github.com/kokweikhong/calvary-admin-system/filesystem-service/internal/utils"
)

type FilesystemHandler interface {
	GetFiles(w http.ResponseWriter, r *http.Request)
	GetFile(w http.ResponseWriter, r *http.Request)
	CreateFile(w http.ResponseWriter, r *http.Request)
	DeleteFile(w http.ResponseWriter, r *http.Request)
}

type filesystemHandler struct {
	service services.FilesystemService
	json    utils.JSONHandler
}

func NewFilesystemHandler() FilesystemHandler {
	return &filesystemHandler{
		service: services.NewFilesystemService(),
		json:    utils.NewJSONHandler(),
	}
}

func (f *filesystemHandler) GetFiles(w http.ResponseWriter, r *http.Request) {
	files, err := f.service.GetFiles()
	if err != nil {
		slog.Error("Error Getting Files", "error", err)
		f.json.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	f.json.WriteJSON(w, http.StatusOK, files)
}

func (f *filesystemHandler) GetFile(w http.ResponseWriter, r *http.Request) {
	// get filename from request body
	var requestBody = struct {
		Filename string `json:"filename"`
	}{}

	// decode request body
	if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
		slog.Error("Error Decoding Request Body", "error", err)
		f.json.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	slog.Info("requestBody", "requestBody", requestBody)

	// get file
	filename, err := f.service.GetFile(requestBody.Filename)
	if err != nil {
		slog.Error("Error Getting File", "error", err)
		f.json.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	// return file
	f.json.WriteJSON(w, http.StatusOK, filename)
}

func (f *filesystemHandler) CreateFile(w http.ResponseWriter, r *http.Request) {
	// get file from request body
	fileBytes, err := io.ReadAll(r.Body)
	if err != nil {
		slog.Error("Error Reading Request Body", "error", err)
		f.json.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	filename := r.Header.Get("X-Filename")
	saveDir := r.Header.Get("X-Save-Dir")
	slog.Info("filename and saveDir", "filename", filename, "saveDir", saveDir)

	filename, err = f.service.CreateFile(filename, saveDir, fileBytes)
	if err != nil {
		slog.Error("Error Creating File", "error", err)
		f.json.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	// return filename
	f.json.WriteJSON(w, http.StatusOK, filename)
}

func (f *filesystemHandler) DeleteFile(w http.ResponseWriter, r *http.Request) {
	var requestBody = struct {
		Filename string `json:"filename"`
	}{}

	// decode request body
	if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
		slog.Error("Error Decoding Request Body", "error", err)
		f.json.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	slog.Info("requestBody", "requestBody", requestBody)

	// delete file
	err := f.service.DeleteFile(requestBody.Filename)
	if err != nil {
		slog.Error("Error Deleting File", "error", err)
		f.json.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	// return success
	f.json.WriteJSON(w, http.StatusOK, "success")
}
