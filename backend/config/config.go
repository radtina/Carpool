package config

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/lib/pq"
)

type Config struct {
	JWTSecret   string
	TLSCertFile string
	TLSKeyFile  string
}

func LoadConfig() *Config {
	cfg := &Config{
		JWTSecret:   os.Getenv("JWT_SECRET"),
		TLSCertFile: os.Getenv("TLS_CERT_FILE"),
		TLSKeyFile:  os.Getenv("TLS_KEY_FILE"),
	}
	if cfg.JWTSecret == "" {
		log.Fatal("JWT_SECRET environment variable not set")
	}
	return cfg
}

func ConnectDB() *sql.DB {
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		log.Fatal("DATABASE_URL environment variable not set")
	}
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	if err = db.Ping(); err != nil {
		log.Fatal("Cannot connect to database:", err)
	}
	return db
}
