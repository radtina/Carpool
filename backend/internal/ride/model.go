package ride

import "time"

type Ride struct {
	RideID          int       `json:"ride_id,omitempty"`
	UserID          int       `json:"user_id"`
	FromLocation    string    `json:"from_location"`
	ToLocation      string    `json:"to_location"`
	Price           float64   `json:"price"`
	RideTime        time.Time `json:"ride_time"`
	AvailableSeats  int       `json:"available_seats,omitempty"`
	CarType         string    `json:"car_type,omitempty"`
	RideStatus      string    `json:"ride_status,omitempty"`
	AdditionalNotes string    `json:"additional_notes,omitempty"`
	CreatedAt       time.Time `json:"created_at,omitempty"`
}
