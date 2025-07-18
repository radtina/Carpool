-- Create Users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    rating DECIMAL(3,2),
    profile_pic VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Rides table
CREATE TABLE rides (
    ride_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    ride_time TIMESTAMP NOT NULL,
    available_seats INTEGER NOT NULL,
    car_type VARCHAR(100),
    ride_status VARCHAR(50),
    additional_notes TEXT,
    eta VARCHAR(50),
    from_lat NUMERIC(10,7) NOT NULL,
    from_lon NUMERIC(10,7) NOT NULL,
    to_lat NUMERIC(10,7) NOT NULL,
    to_lon NUMERIC(10,7) NOT NULL,
    from_address VARCHAR(255),
    to_address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(user_id)
);

-- Create Bookings table
CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    ride_id INTEGER NOT NULL,
    seat_count INTEGER NOT NULL,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_user FOREIGN KEY(user_id) REFERENCES users(user_id),
    CONSTRAINT fk_booking_ride FOREIGN KEY(ride_id) REFERENCES rides(ride_id)
);

