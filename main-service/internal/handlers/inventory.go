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
}

type inventoryHandler struct {
	jsonH   utils.JSONHandler
	service services.InventoryService
}

func NewInventoryHandler(service services.InventoryService) InventoryHandler {
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

	// get data from multipart/form-data
	// thumbnail might be empty string or file
	err := r.ParseMultipartForm(1048576) // one megabyte
	if err != nil {
		slog.Error("Error parsing multipart form", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	// get data from form
	product.Code = r.FormValue("code")
	product.Name = r.FormValue("name")
	product.Brand = r.FormValue("brand")
	product.StandardUnit = r.FormValue("standard_unit")
	product.Supplier = r.FormValue("supplier")
	product.Remarks = r.FormValue("remarks")
	product.IsExist, err = strconv.ParseBool(r.FormValue("is_exist"))
	if err != nil {
		slog.Error("Error parsing is_exist", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}
	product.CreatedBy = r.FormValue("created_by")
	product.UpdatedBy = r.FormValue("updated_by")

	// get file from form
	file, header, err := r.FormFile("thumbnail")
	if err != nil {
		slog.Error("Error getting thumbnail", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}
	defer file.Close()

	// upload file to cloud storage
	filename, err := utils.UploadFile(file, header.Filename, "inventory")
	if err != nil {
		slog.Error("Error uploading thumbnail", "error", err)
		h.jsonH.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	product.Thumbnail = filename

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
