package models

type InventoryProduct struct {
	ID           int    `json:"id" db:"id"`
	Code         string `json:"code" db:"code"`
	Name         string `json:"name" db:"name"`
	Brand        string `json:"brand" db:"brand"`
	StandardUnit string `json:"standardUnit" db:"standard_unit"`
	Thumbnail    string `json:"thumbnail" db:"thumbnail"`
	Supplier     string `json:"supplier" db:"supplier"`
	Remarks      string `json:"remarks" db:"remarks"`
	IsExist      bool   `json:"isExist" db:"is_exist"`
	CreatedBy    string `json:"createdBy" db:"created_by"`
	CreatedAt    string `json:"createdAt" db:"created_at"`
	UpdatedBy    string `json:"updatedBy" db:"updated_by"`
	UpdatedAt    string `json:"updatedAt" db:"updated_at"`
}
type InventoryIncoming struct {
	ID               int     `json:"id" db:"id"`
	ProductID        int     `json:"productId" db:"product_id"`
	Status           string  `json:"status" db:"status"`
	Quantity         float64 `json:"quantity" db:"quantity"`
	Length           float64 `json:"length" db:"length"`
	Width            float64 `json:"width" db:"width"`
	Height           float64 `json:"height" db:"height"`
	Unit             string  `json:"unit" db:"unit"`
	StandardQuantity float64 `json:"standardQuantity" db:"standard_quantity"`
	RefNo            string  `json:"refNo" db:"ref_no"`
	RefDoc           string  `json:"refDoc" db:"ref_doc"`
	Cost             float64 `json:"cost" db:"cost"`
	StoreLocation    string  `json:"storeLocation" db:"store_location"`
	StoreCountry     string  `json:"storeCountry" db:"store_country"`
	Remarks          string  `json:"remarks" db:"remarks"`
	CreatedBy        string  `json:"createdBy" db:"created_by"`
	CreatedAt        string  `json:"createdAt" db:"created_at"`
	UpdatedBy        string  `json:"updatedBy" db:"updated_by"`
	UpdatedAt        string  `json:"updatedAt" db:"updated_at"`

	ProductCode  string `json:"productCode" db:"product_code"`
	ProductName  string `json:"productName" db:"product_name"`
	StandardUnit string `json:"standardUnit" db:"standard_unit"`
}

type InventoryOutgoing struct {
	ID               int     `json:"id" db:"id"`
	IncomingID       int     `json:"incomingId" db:"incoming_id"`
	ProductID        int     `json:"productId" db:"product_id"`
	Status           string  `json:"status" db:"status"`
	Quantity         float64 `json:"quantity" db:"quantity"`
	StandardQuantity float64 `json:"standardQuantity" db:"standard_quantity"`
	Cost             float64 `json:"cost" db:"cost"`
	RefNo            string  `json:"refNo" db:"ref_no"`
	RefDoc           string  `json:"refDoc" db:"ref_doc"`
	Remarks          string  `json:"remarks" db:"remarks"`
	CreatedBy        string  `json:"createdBy" db:"created_by"`
	CreatedAt        string  `json:"createdAt" db:"created_at"`
	UpdatedBy        string  `json:"updatedBy" db:"updated_by"`
	UpdatedAt        string  `json:"updatedAt" db:"updated_at"`
}

type InventoryProductSummary struct {
	InventoryProduct
	TotalIncoming float64 `json:"totalIncoming" db:"total_incoming"`
	TotalOutgoing float64 `json:"totalOutgoing" db:"total_outgoing"`
	TotalBalance  float64 `json:"totalBalance" db:"total_balance"`
}
