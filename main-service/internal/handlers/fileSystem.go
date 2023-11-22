package handlers

import (
	"log/slog"
	"net/http"
	"path/filepath"

	"github.com/google/uuid"
	"github.com/kokweikhong/calvary-admin-system/main-service/internal/services"
	"github.com/kokweikhong/calvary-admin-system/main-service/internal/utils"
)

type FileSystemHandler interface {
	UploadFile(w http.ResponseWriter, r *http.Request)
	GetFile(w http.ResponseWriter, r *http.Request)
	SearchFiles(w http.ResponseWriter, r *http.Request)
	GetFiles(w http.ResponseWriter, r *http.Request)
	DeleteFile(w http.ResponseWriter, r *http.Request)
}

type fileSystemHandler struct {
	fileSystemService services.FileSystemService
	jsonH             utils.JSONHandler
}

func NewFileSystemHandler() FileSystemHandler {
	return &fileSystemHandler{
		fileSystemService: services.NewFileSystemService(),
		jsonH:             utils.NewJSONHandler(),
	}
}

func (f *fileSystemHandler) UploadFile(w http.ResponseWriter, r *http.Request) {
	slog.Info("UploadFile called")
	// 10 << 20 = 10MB
	err := r.ParseMultipartForm(10 << 20)
	if err != nil {
		slog.Error("Error parsing multipart form", "err", err)
		f.jsonH.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	file, handler, err := r.FormFile("file")
	if err != nil {
		slog.Error("Error retrieving file from form", "err", err)
		f.jsonH.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	defer file.Close()

	fileBytes := make([]byte, handler.Size)
	_, err = file.Read(fileBytes)
	if err != nil {
		slog.Error("Error reading file", "err", err)
		f.jsonH.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	// get the saveDir from the form
	saveDir := r.FormValue("saveDir")

	// filename replaced with uuid
	filename := uuid.New().String() + filepath.Ext(handler.Filename)

	// upload file
	path, err := f.fileSystemService.Upload(filename, saveDir, fileBytes)
	if err != nil {
		slog.Error("Error uploading file", "err", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// return path
	slog.Info("File uploaded successfully", "path", path)
	f.jsonH.WriteJSON(w, http.StatusOK, path)
}

func (f *fileSystemHandler) GetFile(w http.ResponseWriter, r *http.Request) {

}

func (f *fileSystemHandler) SearchFiles(w http.ResponseWriter, r *http.Request) {
	slog.Info("SearchFiles called")
	// get filename from request body
	var reqBody struct {
		Filename string `json:"filename"`
	}

	if err := f.jsonH.ReadJSON(w, r, &reqBody); err != nil {
		slog.Error("Error reading request body", "err", err)
		f.jsonH.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	// search for files
	files, err := f.fileSystemService.SearchFiles(reqBody.Filename)
	if err != nil {
		slog.Error("Error searching files", "err", err)
		f.jsonH.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	// return files
	slog.Info("Files found", "files", files)
	f.jsonH.WriteJSON(w, http.StatusOK, files)
}

func (f *fileSystemHandler) GetFiles(w http.ResponseWriter, r *http.Request) {
	slog.Info("GetFiles called")

	files, err := f.fileSystemService.GetFiles()
	if err != nil {
		slog.Error("Error getting files", "err", err)
		f.jsonH.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	// return files
	slog.Info("Files found", "files", files)
	f.jsonH.WriteJSON(w, http.StatusOK, files)
}

func (f *fileSystemHandler) DeleteFile(w http.ResponseWriter, r *http.Request) {
	var reqBody struct {
		Path string `json:"path"`
	}

	if err := f.jsonH.ReadJSON(w, r, &reqBody); err != nil {
		slog.Error("Error reading request body", "err", err)
		f.jsonH.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	err := f.fileSystemService.Delete(reqBody.Path)
	if err != nil {
		slog.Error("Error deleting file", "err", err)
		f.jsonH.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	f.jsonH.WriteJSON(w, http.StatusOK, nil)
}
