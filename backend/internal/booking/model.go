package booking

import "time"

type Booking struct {
	BookingID int       `json:"booking_id,omitempty"`
	UserID    int       `json:"user_id"`
	RideID    int       `json:"ride_id"`
	SeatCount int       `json:"seat_count"`
	Status    string    `json:"status,omitempty"`
	CreatedAt time.Time `json:"created_at,omitempty"`
}