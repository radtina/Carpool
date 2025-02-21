package user

import "time"

type User struct {
	ID        int        `json:"id,omitempty"`
	Name      string     `json:"name"`
	Email     string     `json:"email"`
	Password  string     `json:"password,omitempty"`
	Phone     *string    `json:"phone,omitempty"`   // changed to *string
	Rating    float64    `json:"rating,omitempty"`  // If rating is optional, you could use *float64 too.
	CreatedAt time.Time  `json:"created_at,omitempty"`
}