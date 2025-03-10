package ride

import (
	"encoding/json"
	"log"
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
	// Decode the JSON payload into the Ride struct.
	if err := json.NewDecoder(r.Body).Decode(&ride); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}
	log.Println("Decoded Ride Payload:", ride)

	// Retrieve the user ID from JWT middleware context.
	ride.UserID = middleware.GetUserIDFromContext(r.Context())
	log.Println("User ID from JWT context:", ride.UserID)

	// Create the ride via the Service layer.
	if err := h.Service.CreateRide(&ride); err != nil {
		log.Println("Error creating ride in service:", err)
		http.Error(w, "Error posting ride", http.StatusInternalServerError)
		return
	}

	log.Println("Ride created successfully:", ride)
	// Write header and JSON response only once.
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(ride)
}

// SearchRidesHandler checks for "all=true" to return all rides,
// otherwise applies filters: geospatial proximity, time window, and seat availability.
func (h *Handler) SearchRidesHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Only GET allowed", http.StatusMethodNotAllowed)
		return
	}

	// Check if "all" flag is set.
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
	rideTimeStr := r.URL.Query().Get("rideTime") // Expected format: "15:04"
	numPeopleStr := r.URL.Query().Get("numPeople")
	maxDistanceStr := r.URL.Query().Get("maxDistance")

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
	fullRideTimeStr := rideDateStr + "T" + rideTimeStr + ":00Z"
	rideTime, err := time.Parse(time.RFC3339, fullRideTimeStr)
	if err != nil {
		http.Error(w, "Invalid ride time format (expected RFC3339, e.g., 2025-03-02T10:00:00Z)", http.StatusBadRequest)
		return
	}

	// Parse numPeople parameter (default to 1 if not provided).
	numPeople := 1
	if numPeopleStr != "" {
		if val, err := strconv.Atoi(numPeopleStr); err == nil {
			numPeople = val
		}
	}

	// Parse maxDistance parameter (default to 5 if not provided).
	maxDistance := 5
	if maxDistanceStr != "" {
		if val, err := strconv.Atoi(maxDistanceStr); err == nil {
			maxDistance = val
		}
	}

	// Call the Service method to search for rides.
	rides, err := h.Service.SearchRidesFiltered(fromLon, fromLat, toLon, toLat, rideTime, numPeople, maxDistance)
	if err != nil {
		http.Error(w, "Error searching rides", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(rides)
}
