package routes

import (
	"github.com/go-chi/chi/v5"
	"github.com/kokweikhong/calvary-admin-system/main-service/internal/handlers"
)

func NewAuthRouter(r chi.Router) {
	h := handlers.NewAuthHandler()

	r.Route("/auth", func(r chi.Router) {
		r.Post("/signin", h.SignIn)
		r.Get("/reset-password/{token}", h.GetEmailFromResetPasswordToken)
		r.Post("/reset-password", h.ResetPassword)
		r.Put("/update-password", h.UpdatePassword)
		r.Post("/refresh-token", h.RefreshToken)
	})

}
