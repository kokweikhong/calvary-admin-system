package handlers

import (
	"log/slog"
	"net/http"
	"time"

	"github.com/kokweikhong/calvary-admin-system/main-service/internal/models"
	"github.com/kokweikhong/calvary-admin-system/main-service/internal/services"
	"github.com/kokweikhong/calvary-admin-system/main-service/internal/utils"
)

type AuthHandler interface {
	SignIn(w http.ResponseWriter, r *http.Request)
	RefreshToken(w http.ResponseWriter, r *http.Request)
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
	signInRequest := &models.AuthSignInRequest{}
	if err := h.jsonH.ReadJSON(w, r, signInRequest); err != nil {
		slog.Error("Error decoding request body", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	slog.Info("Sign in request", "email", signInRequest.Email, "password", signInRequest.Password)

	authUser, err := h.service.SignIn(signInRequest)
	if err != nil {
		slog.Error("Error signing in", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	h.jsonH.WriteJSON(w, http.StatusOK, authUser)
}

func (h *authHandler) RefreshToken(w http.ResponseWriter, r *http.Request) {
	type RefreshTokenRequest struct {
		Username     string `json:"username"`
		RefreshToken string `json:"refreshToken"`
	}

	refreshTokenRequest := &RefreshTokenRequest{}
	if err := h.jsonH.ReadJSON(w, r, refreshTokenRequest); err != nil {
		slog.Error("Error decoding request body", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	slog.Info("Refresh token request", "refreshToken", refreshTokenRequest.RefreshToken)

	authUser, err := h.service.RefreshToken(
		refreshTokenRequest.Username,
		refreshTokenRequest.RefreshToken,
		// time.Minute*1,
		time.Minute*30,
	)

	if err != nil {
		slog.Error("Error refreshing token", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	h.jsonH.WriteJSON(w, http.StatusOK, authUser)
}
