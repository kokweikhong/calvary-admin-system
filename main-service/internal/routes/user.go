package routes

import (
	"github.com/go-chi/chi/v5"
	"github.com/kokweikhong/calvary-admin-system/main-service/internal/handlers"
	"github.com/kokweikhong/calvary-admin-system/main-service/internal/middlewares"
)

func NewUserRouter(r chi.Router) {
	h := handlers.NewUserHandler()
	m := middlewares.NewAuthMiddleware()
	r.Route("/users", func(r chi.Router) {
		r.Use(m.AuthRoute)
		r.Get("/", h.GetUsers)
		r.Get("/{id}", h.GetUser)
		r.Post("/", h.CreateUser)
		r.Put("/{id}", h.UpdateUser)
		r.Delete("/{id}", h.DeleteUser)
	})

}
