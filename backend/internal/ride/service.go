package ride

import (
    "time"
)

// Service struct holds a reference to the Repository
type Service struct {
    Repo *Repository
}

// CreateRide delegates ride creation to the repository
func (s *Service) CreateRide(ride *Ride) error {
    return s.Repo.CreateRide(ride)
}

// GetAllRides fetches all rides without filters
func (s *Service) GetAllRides() ([]*Ride, error) {
    return s.Repo.GetAllRides()
}

// SearchRidesFiltered applies geospatial proximity, time compatibility, and seat availability
func (s *Service) SearchRidesFiltered(fromLon, fromLat, toLon, toLat float64, rideTime time.Time, numPeople int) ([]*Ride, error) {
    // ±5 hours
    timeLowerBound := rideTime.Add(-5 * time.Hour)
    timeUpperBound := rideTime.Add(5 * time.Hour)
    maxDistance := 5000.0 // 5 km in meters

    return s.Repo.SearchRidesFiltered(fromLon, fromLat, toLon, toLat, timeLowerBound, timeUpperBound, numPeople, maxDistance)
}
