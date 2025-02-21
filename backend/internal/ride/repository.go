package ride

import (
	"database/sql"
	"strconv"
	//"time"
)

type Repository struct {
	DB *sql.DB
}

func (r *Repository) CreateRide(ride *Ride) error {
	query := `
        INSERT INTO rides (
            user_id, from_location, to_location, price, ride_time,
            available_seats, car_type, ride_status, additional_notes, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
        RETURNING ride_id, created_at
    `
	return r.DB.QueryRow(query, ride.UserID, ride.FromLocation, ride.ToLocation, ride.Price, ride.RideTime,
		ride.AvailableSeats, ride.CarType, ride.RideStatus, ride.AdditionalNotes).Scan(&ride.RideID, &ride.CreatedAt)
}

func (r *Repository) SearchRides(from, to string) ([]*Ride, error) {
	query := `
        SELECT ride_id, user_id, from_location, to_location, price, ride_time,
               available_seats, car_type, ride_status, additional_notes, created_at
        FROM rides
        WHERE 1=1
    `
	args := []interface{}{}
	argIndex := 1
	if from != "" {
		query += " AND from_location ILIKE $" + strconv.Itoa(argIndex)
		args = append(args, "%"+from+"%")
		argIndex++
	}
	if to != "" {
		query += " AND to_location ILIKE $" + strconv.Itoa(argIndex)
		args = append(args, "%"+to+"%")
		argIndex++
	}
	query += " ORDER BY ride_time ASC"
	rows, err := r.DB.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var rides []*Ride
	for rows.Next() {
		var ride Ride
		if err := rows.Scan(&ride.RideID, &ride.UserID, &ride.FromLocation, &ride.ToLocation, &ride.Price,
			&ride.RideTime, &ride.AvailableSeats, &ride.CarType, &ride.RideStatus, &ride.AdditionalNotes, &ride.CreatedAt); err != nil {
			return nil, err
		}
		rides = append(rides, &ride)
	}
	return rides, nil
}