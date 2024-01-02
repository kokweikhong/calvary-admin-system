package config

import (
	"fmt"
	"log/slog"
	"os"
	"path/filepath"

	"github.com/joho/godotenv"
)

type Config struct {
	PostgresHost     string
	PostgresPort     string
	PostgresUser     string
	PostgresPassword string
	PostgresDBName   string
	ServerPort       string
	JWTSecret        string
}

var Cfg = new(Config)

func Init() error {
	wd, err := os.Getwd()
	if err != nil {
		slog.Error("Error getting working directory", "error", err)
		return err
	}

	envLocation := filepath.Join(wd + "/.env")

	if err := godotenv.Load(envLocation); err != nil {
		slog.Error(fmt.Sprintf("Error loading .env file from %s", envLocation), "error", err)
		// return err
	}

	Cfg.PostgresHost = os.Getenv("POSTGRES_HOST")
	Cfg.PostgresPort = os.Getenv("POSTGRES_PORT")
	Cfg.PostgresUser = os.Getenv("POSTGRES_USER")
	Cfg.PostgresPassword = os.Getenv("POSTGRES_PASSWORD")
	Cfg.PostgresDBName = os.Getenv("POSTGRES_DB_NAME")

	Cfg.ServerPort = os.Getenv("SERVER_PORT")

	Cfg.JWTSecret = os.Getenv("JWT_SECRET")

	slog.Info("Config loaded successfully", "config", Cfg)

	return nil
}
