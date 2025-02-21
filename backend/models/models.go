package models

import (
	"time"

	"github.com/golang-jwt/jwt/v4"
)

type User struct {
	ID        int       `json:"id,omitempty"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Password  string    `json:"password,omitempty"`
	CreatedAt time.Time `json:"created_at,omitempty"`
}

type Ride struct {
    RideID              int       `json:"ride_id,omitempty"`
    UserID              int       `json:"user_id"`
    FromLocation        string    `json:"from_location"`
    ToLocation          string    `json:"to_location"`
    Price               float64   `json:"price"`
    RideTime            time.Time `json:"ride_time"`
    AvailableSeats      int       `json:"available_seats,omitempty"`
    CarType             string    `json:"car_type,omitempty"`
    RideStatus          string    `json:"ride_status,omitempty"`
    AdditionalNotes     string    `json:"additional_notes,omitempty"`
    CreatedAt           time.Time `json:"created_at,omitempty"`
    
    // New fields for geospatial search results.
    OriginDistance      float64   `json:"origin_distance,omitempty"`
    DestinationDistance float64   `json:"destination_distance,omitempty"`
}

type Claims struct {
	UserID int    `json:"user_id"`
	Email  string `json:"email"`
	jwt.RegisteredClaims
}
