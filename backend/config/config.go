package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

type Config struct {
	DBUser      string
	DBPassword  string
	DBName      string
	DBHost      string
	JWTSecret   string
	TLSCertFile string
	TLSKeyFile  string
}

func LoadConfig() *Config {
	cfg := &Config{
		DBUser:      os.Getenv("DB_USER"),
		DBPassword:  os.Getenv("DB_PASSWORD"),
		DBName:      os.Getenv("DB_NAME"),
		DBHost:      os.Getenv("DB_HOST"),
		JWTSecret:   os.Getenv("JWT_SECRET"),
		TLSCertFile: os.Getenv("TLS_CERT_FILE"),
		TLSKeyFile:  os.Getenv("TLS_KEY_FILE"),
	}
	if cfg.DBHost == "" {
		cfg.DBHost = "localhost"
	}
	if cfg.DBUser == "" || cfg.DBPassword == "" || cfg.DBName == "" {
		log.Fatal("Database credentials not fully set. Please set DB_USER, DB_PASSWORD, and DB_NAME environment variables.")
	}
	if cfg.JWTSecret == "" {
		log.Fatal("JWT_SECRET environment variable not set")
	}
	return cfg
}

func ConnectDB(cfg *Config) *sql.DB {
	connStr := fmt.Sprintf("user=%s password=%s dbname=%s host=%s sslmode=disable", cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBHost)
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	if err = db.Ping(); err != nil {
		log.Fatal("Cannot connect to database:", err)
	}
	return db
}
