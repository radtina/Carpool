package ride

import (
	"database/sql"
)

type Repository struct {
	DB *sql.DB
}

// CreateRide inserts a new ride using coordinate fields and generates the spatial geometries.
func (r *Repository) CreateRide(ride *Ride) error {
	query := `
        INSERT INTO rides (
            user_id, from_lon, from_lat, to_lon, to_lat, price, ride_time,
            available_seats, car_type, ride_status, additional_notes, origin, destination, created_at
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
            ST_SetSRID(ST_MakePoint($2, $3), 4326),
            ST_SetSRID(ST_MakePoint($4, $5), 4326),
            NOW()
        )
        RETURNING ride_id, created_at
    `
	return r.DB.QueryRow(query, ride.UserID, ride.FromLon, ride.FromLat, ride.ToLon, ride.ToLat, ride.Price, ride.RideTime,
		ride.AvailableSeats, ride.CarType, ride.RideStatus, ride.AdditionalNotes).Scan(&ride.RideID, &ride.CreatedAt)
}

// SearchRidesGeo performs a geospatial search using the coordinate values.
// It returns rides where the stored origin and destination geometries are within the specified distances.
func (r *Repository) SearchRidesGeo(fromLon, fromLat, toLon, toLat, maxOriginDistance, maxDestDistance float64) ([]*Ride, error) {
	query := `
    SELECT ride_id, user_id, from_lon, from_lat, to_lon, to_lat, price, ride_time,
           available_seats, car_type, ride_status, additional_notes, created_at,
           ST_Distance(origin, ST_SetSRID(ST_MakePoint($1, $2), 4326)) AS origin_distance,
           ST_Distance(destination, ST_SetSRID(ST_MakePoint($3, $4), 4326)) AS destination_distance
    FROM rides
    WHERE ST_DWithin(origin, ST_SetSRID(ST_MakePoint($1, $2), 4326), $5)
      AND ST_DWithin(destination, ST_SetSRID(ST_MakePoint($3, $4), 4326), $6)
    ORDER BY (ST_Distance(origin, ST_SetSRID(ST_MakePoint($1, $2), 4326)) +
          ST_Distance(destination, ST_SetSRID(ST_MakePoint($3, $4), 4326))) ASC;

    `
	rows, err := r.DB.Query(query, fromLon, fromLat, toLon, toLat, maxOriginDistance, maxDestDistance)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var rides []*Ride
	for rows.Next() {
		var ride Ride
		if err := rows.Scan(&ride.RideID, &ride.UserID, &ride.FromLon, &ride.FromLat, &ride.ToLon, &ride.ToLat, &ride.Price,
			&ride.RideTime, &ride.AvailableSeats, &ride.CarType, &ride.RideStatus, &ride.AdditionalNotes, &ride.CreatedAt,
			&ride.OriginDistance, &ride.DestinationDistance); err != nil {
			return nil, err
		}
		rides = append(rides, &ride)
	}
	return rides, nil
}
