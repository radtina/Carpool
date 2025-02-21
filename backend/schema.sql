-- Enable the PostGIS extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    phone VARCHAR(20),
    rating NUMERIC(3,2),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Create Rides table
CREATE TABLE IF NOT EXISTS rides (
    ride_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    price NUMERIC(8,2) NOT NULL,
    ride_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    available_seats INTEGER,
    car_type VARCHAR(50),
    ride_status VARCHAR(20),
    additional_notes TEXT,
    from_lon DOUBLE PRECISION,  -- origin longitude
    from_lat DOUBLE PRECISION,  -- origin latitude
    to_lon DOUBLE PRECISION,    -- destination longitude
    to_lat DOUBLE PRECISION,    -- destination latitude
    origin geometry(Point,4326),
    destination geometry(Point,4326),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Create Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    booking_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    ride_id INTEGER REFERENCES rides(ride_id),
    seat_count INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);
