package booking

import (
	"encoding/json"
	"net/http"

	"carpool/backend/internal/middleware"
)

type Handler struct {
	Service *Service
}

func (h *Handler) CreateBookingHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST allowed", http.StatusMethodNotAllowed)
		return
	}
	var b Booking
	if err := json.NewDecoder(r.Body).Decode(&b); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}
	// Get authenticated user's ID from JWT middleware context.
	b.UserID = middleware.GetUserIDFromContext(r.Context())
	if err := h.Service.CreateBooking(&b); err != nil {
		http.Error(w, "Error creating booking", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(b)
}

func (h *Handler) GetUserBookingsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Only GET allowed", http.StatusMethodNotAllowed)
		return
	}
	userID := middleware.GetUserIDFromContext(r.Context())
	bookings, err := h.Service.GetUserBookings(userID)
	if err != nil {
		http.Error(w, "Error fetching bookings", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(bookings)
}
