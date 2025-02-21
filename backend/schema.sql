-- schema.sql

-- Create users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(100),
    phone VARCHAR(20),
    rating NUMERIC(3,2) DEFAULT 5.00,
    profile_pic VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create rides table
CREATE TABLE rides (
    ride_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    from_location VARCHAR(100),
    to_location VARCHAR(100),
    price NUMERIC(8,2),
    ride_time TIMESTAMP,
    available_seats INT,
    car_type VARCHAR(50),
    ride_status VARCHAR(20),
    additional_notes TEXT,
    from_lat DOUBLE PRECISION,
    from_lng DOUBLE PRECISION,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    ride_id INT REFERENCES rides(ride_id),
    seat_count INT DEFAULT 1,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);
