package main

import (
	"carpool/backend/config"
	"carpool/backend/internal/booking"
	"carpool/backend/internal/middleware"
	"carpool/backend/internal/ride"
	"carpool/backend/internal/user"
	"log"
	"net/http"
)

func main() {
	cfg := config.LoadConfig()
	db := config.ConnectDB(cfg)

	// Initialize User domain.
	userRepo := &user.Repository{DB: db}
	userService := &user.Service{Repo: userRepo}
	userHandler := &user.Handler{Service: userService, JWTKey: []byte(cfg.JWTSecret)}

	// Initialize Ride domain.
	rideRepo := &ride.Repository{DB: db}
	rideService := &ride.Service{Repo: rideRepo}
	rideHandler := &ride.Handler{Service: rideService}

	// Initialize Booking domain.
	bookingRepo := &booking.Repository{DB: db}
	bookingService := &booking.Service{Repo: bookingRepo}
	bookingHandler := &booking.Handler{Service: bookingService}

	// Set JWT key for middleware.
	middleware.SetJWTKey([]byte(cfg.JWTSecret))

	// Routes for User domain.
	http.HandleFunc("/register", userHandler.RegisterHandler)
	http.HandleFunc("/login", userHandler.LoginHandler)
	http.HandleFunc("/profile", middleware.JWTMiddleware(userHandler.UpdateProfileHandler, []byte(cfg.JWTSecret)))

	// Routes for Ride domain.
	http.HandleFunc("/rides", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			// POST requires JWT authentication.
			middleware.JWTMiddleware(rideHandler.PostRideHandler, []byte(cfg.JWTSecret))(w, r)
		} else if r.Method == http.MethodGet {
			// GET is public.
			rideHandler.SearchRidesHandler(w, r)
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	// Routes for Booking domain.
	http.HandleFunc("/bookings", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			middleware.JWTMiddleware(bookingHandler.CreateBookingHandler, []byte(cfg.JWTSecret))(w, r)
		} else if r.Method == http.MethodGet {
			middleware.JWTMiddleware(bookingHandler.GetUserBookingsHandler, []byte(cfg.JWTSecret))(w, r)
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	// TLS or HTTP fallback.
	if cfg.TLSCertFile != "" && cfg.TLSKeyFile != "" {
		log.Println("Server started on :8443 with HTTPS")
		log.Fatal(http.ListenAndServeTLS(":8443", cfg.TLSCertFile, cfg.TLSKeyFile, nil))
	} else {
		log.Println("TLS_CERT_FILE or TLS_KEY_FILE not set, falling back to HTTP on :8080")
		log.Fatal(http.ListenAndServe(":8080", nil))
	}
}
