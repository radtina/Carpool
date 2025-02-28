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
        // Return all rides without filtering
        rides, err := h.Service.GetAllRides()
        if err != nil {
            http.Error(w, "Error fetching all rides", http.StatusInternalServerError)
            return
        }
        json.NewEncoder(w).Encode(rides)
        return
    }

    // Otherwise, read filter parameters from query
    fromLonStr := r.URL.Query().Get("fromLon")
    fromLatStr := r.URL.Query().Get("fromLat")
    toLonStr := r.URL.Query().Get("toLon")
    toLatStr := r.URL.Query().Get("toLat")
    rideTimeStr := r.URL.Query().Get("rideTime")
    numPeopleStr := r.URL.Query().Get("numPeople")

    // Parse coordinates
    fromLon, err1 := strconv.ParseFloat(fromLonStr, 64)
    fromLat, err2 := strconv.ParseFloat(fromLatStr, 64)
    toLon, err3 := strconv.ParseFloat(toLonStr, 64)
    toLat, err4 := strconv.ParseFloat(toLatStr, 64)

    if err1 != nil || err2 != nil || err3 != nil || err4 != nil {
        http.Error(w, "Invalid or missing coordinate parameters", http.StatusBadRequest)
        return
    }

    // Parse rideTime (date string). We'll convert it to time.Time.
    // The service will handle ±5 hours logic.
    var rideTime time.Time
    if rideTimeStr != "" {
        parsedTime, err := time.Parse("2006-01-02", rideTimeStr)
        if err == nil {
            rideTime = parsedTime
        } else {
            // If parsing fails, you can decide whether to return an error or ignore the date.
            http.Error(w, "Invalid rideTime (use YYYY-MM-DD)", http.StatusBadRequest)
            return
        }
    } else {
        // If no date is provided, you might choose to return an error or treat it as "any time".
        http.Error(w, "Missing rideTime parameter", http.StatusBadRequest)
        return
    }

    // Parse numPeople for seat availability
    numPeople := 1
    if numPeopleStr != "" {
        if val, err := strconv.Atoi(numPeopleStr); err == nil {
            numPeople = val
        }
    }

    // Call the service method to apply your filtering logic
    rides, err := h.Service.SearchRidesFiltered(fromLon, fromLat, toLon, toLat, rideTime, numPeople)
    if err != nil {
        http.Error(w, "Error searching rides", http.StatusInternalServerError)
        return
    }

    json.NewEncoder(w).Encode(rides)
}
