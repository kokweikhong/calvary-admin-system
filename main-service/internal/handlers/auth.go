package handlers

import (
	"log/slog"
	"net/http"

	"github.com/kokweikhong/calvary-admin-system/main-service/internal/models"
	"github.com/kokweikhong/calvary-admin-system/main-service/internal/services"
	"github.com/kokweikhong/calvary-admin-system/main-service/internal/utils"
)

type AuthHandler interface {
	SignIn(w http.ResponseWriter, r *http.Request)
}

type authHandler struct {
	service services.AuthService
	jsonH   utils.JSONHandler
}

func NewAuthHandler() AuthHandler {
	return &authHandler{
		service: services.NewAuthService(),
		jsonH:   utils.NewJSONHandler(),
	}
}

func (h *authHandler) SignIn(w http.ResponseWriter, r *http.Request) {
	singInRequest := &models.SignInRequest{}
	if err := h.jsonH.ReadJSON(w, r, singInRequest); err != nil {
		slog.Error("Error decoding request body", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	slog.Info("Sign in request", "email", singInRequest.Email, "password", singInRequest.Password)

	authUser, err := h.service.SignIn(singInRequest.Email, singInRequest.Password)
	if err != nil {
		slog.Error("Error signing in", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	h.jsonH.WriteJSON(w, http.StatusOK, authUser)
}
