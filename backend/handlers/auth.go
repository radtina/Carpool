package handlers

import (
	"carpool/backend/models"
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
)

// DB and JWTKey will be set from main.
var DB *sql.DB
var JWTKey []byte

// SetDependencies initializes dependencies for the auth handlers.
func SetDependencies(db *sql.DB, jwtKeyParam []byte) {
	DB = db
	JWTKey = jwtKeyParam
}

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST allowed", http.StatusMethodNotAllowed)
		return
	}

	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Error processing password", http.StatusInternalServerError)
		return
	}

	query := `INSERT INTO users (name, email, password, created_at) VALUES ($1, $2, $3, $4) RETURNING user_id, created_at`
	err = DB.QueryRow(query, user.Name, user.Email, string(hashedPassword), time.Now()).Scan(&user.ID, &user.CreatedAt)
	if err != nil {
		log.Println("Error registering user:", err)
		http.Error(w, "Error registering user", http.StatusInternalServerError)
		return
	}

	user.Password = ""
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(user)
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST allowed", http.StatusMethodNotAllowed)
		return
	}

	var creds models.User
	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	var storedUser models.User
	query := `SELECT user_id, name, email, password, created_at FROM users WHERE email = $1`
	err := DB.QueryRow(query, creds.Email).Scan(&storedUser.ID, &storedUser.Name, &storedUser.Email, &storedUser.Password, &storedUser.CreatedAt)
	if err != nil {
		http.Error(w, "User not found", http.StatusUnauthorized)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(storedUser.Password), []byte(creds.Password)); err != nil {
		http.Error(w, "Invalid password", http.StatusUnauthorized)
		return
	}

	expirationTime := time.Now().Add(1 * time.Hour)
	claims := &models.Claims{
		UserID: storedUser.ID,
		Email:  storedUser.Email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(JWTKey)
	if err != nil {
		http.Error(w, "Could not generate token", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"token": tokenString})
}

func ProtectedHandler(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(map[string]string{"message": "Welcome to the protected route!"})
}