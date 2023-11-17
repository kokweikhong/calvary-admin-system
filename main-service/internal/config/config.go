package config

import (
	"log/slog"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	PostgresHost     string
	PostgresPort     string
	PostgresUser     string
	PostgresPassword string
	PostgresDBName   string
}

var Cfg = new(Config)

func Init() error {
	if err := godotenv.Load(); err != nil {
		slog.Error("Error loading .env file", "error", err)
		return err
	}

	Cfg.PostgresHost = os.Getenv("POSTGRES_HOST")
	Cfg.PostgresPort = os.Getenv("POSTGRES_PORT")
	Cfg.PostgresUser = os.Getenv("POSTGRES_USER")
	Cfg.PostgresPassword = os.Getenv("POSTGRES_PASSWORD")
	Cfg.PostgresDBName = os.Getenv("POSTGRES_DB_NAME")

	return nil
}
