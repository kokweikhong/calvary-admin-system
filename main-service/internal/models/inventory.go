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
