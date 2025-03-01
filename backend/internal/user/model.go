package user

import (
	"time"
)

type User struct {
	ID        int       `json:"id,omitempty"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Password  string    `json:"password,omitempty"`
	Phone     *string   `json:"phone,omitempty"`
	Rating    *float64  `json:"rating,omitempty"`
	CreatedAt time.Time `json:"created_at,omitempty"`
}
