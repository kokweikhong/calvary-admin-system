package services

import (
	"log/slog"
	"os"
	"path/filepath"
	"strings"
)

type FileSystemService interface {
	Upload(filename, savePath string, fileBytes []byte) (string, error)
	Get(path string) (*os.File, error)
	SearchFiles(filename string) ([]string, error)
	GetFiles() ([]string, error)
	Delete(path string) error
}

type fileSystemService struct {
}

func NewFileSystemService() FileSystemService {
	return &fileSystemService{}
}

var defaultPath = "uploads"

func Init() {
	path := os.Getenv("UPLOAD_PATH")
	if path != "" {
		defaultPath = path
	}
}

func (f *fileSystemService) Upload(filename, savePath string, fileBytes []byte) (string, error) {
	// join defaultPath and savePath
	joinedPath := filepath.Join("/app/", defaultPath, savePath)

	// joinedPath = strings.Replace(joinedPath, "app/", "", 1)

	// check if path exists and if not, create it
	_, err := os.Stat(joinedPath)
	slog.Info("joinedPath", "joinedPath", joinedPath)
	if os.IsNotExist(err) {
		err = os.MkdirAll(joinedPath, 0755)
		if err != nil {
			slog.Error("create dir error", "err", err)
			return "", err
		}
	}

	// create file
	file, err := os.Create(filepath.Join(joinedPath, filename))
	if err != nil {
		return "", err
	}

	// write fileBytes to file
	_, err = file.Write(fileBytes)
	if err != nil {
		return "", err
	}

	joinedPath = strings.Replace(joinedPath, "/app/", "", 1)

	slog.Info("joinedPath", "joinedPath", joinedPath)

	// return full path
	return filepath.Join(joinedPath, filename), nil
}

// get file from path
func (f *fileSystemService) Get(path string) (*os.File, error) {
	// check if file exists
	_, err := os.Stat(path)
	if os.IsNotExist(err) {
		return nil, err
	}

	// file exists, open it
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}

	return file, nil
}

// search for file in path
func (f *fileSystemService) SearchFiles(filename string) ([]string, error) {
	// check if path exists
	_, err := os.Stat(defaultPath)
	if os.IsNotExist(err) {
		return nil, err
	}

	// path exists, get files
	files := []string{}
	err = filepath.Walk(defaultPath, func(path string, info os.FileInfo, err error) error {
		if !info.IsDir() && info.Name() == filename {
			files = append(files, path)
		}
		return nil
	})
	if err != nil {
		return nil, err
	}

	return files, nil
}

// get files from path
func (f *fileSystemService) GetFiles() ([]string, error) {
	// check if path exists
	_, err := os.Stat(defaultPath)
	if os.IsNotExist(err) {
		return nil, err
	}

	// path exists, get files
	files := []string{}
	err = filepath.Walk(defaultPath, func(path string, info os.FileInfo, err error) error {
		if !info.IsDir() {
			files = append(files, path)
		}
		return nil
	})
	if err != nil {
		return nil, err
	}

	return files, nil
}

func (f *fileSystemService) Delete(path string) error {
	currentPath, _ := os.Getwd()
	path = filepath.Join(currentPath, path)

	// check if file exists
	file, err := os.Stat(path)
	if os.IsNotExist(err) {
		// file does not exist, return nil
		return nil
	}

	if file.IsDir() {
		return nil
	}

	// file exists, delete it
	// remove file
	err = os.Remove(path)
	if err != nil {
		return err
	}

	return nil
}
