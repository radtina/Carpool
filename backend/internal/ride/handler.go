package ride

import (
	"encoding/json"
	"net/http"
	"strconv"

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
	// Expect JSON payload with coordinate fields: from_lon, from_lat, to_lon, to_lat, etc.
	if err := json.NewDecoder(r.Body).Decode(&ride); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	// Set the authenticated user's ID from the JWT middleware context.
	ride.UserID = middleware.GetUserIDFromContext(r.Context())

	if err := h.Service.CreateRide(&ride); err != nil {
		http.Error(w, "Error posting ride", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(ride)
}

// SearchRidesHandler performs a geospatial search using coordinate query parameters.
func (h *Handler) SearchRidesHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Only GET allowed", http.StatusMethodNotAllowed)
		return
	}

	// Retrieve coordinate parameters from the query string.
	fromLonStr := r.URL.Query().Get("fromLon")
	fromLatStr := r.URL.Query().Get("fromLat")
	toLonStr := r.URL.Query().Get("toLon")
	toLatStr := r.URL.Query().Get("toLat")

	fromLon, err1 := strconv.ParseFloat(fromLonStr, 64)
	fromLat, err2 := strconv.ParseFloat(fromLatStr, 64)
	toLon, err3 := strconv.ParseFloat(toLonStr, 64)
	toLat, err4 := strconv.ParseFloat(toLatStr, 64)
	if err1 != nil || err2 != nil || err3 != nil || err4 != nil {
		http.Error(w, "Invalid or missing coordinate parameters", http.StatusBadRequest)
		return
	}

	rides, err := h.Service.SearchRidesGeo(fromLon, fromLat, toLon, toLat)
	if err != nil {
		http.Error(w, "Error searching rides", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(rides)
}
