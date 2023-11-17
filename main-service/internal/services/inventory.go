package services

import (
	"context"
	"database/sql"
	"log/slog"

	"github.com/kokweikhong/calvary-admin-system/main-service/internal/db"
	"github.com/kokweikhong/calvary-admin-system/main-service/internal/models"
)

type InventoryService interface {
	GetProducts() ([]*models.InventoryProduct, error)
	GetProduct(id int) (*models.InventoryProduct, error)
	CreateProduct(product *models.InventoryProduct) (*models.InventoryProduct, error)
	UpdateProduct(id int, product *models.InventoryProduct) (*models.InventoryProduct, error)
	DeleteProduct(id int) error
}

type inventoryService struct {
	db *sql.DB
}

func NewInventoryService() InventoryService {
	return &inventoryService{
		db: db.GetDB(),
	}
}

func (s *inventoryService) GetProducts() ([]*models.InventoryProduct, error) {
	queryStr := `
		SELECT
			id,
			code,
			name,
			brand,
			standard_unit,
			thumbnail,
			supplier,
			remarks,
			is_exist,
			created_by,
			created_at,
			updated_by,
			updated_at
		FROM
			inventory_products
	`

	// execute query with context, transaction, and arguments
	rows, err := s.db.QueryContext(context.Background(), queryStr)
	if err != nil {
		slog.Error("Error querying products", "error", err)
		return nil, err
	}

	// close rows after function returns
	defer rows.Close()

	// iterate over rows
	var products []*models.InventoryProduct
	for rows.Next() {
		product := new(models.InventoryProduct)
		err := rows.Scan(
			&product.ID,
			&product.Code,
			&product.Name,
			&product.Brand,
			&product.StandardUnit,
			&product.Thumbnail,
			&product.Supplier,
			&product.Remarks,
			&product.IsExist,
			&product.CreatedBy,
			&product.CreatedAt,
			&product.UpdatedBy,
			&product.UpdatedAt,
		)
		if err != nil {
			slog.Error("Error scanning product", "error", err)
			return nil, err
		}

		products = append(products, product)
	}

	// check for errors after iterating over rows
	if err := rows.Err(); err != nil {
		slog.Error("Error iterating over products", "error", err)
		return nil, err
	}

	slog.Info("Successfully queried products", "products", len(products))

	return products, nil
}

func (s *inventoryService) GetProduct(id int) (*models.InventoryProduct, error) {
	queryStr := `
		SELECT
			id,
			code,
			name,
			brand,
			standard_unit,
			thumbnail,
			supplier,
			remarks,
			is_exist,
			created_by,
			created_at,
			updated_by,
			updated_at
		FROM
			inventory_products
		WHERE
			id = $1
	`

	// database execute with commit, transaction, context and commit
	row := s.db.QueryRowContext(context.Background(), queryStr, id)

	product := new(models.InventoryProduct)
	err := row.Scan(
		&product.ID,
		&product.Code,
		&product.Name,
		&product.Brand,
		&product.StandardUnit,
		&product.Thumbnail,
		&product.Supplier,
		&product.Remarks,
		&product.IsExist,
		&product.CreatedBy,
		&product.CreatedAt,
		&product.UpdatedBy,
		&product.UpdatedAt,
	)
	if err != nil {
		slog.Error("Error scanning product", "error", err)
		return nil, err
	}

	slog.Info("Successfully queried product", "product", product)

	return product, nil
}

func (s *inventoryService) CreateProduct(product *models.InventoryProduct) (*models.InventoryProduct, error) {
	queryStr := `
		INSERT INTO inventory_products (
			code,
			name,
			brand,
			standard_unit,
			thumbnail,
			supplier,
			remarks,
			is_exist,
			created_by,
			created_at,
			updated_by,
			updated_at
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), $10, NOW()
		)
	`

	// database execute with commit, transaction, context and commit
	_, err := s.db.ExecContext(
		context.Background(),
		queryStr,
		product.Code,
		product.Name,
		product.Brand,
		product.StandardUnit,
		product.Thumbnail,
		product.Supplier,
		product.Remarks,
		product.IsExist,
		product.CreatedBy,
		product.UpdatedBy,
	)
	if err != nil {
		slog.Error("Error inserting product", "error", err)
		return nil, err
	}

	slog.Info("Successfully inserted product", "product", product)

	return product, nil
}

func (s *inventoryService) UpdateProduct(id int, product *models.InventoryProduct) (*models.InventoryProduct, error) {
	queryStr := `
		UPDATE
			inventory_products
		SET
			code = $1,
			name = $2,
			brand = $3,
			standard_unit = $4,
			thumbnail = $5,
			supplier = $6,
			remarks = $7,
			is_exist = $8,
			updated_by = $9,
			updated_at = NOW()
		WHERE
			id = $10
	`

	// database execute with commit, transaction, context and commit
	_, err := s.db.ExecContext(
		context.Background(),
		queryStr,
		product.Code,
		product.Name,
		product.Brand,
		product.StandardUnit,
		product.Thumbnail,
		product.Supplier,
		product.Remarks,
		product.IsExist,
		product.UpdatedBy,
		id,
	)
	if err != nil {
		slog.Error("Error updating product", "error", err)
		return nil, err
	}

	slog.Info("Successfully updated product", "product", product)

	return product, nil
}

func (s *inventoryService) DeleteProduct(id int) error {
	queryStr := `
		DELETE FROM
			inventory_products
		WHERE
			id = $1
	`

	// database execute with commit, transaction, context and commit
	_, err := s.db.ExecContext(
		context.Background(),
		queryStr,
		id,
	)
	if err != nil {
		slog.Error("Error deleting product", "error", err)
		return err
	}

	slog.Info("Successfully deleted product", "product", id)

	return nil
}
