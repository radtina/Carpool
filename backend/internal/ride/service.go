package ride

type Service struct {
	Repo *Repository
}

// CreateRide delegates ride creation to the repository.
func (s *Service) CreateRide(ride *Ride) error {
	return s.Repo.CreateRide(ride)
}

// SearchRidesGeo accepts coordinate values and returns matching rides based on geospatial criteria.
func (s *Service) SearchRidesGeo(fromLon, fromLat, toLon, toLat float64) ([]*Ride, error) {
	// Define distance thresholds in meters. Adjust these values as needed.
	const maxOriginDistance = 5000.0
	const maxDestDistance = 5000.0
	return s.Repo.SearchRidesGeo(fromLon, fromLat, toLon, toLat, maxOriginDistance, maxDestDistance)
}
