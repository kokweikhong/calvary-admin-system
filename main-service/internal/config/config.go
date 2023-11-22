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
	ServerPort       string
}

var Cfg = new(Config)

func Init() error {
	wd, err := os.Getwd()
	if err != nil {
		slog.Error("Error getting working directory", "error", err)
		return err
	}

	envLocation := wd + "/.env"

	if err := godotenv.Load(envLocation); err != nil {
		slog.Error("Error loading .env file", "error", err)
		return err
	}

	Cfg.PostgresHost = os.Getenv("POSTGRES_HOST")
	Cfg.PostgresPort = os.Getenv("POSTGRES_PORT")
	Cfg.PostgresUser = os.Getenv("POSTGRES_USER")
	Cfg.PostgresPassword = os.Getenv("POSTGRES_PASSWORD")
	Cfg.PostgresDBName = os.Getenv("POSTGRES_DB_NAME")

	Cfg.ServerPort = os.Getenv("SERVER_PORT")

	return nil
}
