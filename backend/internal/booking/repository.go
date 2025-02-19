package booking

import (
	"database/sql"
	//"time"
)

type Repository struct {
	DB *sql.DB
}

func (r *Repository) CreateBooking(b *Booking) error {
	query := `
         INSERT INTO bookings (user_id, ride_id, seat_count, status, created_at)
         VALUES ($1, $2, $3, 'pending', NOW())
         RETURNING booking_id, created_at
    `
	return r.DB.QueryRow(query, b.UserID, b.RideID, b.SeatCount).Scan(&b.BookingID, &b.CreatedAt)
}

func (r *Repository) GetBookingsByUser(userID int) ([]*Booking, error) {
	query := `
         SELECT booking_id, user_id, ride_id, seat_count, status, created_at
         FROM bookings
         WHERE user_id = $1
         ORDER BY created_at DESC
    `
	rows, err := r.DB.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var bookings []*Booking
	for rows.Next() {
		var b Booking
		if err := rows.Scan(&b.BookingID, &b.UserID, &b.RideID, &b.SeatCount, &b.Status, &b.CreatedAt); err != nil {
			return nil, err
		}
		bookings = append(bookings, &b)
	}
	return bookings, nil
}
