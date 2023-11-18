package routes

import (
	"github.com/go-chi/chi/v5"
	"github.com/kokweikhong/calvary-admin-system/main-service/internal/handlers"
)

func NewFileSystemRouter() chi.Router {
	r := chi.NewRouter()
	f := handlers.NewFileSystemHandler()

	r.Get("/files", f.GetFiles)
	r.Post("/files", f.GetFile)
	r.Post("/files/search", f.SearchFiles)
	r.Post("/uploads", f.UploadFile)
	r.Delete("/files", f.DeleteFile)

	return r
}
