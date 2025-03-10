package ride

import (
    "time"
    "log"
)

// Service struct holds a reference to the Repository
type Service struct {
    Repo *Repository
}

func (s *Service) CreateRide(ride *Ride) error {
    // Calculate travel duration (in minutes) from the API.
    durationMinutes, err := GetDuration(ride.FromLon, ride.FromLat, ride.ToLon, ride.ToLat)
    if err != nil {
        // Optionally log or handle the error; here we set ETA to "N/A"
        log.Println("Error calculating duration:", err)
        durationMinutes = 0 // or choose a default value
    }

    // Compute the estimated time of arrival: starting time plus duration.
    etaTime := ride.RideTime.Add(time.Duration(durationMinutes) * time.Minute)
    // Format ETA as desired, for example "15:04" (24-hour format).
    etaStr := etaTime.Format("15:04")
    ride.ETA = &etaStr

    // Now insert the ride into the database.
    return s.Repo.CreateRide(ride)
}

// GetAllRides fetches all rides without filters
func (s *Service) GetAllRides() ([]*Ride, error) {
    return s.Repo.GetAllRides()
}

// SearchRidesFiltered applies geospatial proximity, time compatibility, and seat availability
func (s *Service) SearchRidesFiltered(fromLon, fromLat, toLon, toLat float64, rideTime time.Time, numPeople int, maxDistance int) ([]*Ride, error) {
    timeLowerBound := rideTime.Add(-5 * time.Hour)
    timeUpperBound := rideTime.Add(5 * time.Hour)
    maximumDistance := 1000*maxDistance
    return s.Repo.SearchRidesFiltered(fromLon, fromLat, toLon, toLat, timeLowerBound, timeUpperBound, numPeople, maximumDistance)
}
