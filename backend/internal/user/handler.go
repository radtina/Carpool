package user

import (
	"encoding/json"
	"log"
	"net/http"
	"regexp"
	"time"

	"carpool/backend/internal/middleware"

	"github.com/golang-jwt/jwt/v4"
)

type Handler struct {
	Service *Service
	JWTKey  []byte
}

func (h *Handler) RegisterHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST allowed", http.StatusMethodNotAllowed)
		return
	}
	var user User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}
	if err := h.Service.Register(&user); err != nil {
		http.Error(w, "Error registering user", http.StatusInternalServerError)
		return
	}
	user.Password = ""
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(user)
}

func (h *Handler) LoginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST allowed", http.StatusMethodNotAllowed)
		return
	}
	var creds struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		log.Printf("Error decoding login request: %v", err)
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	// Debug: log the login attempt
	log.Printf("Login attempt for email: %s", creds.Email)

	user, err := h.Service.Login(creds.Email, creds.Password)
	if err != nil {
		// Debug: log detailed error information
		log.Printf("Login error for email %s: %v", creds.Email, err)
		http.Error(w, "User not found or invalid password", http.StatusUnauthorized)
		return
	}

	log.Printf("User found: %+v", user)
	log.Printf("Stored hash: %s", user.Password) // Log the stored hash for debugging

	expirationTime := time.Now().Add(1 * time.Hour)
	claims := jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"exp":     expirationTime.Unix(),
		"iat":     time.Now().Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(h.JWTKey)
	if err != nil {
		log.Printf("Error signing token for email %s: %v", creds.Email, err)
		http.Error(w, "Could not generate token", http.StatusInternalServerError)
		return
	}

	log.Printf("Login successful for email %s, token: %s", creds.Email, tokenString)
	json.NewEncoder(w).Encode(map[string]string{"token": tokenString})
}

func (h *Handler) GetProfileHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Only GET allowed", http.StatusMethodNotAllowed)
		return
	}
	userID := middleware.GetUserIDFromContext(r.Context())
	user, err := h.Service.GetUserByID(userID)
	if err != nil {
		http.Error(w, "Error fetching profile", http.StatusInternalServerError)
		return
	}
	user.Password = ""
	json.NewEncoder(w).Encode(user)
}

func (h *Handler) UpdateProfileHandler(w http.ResponseWriter, r *http.Request) {
	// Only updates the phone number.
	if r.Method != http.MethodPatch {
		http.Error(w, "Only PATCH allowed", http.StatusMethodNotAllowed)
		return
	}
	userID := middleware.GetUserIDFromContext(r.Context())
	var updates struct {
		Phone string `json:"phone"`
	}
	if err := json.NewDecoder(r.Body).Decode(&updates); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}
	if updates.Phone != "" {
		// Validate phone is numeric
		matched, err := regexp.MatchString(`^[0-9]*$`, updates.Phone)
		if err != nil || !matched {
			http.Error(w, "Phone must contain only numbers", http.StatusBadRequest)
			return
		}
	}
	updatedUser, err := h.Service.UpdateUserProfile(userID, updates.Phone)
	if err != nil {
		http.Error(w, "Error updating profile", http.StatusInternalServerError)
		return
	}
	updatedUser.Password = ""
	json.NewEncoder(w).Encode(updatedUser)
}

func (h *Handler) ChangePasswordHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPatch {
		http.Error(w, "Only PATCH allowed", http.StatusMethodNotAllowed)
		return
	}
	userID := middleware.GetUserIDFromContext(r.Context())
	var pwd struct {
		CurrentPassword string `json:"currentPassword"`
		NewPassword     string `json:"newPassword"`
	}
	if err := json.NewDecoder(r.Body).Decode(&pwd); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}
	if err := h.Service.ChangeUserPassword(userID, pwd.CurrentPassword, pwd.NewPassword); err != nil {
		http.Error(w, "Error changing password", http.StatusUnauthorized)
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Password changed successfully"})
}
