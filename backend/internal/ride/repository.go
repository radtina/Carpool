package ride

import (
	"database/sql"
	//"log"
	"time"
)

type Repository struct {
	DB *sql.DB
}

// CreateRide inserts a new ride into the database. It returns the ride_id and created_at timestamp.
func (r *Repository) CreateRide(ride *Ride) error {
	query := `
        INSERT INTO rides (
            user_id,
            from_lon, 
            from_lat,
            to_lon, 
            to_lat,
            from_address, 
            to_address,
            price, 
            ride_time,
            available_seats, 
            car_type,
            created_at
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW()
        )
        RETURNING ride_id, created_at
    `
	return r.DB.QueryRow(
		query,
		ride.UserID,
		ride.FromLon, 
        ride.FromLat,
		ride.ToLon, 
        ride.ToLat,
		ride.FromAddress, 
        ride.ToAddress,
		ride.Price, 
        ride.RideTime,
		ride.AvailableSeats, 
        ride.CarType,
	).Scan(&ride.RideID, &ride.CreatedAt)
}

// GetAllRides retrieves all rides ordered by ride_time.
func (r *Repository) GetAllRides() ([]*Ride, error) {
    query := `
        SELECT 
            r.ride_id, 
            r.user_id,
            r.from_lon, 
            r.from_lat,
            r.to_lon, 
            r.to_lat,
            r.from_address, 
            r.to_address,
            r.price, 
            r.ride_time,
            r.available_seats, 
            r.car_type,
            r.ride_status, 
            r.additional_notes, 
            r.eta,
            r.created_at,
            u.name as driver_name
        FROM rides r
        LEFT JOIN users u ON r.user_id = u.user_id
        ORDER BY r.ride_time ASC
    `
    rows, err := r.DB.Query(query)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var rides []*Ride
    for rows.Next() {
        var ride Ride
        err := rows.Scan(
            &ride.RideID,
            &ride.UserID,
            &ride.FromLon, 
            &ride.FromLat,
            &ride.ToLon, 
            &ride.ToLat,
            &ride.FromAddress, 
            &ride.ToAddress,
            &ride.Price, 
            &ride.RideTime,
            &ride.AvailableSeats, 
            &ride.CarType,
            &ride.RideStatus, 
            &ride.AdditionalNotes, 
            &ride.ETA,
            &ride.CreatedAt,
            &ride.DriverName,
        )
        if err != nil {
            return nil, err
        }
        rides = append(rides, &ride)
    }
    return rides, nil
}


// SearchRidesFiltered applies geospatial filtering (via PostGIS), time window filtering, and seat availability filtering. It returns rides matching the criteria.
func (r *Repository) SearchRidesFiltered(
	fromLon, fromLat, toLon, toLat float64,
	timeLowerBound, timeUpperBound time.Time,
	numPeople int,
	maxDistance float64,
) ([]*Ride, error) {
	query := `
        SELECT 
            ride_id, 
            user_id,
            from_lon, 
            from_lat,
            to_lon, 
            to_lat,
            from_address, 
            to_address,
            price, 
            ride_time,
            available_seats, 
            car_type,
            created_at
        FROM rides
        WHERE
            ST_DWithin(
                ST_SetSRID(ST_MakePoint(from_lon, from_lat), 4326),
                ST_SetSRID(ST_MakePoint($1, $2), 4326),
                $3
            )
            AND ST_DWithin(
                ST_SetSRID(ST_MakePoint(to_lon, to_lat), 4326),
                ST_SetSRID(ST_MakePoint($4, $5), 4326),
                $3
            )
            AND ride_time BETWEEN $6 AND $7
            AND available_seats >= $8
        ORDER BY ride_time ASC
    `
	rows, err := r.DB.Query(query,
		fromLon, 
        fromLat,
		maxDistance,
		toLon, 
        toLat,
		timeLowerBound,
		timeUpperBound,
		numPeople,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var rides []*Ride
	for rows.Next() {
		var ride Ride
		err := rows.Scan(
			&ride.RideID,
			&ride.UserID,
			&ride.FromLon, 
            &ride.FromLat,
			&ride.ToLon, 
            &ride.ToLat,
			&ride.FromAddress, 
            &ride.ToAddress,
			&ride.Price, 
            &ride.RideTime,
			&ride.AvailableSeats, 
            &ride.CarType,
			&ride.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		rides = append(rides, &ride)
	}
	return rides, nil
}
