package services

import (
	"log/slog"
	"os"
	"path/filepath"

	"github.com/google/uuid"
)

type FilesystemService interface {
	GetFiles() ([]string, error)
	GetFile(filename string) (string, error)
	CreateFile(filename, dir string, fileBytes []byte) (string, error)
	DeleteFile(filename string) error
}

type filesystemService struct {
}

func NewFilesystemService() FilesystemService {
	return &filesystemService{}
}

const uploadPath = "./uploads"

func (f *filesystemService) GetFiles() ([]string, error) {
	files := []string{}
	// get all files in uploads folder
	err := filepath.Walk(uploadPath, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			slog.Error("Error Walking Path", "error", err)
			return err
		}

		if !info.IsDir() {
			slog.Info("File Found", "filename", info.Name())
			// append full path to files
			files = append(files, path)
		}

		return nil
	})

	if err != nil {
		slog.Error("Error Walking Path", "error", err)
		return nil, err
	}

	return files, nil
}

func (f *filesystemService) GetFile(filename string) (string, error) {
	// check if file exists
	if _, err := os.Stat(filename); os.IsNotExist(err) {
		slog.Error("File Not Found", "error", err)
		return "", err
	}

	return filename, nil
}

func (f *filesystemService) CreateFile(filename, dir string, fileBytes []byte) (string, error) {
	saveDir := filepath.Join(uploadPath, dir)

	if _, err := os.Stat(saveDir); os.IsNotExist(err) {
		os.MkdirAll(saveDir, 0755)
	}

	extension := filepath.Ext(filename)
	filename = uuid.New().String() + extension
	// create full path
	filename = filepath.Join(saveDir, filename)

	// create file
	newFile, err := os.Create(filename)
	if err != nil {
		slog.Error("Error Creating File", "error", err)
		return "", err
	}

	// write file
	_, err = newFile.Write(fileBytes)
	if err != nil {
		slog.Error("Error Writing File", "error", err)
		return "", err
	}

	// close file
	err = newFile.Close()
	if err != nil {
		slog.Error("Error Closing File", "error", err)
		return "", err
	}

	return filename, nil
}

func (f *filesystemService) DeleteFile(filename string) error {
	err := os.Remove(filename)
	if err != nil {
		slog.Error("Error Deleting File", "error", err)
		return err
	}
	return nil
}
