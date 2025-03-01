package ride

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"carpool/backend/internal/middleware"
)

type Handler struct {
	Service *Service
}

// PostRideHandler allows an authenticated user to post a new ride.
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

	// Retrieve user ID from JWT middleware context.
	ride.UserID = middleware.GetUserIDFromContext(r.Context())

	// Create the ride via service layer.
	if err := h.Service.CreateRide(&ride); err != nil {
		http.Error(w, "Error posting ride", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(ride)
}

// SearchRidesHandler checks for "all=true" to return all rides, otherwise applies filters:
// 1) Geospatial proximity (within 5 km)
// 2) Time compatibility (±5 hours of rideTime)
// 3) Seat availability (available_seats >= numPeople)
func (h *Handler) SearchRidesHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Only GET allowed", http.StatusMethodNotAllowed)
		return
	}

	// Check if "all" flag is set
	allParam := r.URL.Query().Get("all")
	if allParam == "true" {
		rides, err := h.Service.GetAllRides()
		if err != nil {
			http.Error(w, "Error fetching all rides", http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(rides)
		return
	}

	// Read coordinate parameters from query.
	fromLonStr := r.URL.Query().Get("fromLon")
	fromLatStr := r.URL.Query().Get("fromLat")
	toLonStr := r.URL.Query().Get("toLon")
	toLatStr := r.URL.Query().Get("toLat")

	// Read separate date and time parameters.
	rideDateStr := r.URL.Query().Get("rideDate") // Expected format: "2006-01-02"
	rideTimeStr := r.URL.Query().Get("rideTime") // Expected format: "15:04" (24-hour format)
	numPeopleStr := r.URL.Query().Get("numPeople")

	if fromLonStr == "" || fromLatStr == "" || toLonStr == "" || toLatStr == "" ||
		rideDateStr == "" || rideTimeStr == "" {
		http.Error(w, "Invalid or missing coordinate or time parameters", http.StatusBadRequest)
		return
	}

	// Parse coordinate parameters.
	fromLon, err1 := strconv.ParseFloat(fromLonStr, 64)
	fromLat, err2 := strconv.ParseFloat(fromLatStr, 64)
	toLon, err3 := strconv.ParseFloat(toLonStr, 64)
	toLat, err4 := strconv.ParseFloat(toLatStr, 64)
	if err1 != nil || err2 != nil || err3 != nil || err4 != nil {
		http.Error(w, "Invalid coordinate parameters", http.StatusBadRequest)
		return
	}

	// Combine rideDate and rideTime into a full RFC3339 timestamp.
	// For example, rideDate "2025-03-02" and rideTime "10:00" become "2025-03-02T10:00:00Z"
	fullRideTimeStr := rideDateStr + "T" + rideTimeStr + ":00Z"
	rideTime, err := time.Parse(time.RFC3339, fullRideTimeStr)
	if err != nil {
		http.Error(w, "Invalid ride time format (expected RFC3339, e.g., 2025-03-02T10:00:00Z)", http.StatusBadRequest)
		return
	}

	// Parse numPeople parameter (default to 1 if not provided)
	numPeople := 1
	if numPeopleStr != "" {
		if val, err := strconv.Atoi(numPeopleStr); err == nil {
			numPeople = val
		}
	}

	// Call the service method (which computes the ±5-hour window internally).
	rides, err := h.Service.SearchRidesFiltered(fromLon, fromLat, toLon, toLat, rideTime, numPeople)
	if err != nil {
		http.Error(w, "Error searching rides", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(rides)
}
