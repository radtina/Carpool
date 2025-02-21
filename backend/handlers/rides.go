package handlers

import (
	"carpool/backend/models"
	//"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	//"time"
)

// PostRideHandler allows an authenticated user to post a new ride.
func PostRideHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST allowed", http.StatusMethodNotAllowed)
		return
	}

	// Retrieve user claims from context (set by the JWT middleware).
	claims, ok := r.Context().Value("user").(*models.Claims)
	if !ok {
		http.Error(w, "Unable to retrieve user info", http.StatusInternalServerError)
		return
	}

	var ride models.Ride
	if err := json.NewDecoder(r.Body).Decode(&ride); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	ride.UserID = claims.UserID

	query := `
        INSERT INTO rides (
            user_id, from_location, to_location, price, ride_time,
            available_seats, car_type, ride_status, additional_notes, created_at
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()
        )
        RETURNING ride_id, created_at
    `
	err := DB.QueryRow(query,
		ride.UserID,
		ride.FromLocation,
		ride.ToLocation,
		ride.Price,
		ride.RideTime,
		ride.AvailableSeats,
		ride.CarType,
		ride.RideStatus,
		ride.AdditionalNotes,
	).Scan(&ride.RideID, &ride.CreatedAt)
	if err != nil {
		log.Println("Error posting ride:", err)
		http.Error(w, "Error posting ride", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(ride)
}

// SearchRidesHandler allows users to search for rides.
func SearchRidesHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Only GET allowed", http.StatusMethodNotAllowed)
		return
	}

	fromLocation := r.URL.Query().Get("from")
	toLocation := r.URL.Query().Get("to")

	query := `
        SELECT ride_id, user_id, from_location, to_location, price, ride_time,
               available_seats, car_type, ride_status, additional_notes, created_at
        FROM rides
        WHERE 1=1
    `
	args := []interface{}{}
	argIndex := 1

	if fromLocation != "" {
		query += fmt.Sprintf(" AND from_location ILIKE $%d", argIndex)
		args = append(args, "%"+fromLocation+"%")
		argIndex++
	}
	if toLocation != "" {
		query += fmt.Sprintf(" AND to_location ILIKE $%d", argIndex)
		args = append(args, "%"+toLocation+"%")
		argIndex++
	}
	query += " ORDER BY ride_time ASC"

	rows, err := DB.Query(query, args...)
	if err != nil {
		http.Error(w, "Error searching rides", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var rides []models.Ride
	for rows.Next() {
		var ride models.Ride
		if err := rows.Scan(&ride.RideID, &ride.UserID, &ride.FromLocation, &ride.ToLocation,
			&ride.Price, &ride.RideTime, &ride.AvailableSeats, &ride.CarType, &ride.RideStatus,
			&ride.AdditionalNotes, &ride.CreatedAt); err != nil {
			http.Error(w, "Error scanning ride", http.StatusInternalServerError)
			return
		}
		rides = append(rides, ride)
	}
	json.NewEncoder(w).Encode(rides)
}