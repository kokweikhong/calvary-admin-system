package db

import (
	"database/sql"
	"fmt"
	"log/slog"

	"github.com/kokweikhong/calvary-admin-system/main-service/internal/config"
	_ "github.com/lib/pq"
)

var db *sql.DB

func Init() error {
	connStr := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		config.Cfg.PostgresHost,
		config.Cfg.PostgresPort,
		config.Cfg.PostgresUser,
		config.Cfg.PostgresPassword,
		config.Cfg.PostgresDBName,
	)

	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		slog.Error("Error opening database connection", "error", err)
		return err
	}

	if err := db.Ping(); err != nil {
		slog.Error("Error pinging database", "error", err)
		return err
	}

	return nil
}

func GetDB() *sql.DB {
	return db
}

func Close() {
	db.Close()
}

func BeginTx() (*sql.Tx, error) {
	return db.Begin()
}
