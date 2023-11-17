package routes

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/kokweikhong/calvary-admin-system/filesystem-service/internal/handlers"
)

func NewFilesystemRoute() http.Handler {
	r := chi.NewRouter()
	handler := handlers.NewFilesystemHandler()
	r.Route("/", func(r chi.Router) {
		r.Get("/all", handler.GetFiles)
		r.Get("/", handler.GetFile)
		r.Post("/", handler.CreateFile)
		r.Delete("/", handler.DeleteFile)

	})
	return r
}
