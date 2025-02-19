package ride

type Service struct {
	Repo *Repository
}

func (s *Service) CreateRide(ride *Ride) error {
	return s.Repo.CreateRide(ride)
}

func (s *Service) SearchRides(from, to string) ([]*Ride, error) {
	return s.Repo.SearchRides(from, to)
}
