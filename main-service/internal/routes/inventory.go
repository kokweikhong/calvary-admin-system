package routes

import (
	"github.com/go-chi/chi/v5"
	"github.com/kokweikhong/calvary-admin-system/main-service/internal/handlers"
)

func NewInventoryRouter() chi.Router {
	h := handlers.NewInventoryHandler()
	r := chi.NewRouter()

	// Product
	r.Get("/products", h.GetProducts)
	r.Get("/products/{id}", h.GetProduct)
	r.Post("/products", h.CreateProduct)
	r.Put("/products/{id}", h.UpdateProduct)
	r.Delete("/products/{id}", h.DeleteProduct)

	// Incoming
	r.Get("/incomings", h.GetIncomings)
	r.Get("/incomings/{id}", h.GetIncoming)
	r.Post("/incomings", h.CreateIncoming)
	r.Put("/incomings/{id}", h.UpdateIncoming)
	r.Delete("/incomings/{id}", h.DeleteIncoming)

	// Outgoing
	r.Get("/outgoings", h.GetOutgoings)
	r.Get("/outgoings/{id}", h.GetOutgoing)
	r.Post("/outgoings", h.CreateOutgoing)
	r.Put("/outgoings/{id}", h.UpdateOutgoing)
	r.Delete("/outgoings/{id}", h.DeleteOutgoing)

	return r
}