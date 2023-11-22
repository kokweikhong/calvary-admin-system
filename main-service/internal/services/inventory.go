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
	GetProductSummary() ([]*models.InventoryProductSummary, error)

	GetIncomings() ([]*models.InventoryIncoming, error)
	GetIncoming(id int) (*models.InventoryIncoming, error)
	CreateIncoming(incoming *models.InventoryIncoming) (*models.InventoryIncoming, error)
	UpdateIncoming(id int, incoming *models.InventoryIncoming) (*models.InventoryIncoming, error)
	DeleteIncoming(id int) error

	GetOutgoings() ([]*models.InventoryOutgoing, error)
	GetOutgoing(id int) (*models.InventoryOutgoing, error)
	CreateOutgoing(outgoing *models.InventoryOutgoing) (*models.InventoryOutgoing, error)
	UpdateOutgoing(id int, outgoing *models.InventoryOutgoing) (*models.InventoryOutgoing, error)
	DeleteOutgoing(id int) error
}

type inventoryService struct {
	db *sql.DB
}

func NewInventoryService() InventoryService {
	return &inventoryService{
		db: db.GetDB(),
	}
}

// Product
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
	products := []*models.InventoryProduct{}
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

func (s *inventoryService) GetProductSummary() ([]*models.InventoryProductSummary, error) {
	queryStr := `
		SELECT
			p.id,
			p.code,
			p.name,
			p.brand,
			p.standard_unit,
			p.thumbnail,
			p.supplier,
			p.remarks,
			p.is_exist,
			p.created_by,
			p.created_at,
			p.updated_by,
			p.updated_at,
			COALESCE(SUM(i.standard_quantity), 0) AS total_incoming,
			COALESCE(SUM(o.standard_quantity), 0) AS total_outgoing,
			COALESCE(SUM(i.standard_quantity), 0) - COALESCE(SUM(o.standard_quantity), 0) AS total_balance
		FROM
			inventory_products p
		LEFT JOIN
			inventory_incomings i
		ON
			p.id = i.product_id
		LEFT JOIN
			inventory_outgoings o
		ON
			p.id = o.product_id
		GROUP BY
			p.id
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
	products := []*models.InventoryProductSummary{}
	for rows.Next() {
		product := new(models.InventoryProductSummary)
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
			&product.TotalIncoming,
			&product.TotalOutgoing,
			&product.TotalBalance,
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

// Incoming
func (s *inventoryService) GetIncomings() ([]*models.InventoryIncoming, error) {
	queryStr := `
		SELECT
			i.id,
			i.product_id,
			i.status,
			i.quantity,
			i.length,
			i.width,
			i.height,
			i.unit,
			i.standard_quantity,
			i.ref_no,
			i.ref_doc,
			i.cost,
			i.store_location,
			i.store_country,
			i.remarks,
			i.created_by,
			i.created_at,
			i.updated_by,
			i.updated_at,
			p.code AS product_code,
			p.name AS product_name,
			p.standard_unit AS standard_unit
		FROM
			inventory_incomings i
		LEFT JOIN
			inventory_products p
		ON
			i.product_id = p.id
	`

	// execute query with context, transaction, and arguments
	rows, err := s.db.QueryContext(context.Background(), queryStr)
	if err != nil {
		slog.Error("Error querying incomings", "error", err)
		return nil, err
	}

	// close rows after function returns
	defer rows.Close()

	// iterate over rows
	var incomings []*models.InventoryIncoming
	for rows.Next() {
		incoming := new(models.InventoryIncoming)
		err := rows.Scan(
			&incoming.ID,
			&incoming.ProductID,
			&incoming.Status,
			&incoming.Quantity,
			&incoming.Length,
			&incoming.Width,
			&incoming.Height,
			&incoming.Unit,
			&incoming.StandardQuantity,
			&incoming.RefNo,
			&incoming.RefDoc,
			&incoming.Cost,
			&incoming.StoreLocation,
			&incoming.StoreCountry,
			&incoming.Remarks,
			&incoming.CreatedBy,
			&incoming.CreatedAt,
			&incoming.UpdatedBy,
			&incoming.UpdatedAt,
			&incoming.ProductCode,
			&incoming.ProductName,
			&incoming.StandardUnit,
		)
		if err != nil {
			slog.Error("Error scanning incoming", "error", err)
			return nil, err
		}

		incomings = append(incomings, incoming)
	}

	// check for errors after iterating over rows
	if err := rows.Err(); err != nil {
		slog.Error("Error iterating over incomings", "error", err)
		return nil, err
	}

	slog.Info("Successfully queried incomings", "incomings", len(incomings))

	return incomings, nil
}

func (s *inventoryService) GetIncoming(id int) (*models.InventoryIncoming, error) {
	queryStr := `
		SELECT
			id,
			product_id,
			status,
			quantity,
			length,
			width,
			height,
			unit,
			standard_quantity,
			ref_no,
			ref_doc,
			cost,
			store_location,
			store_country,
			remarks,
			created_by,
			created_at,
			updated_by,
			updated_at
		FROM
			inventory_incomings
		WHERE
			id = $1
	`

	// database execute with commit, transaction, context and commit
	row := s.db.QueryRowContext(context.Background(), queryStr, id)

	incoming := new(models.InventoryIncoming)
	err := row.Scan(
		&incoming.ID,
		&incoming.ProductID,
		&incoming.Status,
		&incoming.Quantity,
		&incoming.Length,
		&incoming.Width,
		&incoming.Height,
		&incoming.Unit,
		&incoming.StandardQuantity,
		&incoming.RefNo,
		&incoming.RefDoc,
		&incoming.Cost,
		&incoming.StoreLocation,
		&incoming.StoreCountry,
		&incoming.Remarks,
		&incoming.CreatedBy,
		&incoming.CreatedAt,
		&incoming.UpdatedBy,
		&incoming.UpdatedAt,
	)
	if err != nil {
		slog.Error("Error scanning incoming", "error", err)
		return nil, err
	}

	slog.Info("Successfully queried incoming", "incoming", incoming)

	return incoming, nil
}

func (s *inventoryService) CreateIncoming(incoming *models.InventoryIncoming) (*models.InventoryIncoming, error) {
	queryStr := `
		INSERT INTO inventory_incomings (
			product_id,
			status,
			quantity,
			length,
			width,
			height,
			unit,
			standard_quantity,
			ref_no,
			ref_doc,
			cost,
			store_location,
			store_country,
			remarks,
			created_by,
			created_at,
			updated_by,
			updated_at
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
			$11, $12, $13, $14, $15, NOW(), $16, NOW()
		)
	`

	// database execute with commit, transaction, context and commit
	_, err := s.db.ExecContext(
		context.Background(),
		queryStr,
		incoming.ProductID,
		incoming.Status,
		incoming.Quantity,
		incoming.Length,
		incoming.Width,
		incoming.Height,
		incoming.Unit,
		incoming.StandardQuantity,
		incoming.RefNo,
		incoming.RefDoc,
		incoming.Cost,
		incoming.StoreLocation,
		incoming.StoreCountry,
		incoming.Remarks,
		incoming.CreatedBy,
		incoming.UpdatedBy,
	)
	if err != nil {
		slog.Error("Error inserting incoming", "error", err)
		return nil, err
	}

	slog.Info("Successfully inserted incoming", "incoming", incoming)

	return incoming, nil
}

func (s *inventoryService) UpdateIncoming(id int, incoming *models.InventoryIncoming) (*models.InventoryIncoming, error) {
	queryStr := `
		UPDATE
			inventory_incomings
		SET
			product_id = $1,
			status = $2,
			quantity = $3,
			length = $4,
			width = $5,
			height = $6,
			unit = $7,
			standard_quantity = $8,
			ref_no = $9,
			ref_doc = $10,
			cost = $11,
			store_location = $12,
			store_country = $13,
			remarks = $14,
			updated_by = $15,
			updated_at = NOW()
		WHERE
			id = $16
	`

	// database execute with commit, transaction, context and commit
	_, err := s.db.ExecContext(
		context.Background(),
		queryStr,
		incoming.ProductID,
		incoming.Status,
		incoming.Quantity,
		incoming.Length,
		incoming.Width,
		incoming.Height,
		incoming.Unit,
		incoming.StandardQuantity,
		incoming.RefNo,
		incoming.RefDoc,
		incoming.Cost,
		incoming.StoreLocation,
		incoming.StoreCountry,
		incoming.Remarks,
		incoming.UpdatedBy,
		id,
	)
	if err != nil {
		slog.Error("Error updating incoming", "error", err)
		return nil, err
	}

	slog.Info("Successfully updated incoming", "incoming", incoming)

	return incoming, nil
}

func (s *inventoryService) DeleteIncoming(id int) error {
	queryStr := `
		DELETE FROM
			inventory_incomings
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
		slog.Error("Error deleting incoming", "error", err)
		return err
	}

	slog.Info("Successfully deleted incoming", "incoming", id)

	return nil
}

// Outgoing
func (s *inventoryService) GetOutgoings() ([]*models.InventoryOutgoing, error) {
	queryStr := `
		SELECT
			id,
			incoming_id,
			product_id,
			status,
			quantity,
			standard_quantity,
			cost,
			ref_no,
			ref_doc,
			remarks,
			created_by,
			created_at,
			updated_by,
			updated_at
		FROM
			inventory_outgoings
	`

	// execute query with context, transaction, and arguments
	rows, err := s.db.QueryContext(context.Background(), queryStr)
	if err != nil {
		slog.Error("Error querying outgoings", "error", err)
		return nil, err
	}

	// close rows after function returns
	defer rows.Close()

	// iterate over rows
	var outgoings []*models.InventoryOutgoing
	for rows.Next() {
		outgoing := new(models.InventoryOutgoing)
		err := rows.Scan(
			&outgoing.ID,
			&outgoing.IncomingID,
			&outgoing.ProductID,
			&outgoing.Status,
			&outgoing.Quantity,
			&outgoing.StandardQuantity,
			&outgoing.Cost,
			&outgoing.RefNo,
			&outgoing.RefDoc,
			&outgoing.Remarks,
			&outgoing.CreatedBy,
			&outgoing.CreatedAt,
			&outgoing.UpdatedBy,
			&outgoing.UpdatedAt,
		)
		if err != nil {
			slog.Error("Error scanning outgoing", "error", err)
			return nil, err
		}

		outgoings = append(outgoings, outgoing)
	}

	// check for errors after iterating over rows
	if err := rows.Err(); err != nil {
		slog.Error("Error iterating over outgoings", "error", err)
		return nil, err
	}

	slog.Info("Successfully queried outgoings", "outgoings", len(outgoings))

	return outgoings, nil
}

func (s *inventoryService) GetOutgoing(id int) (*models.InventoryOutgoing, error) {
	queryStr := `
		SELECT
			id,
			incoming_id,
			product_id,
			status,
			quantity,
			standard_quantity,
			cost,
			ref_no,
			ref_doc,
			remarks,
			created_by,
			created_at,
			updated_by,
			updated_at
		FROM
			inventory_outgoings
		WHERE
			id = $1
	`

	// database execute with commit, transaction, context and commit
	row := s.db.QueryRowContext(context.Background(), queryStr, id)

	outgoing := new(models.InventoryOutgoing)
	err := row.Scan(
		&outgoing.ID,
		&outgoing.IncomingID,
		&outgoing.ProductID,
		&outgoing.Status,
		&outgoing.Quantity,
		&outgoing.StandardQuantity,
		&outgoing.Cost,
		&outgoing.RefNo,
		&outgoing.RefDoc,
		&outgoing.Remarks,
		&outgoing.CreatedBy,
		&outgoing.CreatedAt,
		&outgoing.UpdatedBy,
		&outgoing.UpdatedAt,
	)
	if err != nil {
		slog.Error("Error scanning outgoing", "error", err)
		return nil, err
	}

	slog.Info("Successfully queried outgoing", "outgoing", outgoing)

	return outgoing, nil
}

func (s *inventoryService) CreateOutgoing(outgoing *models.InventoryOutgoing) (*models.InventoryOutgoing, error) {
	queryStr := `
		INSERT INTO inventory_outgoings (
			incoming_id,
			product_id,
			status,
			quantity,
			standard_quantity,
			cost,
			ref_no,
			ref_doc,
			remarks,
			created_by,
			created_at,
			updated_by,
			updated_at
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9,
			$10, NOW(), $11, NOW()
		)
	`

	// database execute with commit, transaction, context and commit
	_, err := s.db.ExecContext(
		context.Background(),
		queryStr,
		outgoing.IncomingID,
		outgoing.ProductID,
		outgoing.Status,
		outgoing.Quantity,
		outgoing.StandardQuantity,
		outgoing.Cost,
		outgoing.RefNo,
		outgoing.RefDoc,
		outgoing.Remarks,
		outgoing.CreatedBy,
		outgoing.UpdatedBy,
	)
	if err != nil {
		slog.Error("Error inserting outgoing", "error", err)
		return nil, err
	}

	slog.Info("Successfully inserted outgoing", "outgoing", outgoing)

	return outgoing, nil
}

func (s *inventoryService) UpdateOutgoing(id int, outgoing *models.InventoryOutgoing) (*models.InventoryOutgoing, error) {
	queryStr := `
		UPDATE
			inventory_outgoings
		SET
			incoming_id = $1,
			product_id = $2,
			status = $3,
			quantity = $4,
			standard_quantity = $5,
			cost = $6,
			ref_no = $7,
			ref_doc = $8,
			remarks = $9,
			updated_by = $10,
			updated_at = NOW()
		WHERE
			id = $11
	`

	// database execute with commit, transaction, context and commit
	_, err := s.db.ExecContext(
		context.Background(),
		queryStr,
		outgoing.IncomingID,
		outgoing.ProductID,
		outgoing.Status,
		outgoing.Quantity,
		outgoing.StandardQuantity,
		outgoing.Cost,
		outgoing.RefNo,
		outgoing.RefDoc,
		outgoing.Remarks,
		outgoing.UpdatedBy,
		id,
	)
	if err != nil {
		slog.Error("Error updating outgoing", "error", err)
		return nil, err
	}

	slog.Info("Successfully updated outgoing", "outgoing", outgoing)

	return outgoing, nil
}

func (s *inventoryService) DeleteOutgoing(id int) error {
	queryStr := `
		DELETE FROM
			inventory_outgoings
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
		slog.Error("Error deleting outgoing", "error", err)
		return err
	}

	slog.Info("Successfully deleted outgoing", "outgoing", id)

	return nil
}
