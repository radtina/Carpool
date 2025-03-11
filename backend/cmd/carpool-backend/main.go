package main

import (
	"carpool/backend/config"
	"carpool/backend/internal/booking"
	"carpool/backend/internal/middleware"
	"carpool/backend/internal/ride"
	"carpool/backend/internal/user"
	"log"
	"net/http"

	"github.com/rs/cors"
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
	// Assuming userHandler is already initialized
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello from the backend!"))
	})	
	http.HandleFunc("/register", userHandler.RegisterHandler)
	http.HandleFunc("/login", userHandler.LoginHandler)
	http.HandleFunc("/profile", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			middleware.JWTMiddleware(userHandler.GetProfileHandler, []byte(cfg.JWTSecret))(w, r)
		} else if r.Method == http.MethodPatch {
			middleware.JWTMiddleware(userHandler.UpdateProfileHandler, []byte(cfg.JWTSecret))(w, r)
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})
	//http.HandleFunc("/profile/picture", middleware.JWTMiddleware(userHandler.UploadProfilePicture, []byte(cfg.JWTSecret)))

	http.HandleFunc("/profile/password", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPatch {
			middleware.JWTMiddleware(userHandler.ChangePasswordHandler, []byte(cfg.JWTSecret))(w, r)
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	// Routes for Ride domain.
	http.HandleFunc("/rides", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			// POST requires JWT authentication.
			middleware.JWTMiddleware(rideHandler.PostRideHandler, []byte(cfg.JWTSecret))(w, r)
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})
	http.HandleFunc("/rides/search", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			// GET is public for search.
			rideHandler.SearchRidesHandler(w, r)
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	// Serve static files from the "uploads" directory at the "/uploads" path
	//http.Handle("/uploads/",
	//	http.StripPrefix("/uploads/",
	//		http.FileServer(http.Dir("./uploads"))))

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

	// Set up CORS options.
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	})

	// Wrap the default mux with the CORS handler.
	handler := c.Handler(http.DefaultServeMux)

	// TLS or HTTP fallback.
	if cfg.TLSCertFile != "" && cfg.TLSKeyFile != "" {
		log.Println("Server started on :8443 with HTTPS")
		log.Fatal(http.ListenAndServeTLS(":8443", cfg.TLSCertFile, cfg.TLSKeyFile, handler))
	} else {
		log.Println("TLS_CERT_FILE or TLS_KEY_FILE not set, falling back to HTTP on :8080")
		log.Fatal(http.ListenAndServe(":8080", handler))
	}
}
