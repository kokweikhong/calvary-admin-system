package routes

import (
	"github.com/go-chi/chi/v5"
	"github.com/kokweikhong/calvary-admin-system/main-service/internal/handlers"
)

func NewUserRouter() chi.Router {
	h := handlers.NewUserHandler()
	r := chi.NewRouter()

	r.Get("/users", h.GetUsers)
	r.Get("/users/{id}", h.GetUser)
	r.Post("/users", h.CreateUser)
	r.Put("/users/{id}", h.UpdateUser)
	r.Delete("/users/{id}", h.DeleteUser)

	return r
}
