package ride

import "time"

type Ride struct {
    RideID              int       `json:"ride_id,omitempty"`
    UserID              int       `json:"user_id"`
    FromLon             float64   `json:"from_lon"`
    FromLat             float64   `json:"from_lat"`
    ToLon               float64   `json:"to_lon"`
    ToLat               float64   `json:"to_lat"`
    FromAddress         string    `json:"from_address,omitempty"`
    ToAddress           string    `json:"to_address,omitempty"`
    Price               float64   `json:"price"`
    RideTime            time.Time `json:"ride_time"`
    ETA                 string    `json:"eta,omitempty"` 
    AvailableSeats      int       `json:"available_seats,omitempty"`
    CarType             string    `json:"car_type,omitempty"`
    RideStatus          string    `json:"ride_status,omitempty"`
    AdditionalNotes     string    `json:"additional_notes,omitempty"`
    CreatedAt           time.Time `json:"created_at,omitempty"`
    DriverName          string    `json:"driver_name,omitempty"`

    // Calculated distances returned from geospatial queries.
    OriginDistance      float64   `json:"origin_distance,omitempty"`
    DestinationDistance float64   `json:"destination_distance,omitempty"`
}
