package user

import (
	"errors"
	"log"

	"golang.org/x/crypto/bcrypt"
)

type Service struct {
	Repo *Repository
}

func (s *Service) Register(user *User) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	return s.Repo.CreateUser(user, string(hashedPassword))
}

func (s *Service) Login(email, password string) (*User, error) {
	user, err := s.Repo.GetUserByEmail(email)
	if err != nil {
		return nil, err
	}
	// Log the retrieved hash for debugging
	log.Printf("Comparing stored hash %s with password %s", user.Password, password)
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, err
	}
	return user, nil
}

func (s *Service) GetUserByID(userID int) (*User, error) {
	return s.Repo.GetUserByID(userID)
}

// UpdateUserProfile updates only the phone number.
func (s *Service) UpdateUserProfile(userID int, phone string) (*User, error) {
	// Create a User object with only the phone to update.
	user := &User{
		ID:    userID,
		Phone: &phone,
	}
	if err := s.Repo.UpdateUser(user); err != nil {
		return nil, err
	}
	return s.Repo.GetUserByID(userID)
}

func (s *Service) ChangeUserPassword(userID int, currentPwd, newPwd string) error {
	user, err := s.Repo.GetUserByID(userID)
	if err != nil {
		return err
	}
	if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(currentPwd)) != nil {
		return errors.New("invalid current password")
	}
	hashedNew, err := bcrypt.GenerateFromPassword([]byte(newPwd), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	return s.Repo.UpdateUserPassword(userID, string(hashedNew))
}
