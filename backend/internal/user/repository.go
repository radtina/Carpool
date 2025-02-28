package user

import (
	"database/sql"
	"time"
)

type Repository struct {
	DB *sql.DB
}

func (repo *Repository) CreateUser(user *User, hashedPassword string) error {
	query := `INSERT INTO users (name, email, password, created_at) VALUES ($1, $2, $3, $4) RETURNING user_id, created_at`
	return repo.DB.QueryRow(query, user.Name, user.Email, hashedPassword, time.Now()).Scan(&user.ID, &user.CreatedAt)
}

func (repo *Repository) GetUserByEmail(email string) (*User, error) {
	user := &User{}
	query := `SELECT user_id, name, email, password, phone, rating, created_at FROM users WHERE email = $1`
	err := repo.DB.QueryRow(query, email).Scan(&user.ID, &user.Name, &user.Email, &user.Password, &user.Phone, &user.Rating, &user.CreatedAt)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (repo *Repository) GetUserByID(userID int) (*User, error) {
	user := &User{}
	query := `SELECT user_id, name, email, password, phone, rating, created_at FROM users WHERE user_id = $1`
	err := repo.DB.QueryRow(query, userID).Scan(&user.ID, &user.Name, &user.Email, &user.Password, &user.Phone, &user.Rating, &user.CreatedAt)
	if err != nil {
		return nil, err
	}
	return user, nil
}

// UpdateUser updates only the phone field.
func (repo *Repository) UpdateUser(user *User) error {
	query := `
        UPDATE users
        SET phone = COALESCE($1, phone)
        WHERE user_id = $2
        RETURNING user_id, name, email, phone, rating, created_at
    `
	return repo.DB.QueryRow(query, nullIfEmpty(user.Phone), user.ID).
		Scan(&user.ID, &user.Name, &user.Email, &user.Phone, &user.Rating, &user.CreatedAt)
}

func (repo *Repository) UpdateUserPassword(userID int, hashedPwd string) error {
	query := `UPDATE users SET password = $1 WHERE user_id = $2`
	_, err := repo.DB.Exec(query, hashedPwd, userID)
	return err
}

func nullIfEmpty(s *string) *string {
	if s == nil || *s == "" {
		return nil
	}
	return s
}
