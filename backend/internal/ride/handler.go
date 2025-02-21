package ride

import (
	"encoding/json"
	"net/http"

	"carpool/backend/internal/middleware"
)

type Handler struct {
	Service *Service
}

func (h *Handler) PostRideHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST allowed", http.StatusMethodNotAllowed)
		return
	}
	var ride Ride
	if err := json.NewDecoder(r.Body).Decode(&ride); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}
	// Set the authenticated user's ID (assumed set by JWT middleware)
	ride.UserID = middleware.GetUserIDFromContext(r.Context())
	if err := h.Service.CreateRide(&ride); err != nil {
		http.Error(w, "Error posting ride", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(ride)
}

func (h *Handler) SearchRidesHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Only GET allowed", http.StatusMethodNotAllowed)
		return
	}
	from := r.URL.Query().Get("from")
	to := r.URL.Query().Get("to")
	rides, err := h.Service.SearchRides(from, to)
	if err != nil {
		http.Error(w, "Error searching rides", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(rides)
}