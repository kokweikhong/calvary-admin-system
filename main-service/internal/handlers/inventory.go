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

type InventoryHandler interface {
	GetProducts(w http.ResponseWriter, r *http.Request)
	GetProduct(w http.ResponseWriter, r *http.Request)
	CreateProduct(w http.ResponseWriter, r *http.Request)
	UpdateProduct(w http.ResponseWriter, r *http.Request)
	DeleteProduct(w http.ResponseWriter, r *http.Request)
	GetProductSummary(w http.ResponseWriter, r *http.Request)

	GetIncomings(w http.ResponseWriter, r *http.Request)
	GetIncoming(w http.ResponseWriter, r *http.Request)
	CreateIncoming(w http.ResponseWriter, r *http.Request)
	UpdateIncoming(w http.ResponseWriter, r *http.Request)
	DeleteIncoming(w http.ResponseWriter, r *http.Request)

	GetOutgoings(w http.ResponseWriter, r *http.Request)
	GetOutgoing(w http.ResponseWriter, r *http.Request)
	CreateOutgoing(w http.ResponseWriter, r *http.Request)
	UpdateOutgoing(w http.ResponseWriter, r *http.Request)
	DeleteOutgoing(w http.ResponseWriter, r *http.Request)
}

type inventoryHandler struct {
	jsonH   utils.JSONHandler
	service services.InventoryService
}

func NewInventoryHandler() InventoryHandler {
	return &inventoryHandler{
		jsonH:   utils.NewJSONHandler(),
		service: services.NewInventoryService(),
	}
}

func (h *inventoryHandler) GetProducts(w http.ResponseWriter, r *http.Request) {
	slog.Info("GetProducts Hit")
	products, err := h.service.GetProducts()
	if err != nil {
		slog.Error("Error getting products", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	h.jsonH.WriteJSON(w, http.StatusOK, products)
}

func (h *inventoryHandler) GetProduct(w http.ResponseWriter, r *http.Request) {
	slog.Info("GetProduct Hit")
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		slog.Error("Error parsing id", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	product, err := h.service.GetProduct(id)
	if err != nil {
		slog.Error("Error getting product", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	h.jsonH.WriteJSON(w, http.StatusOK, product)
}

func (h *inventoryHandler) CreateProduct(w http.ResponseWriter, r *http.Request) {
	slog.Info("CreateProduct Hit")
	product := new(models.InventoryProduct)
	if err := h.jsonH.ReadJSON(w, r, product); err != nil {
		slog.Error("Error reading product", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	var err error
	product, err = h.service.CreateProduct(product)
	if err != nil {
		slog.Error("Error creating product", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	h.jsonH.WriteJSON(w, http.StatusOK, product)
}

func (h *inventoryHandler) UpdateProduct(w http.ResponseWriter, r *http.Request) {
	slog.Info("UpdateProduct Hit")
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		slog.Error("Error parsing id", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	product := new(models.InventoryProduct)
	err = h.jsonH.ReadJSON(w, r, product)
	if err != nil {
		slog.Error("Error reading product", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	product, err = h.service.UpdateProduct(id, product)
	if err != nil {
		slog.Error("Error updating product", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	h.jsonH.WriteJSON(w, http.StatusOK, product)
}

func (h *inventoryHandler) DeleteProduct(w http.ResponseWriter, r *http.Request) {
	slog.Info("DeleteProduct Hit")
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		slog.Error("Error parsing id", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	err = h.service.DeleteProduct(id)
	if err != nil {
		slog.Error("Error deleting product", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	h.jsonH.WriteJSON(w, http.StatusOK, nil)
}

func (h *inventoryHandler) GetProductSummary(w http.ResponseWriter, r *http.Request) {
	slog.Info("GetProductSummary Hit")
	productSummaries, err := h.service.GetProductSummary()
	if err != nil {
		slog.Error("Error getting product summaries", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	h.jsonH.WriteJSON(w, http.StatusOK, productSummaries)
}

// Incoming
func (h *inventoryHandler) GetIncomings(w http.ResponseWriter, r *http.Request) {
	slog.Info("GetIncomings Hit")
	incomings, err := h.service.GetIncomings()
	if err != nil {
		slog.Error("Error getting incomings", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	h.jsonH.WriteJSON(w, http.StatusOK, incomings)
}

func (h *inventoryHandler) GetIncoming(w http.ResponseWriter, r *http.Request) {
	slog.Info("GetIncoming Hit")
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		slog.Error("Error parsing id", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	incoming, err := h.service.GetIncoming(id)
	if err != nil {
		slog.Error("Error getting incoming", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	h.jsonH.WriteJSON(w, http.StatusOK, incoming)
}

func (h *inventoryHandler) CreateIncoming(w http.ResponseWriter, r *http.Request) {
	slog.Info("CreateIncoming Hit")
	incoming := new(models.InventoryIncoming)
	if err := h.jsonH.ReadJSON(w, r, incoming); err != nil {
		slog.Error("Error reading incoming", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	var err error
	incoming, err = h.service.CreateIncoming(incoming)
	if err != nil {
		slog.Error("Error creating incoming", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	h.jsonH.WriteJSON(w, http.StatusOK, incoming)
}

func (h *inventoryHandler) UpdateIncoming(w http.ResponseWriter, r *http.Request) {
	slog.Info("UpdateIncoming Hit")
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		slog.Error("Error parsing id", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	incoming := new(models.InventoryIncoming)
	err = h.jsonH.ReadJSON(w, r, incoming)
	if err != nil {
		slog.Error("Error reading incoming", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	incoming, err = h.service.UpdateIncoming(id, incoming)
	if err != nil {
		slog.Error("Error updating incoming", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	h.jsonH.WriteJSON(w, http.StatusOK, incoming)
}

func (h *inventoryHandler) DeleteIncoming(w http.ResponseWriter, r *http.Request) {
	slog.Info("DeleteIncoming Hit")
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		slog.Error("Error parsing id", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	err = h.service.DeleteIncoming(id)
	if err != nil {
		slog.Error("Error deleting incoming", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	h.jsonH.WriteJSON(w, http.StatusOK, nil)
}

// Outgoing
func (h *inventoryHandler) GetOutgoings(w http.ResponseWriter, r *http.Request) {
	slog.Info("GetOutgoings Hit")
	outgoings, err := h.service.GetOutgoings()
	if err != nil {
		slog.Error("Error getting outgoings", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	h.jsonH.WriteJSON(w, http.StatusOK, outgoings)
}

func (h *inventoryHandler) GetOutgoing(w http.ResponseWriter, r *http.Request) {
	slog.Info("GetOutgoing Hit")
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		slog.Error("Error parsing id", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	outgoing, err := h.service.GetOutgoing(id)
	if err != nil {
		slog.Error("Error getting outgoing", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	h.jsonH.WriteJSON(w, http.StatusOK, outgoing)
}

func (h *inventoryHandler) CreateOutgoing(w http.ResponseWriter, r *http.Request) {
	slog.Info("CreateOutgoing Hit")
	outgoing := new(models.InventoryOutgoing)
	if err := h.jsonH.ReadJSON(w, r, outgoing); err != nil {
		slog.Error("Error reading outgoing", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	var err error
	outgoing, err = h.service.CreateOutgoing(outgoing)
	if err != nil {
		slog.Error("Error creating outgoing", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	h.jsonH.WriteJSON(w, http.StatusOK, outgoing)
}

func (h *inventoryHandler) UpdateOutgoing(w http.ResponseWriter, r *http.Request) {
	slog.Info("UpdateOutgoing Hit")
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		slog.Error("Error parsing id", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	outgoing := new(models.InventoryOutgoing)
	err = h.jsonH.ReadJSON(w, r, outgoing)
	if err != nil {
		slog.Error("Error reading outgoing", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	outgoing, err = h.service.UpdateOutgoing(id, outgoing)
	if err != nil {
		slog.Error("Error updating outgoing", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	h.jsonH.WriteJSON(w, http.StatusOK, outgoing)
}

func (h *inventoryHandler) DeleteOutgoing(w http.ResponseWriter, r *http.Request) {
	slog.Info("DeleteOutgoing Hit")
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		slog.Error("Error parsing id", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	err = h.service.DeleteOutgoing(id)
	if err != nil {
		slog.Error("Error deleting outgoing", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	h.jsonH.WriteJSON(w, http.StatusOK, nil)
}
