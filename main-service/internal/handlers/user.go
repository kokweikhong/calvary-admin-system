package handlers

import (
	"log/slog"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/kokweikhong/calvary-admin-system/main-service/internal/models"
	"github.com/kokweikhong/calvary-admin-system/main-service/internal/services"
	"github.com/kokweikhong/calvary-admin-system/main-service/internal/utils"
)

type UserHandler interface {
	GetUsers(w http.ResponseWriter, r *http.Request)
	GetUser(w http.ResponseWriter, r *http.Request)
	CreateUser(w http.ResponseWriter, r *http.Request)
	UpdateUser(w http.ResponseWriter, r *http.Request)
	DeleteUser(w http.ResponseWriter, r *http.Request)
}

type userHandler struct {
	jsonH   utils.JSONHandler
	service services.UserService
}

func NewUserHandler() UserHandler {
	return &userHandler{
		jsonH:   utils.NewJSONHandler(),
		service: services.NewUserService(),
	}
}

func (h *userHandler) GetUsers(w http.ResponseWriter, r *http.Request) {
	users, err := h.service.GetUsers()
	if err != nil {
		slog.Error("Error getting users", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusInternalServerError)
	}

	h.jsonH.WriteJSON(w, http.StatusOK, users)
}

func (h *userHandler) GetUser(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		slog.Error("Error converting id to int", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	user, err := h.service.GetUser(id)
	if err != nil {
		slog.Error("Error getting user", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	h.jsonH.WriteJSON(w, http.StatusOK, user)
}

func (h *userHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
	user := new(models.User)
	if err := h.jsonH.ReadJSON(w, r, &user); err != nil {
		slog.Error("Error decoding user", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	if err := h.service.CreateUser(user); err != nil {
		slog.Error("Error creating user", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	h.jsonH.WriteJSON(w, http.StatusCreated, nil)
}

func (h *userHandler) UpdateUser(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		slog.Error("Error converting id to int", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	user := new(models.User)
	if err := h.jsonH.ReadJSON(w, r, &user); err != nil {
		slog.Error("Error decoding user", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	if err := h.service.UpdateUser(id, user); err != nil {
		slog.Error("Error updating user", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	h.jsonH.WriteJSON(w, http.StatusOK, nil)
}

func (h *userHandler) DeleteUser(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		slog.Error("Error converting id to int", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	if err := h.service.DeleteUser(id); err != nil {
		slog.Error("Error deleting user", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	h.jsonH.WriteJSON(w, http.StatusOK, nil)
}
