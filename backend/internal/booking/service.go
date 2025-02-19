package booking

type Service struct {
	Repo *Repository
}

func (s *Service) CreateBooking(b *Booking) error {
	// (Additional business logic like checking seat availability can be added here)
	return s.Repo.CreateBooking(b)
}

func (s *Service) GetUserBookings(userID int) ([]*Booking, error) {
	return s.Repo.GetBookingsByUser(userID)
}
