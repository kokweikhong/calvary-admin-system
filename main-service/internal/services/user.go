package services

import (
	"context"
	"database/sql"
	"log/slog"

	"github.com/kokweikhong/calvary-admin-system/main-service/internal/db"
	"github.com/kokweikhong/calvary-admin-system/main-service/internal/models"
)

type UserService interface {
	GetUsers() ([]*models.User, error)
	GetUser(id int) (*models.User, error)
	CreateUser(user *models.User) error
	UpdateUser(id int, user *models.User) error
	DeleteUser(id int) error
}

type userService struct {
	db *sql.DB
}

func NewUserService() UserService {
	return &userService{
		db: db.GetDB(),
	}
}

func (s *userService) GetUsers() ([]*models.User, error) {
	queryStr := `
		SELECT
			id,
			username,
			email,
			password,
			role,
			position,
			department,
			profile_image,
			is_exist,
			is_verified,
			verify_token,
			verify_token_expires,
			created_at,
			updated_at
		FROM
			users
	`

	rows, err := s.db.QueryContext(context.Background(), queryStr)
	if err != nil {
		slog.Error("Error querying users", "error", err)
		return nil, err
	}

	defer rows.Close()

	var users []*models.User

	for rows.Next() {
		user := new(models.User)
		err := rows.Scan(
			&user.ID,
			&user.Username,
			&user.Email,
			&user.Password,
			&user.Role,
			&user.Position,
			&user.Department,
			&user.ProfileImage,
			&user.IsExist,
			&user.IsVerified,
			&user.VerifyToken,
			&user.VerifyTokenExpire,
			&user.CreatedAt,
			&user.UpdatedAt,
		)

		if err != nil {
			slog.Error("Error scanning user", "error", err)
			return nil, err
		}
		users = append(users, user)
	}

	if err := rows.Err(); err != nil {
		slog.Error("Error iterating rows", "error", err)
		return nil, err
	}

	slog.Info("Successfully queried users", "users", len(users))

	return users, nil
}

func (s *userService) GetUser(id int) (*models.User, error) {
	queryStr := `
		SELECT
			id,
			username,
			email,
			password,
			role,
			position,
			department,
			profile_image,
			is_exist,
			is_verified,
			verify_token,
			verify_token_expires,
			created_at,
			updated_at
		FROM
			users
		WHERE
			id = $1
	`

	row := s.db.QueryRowContext(context.Background(), queryStr, id)

	user := new(models.User)
	err := row.Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.Password,
		&user.Role,
		&user.Position,
		&user.Department,
		&user.ProfileImage,
		&user.IsExist,
		&user.IsVerified,
		&user.VerifyToken,
		&user.VerifyTokenExpire,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		slog.Error("Error scanning user", "error", err)
		return nil, err
	}

	slog.Info("Successfully queried user", "user", user)

	return user, nil
}

func (s *userService) CreateUser(user *models.User) error {
	queryStr := `
		INSERT INTO users (
			username,
			email,
			password,
			role,
			position,
			department,
			profile_image,
			is_exist,
			is_verified,
			verify_token,
			verify_token_expires,
			created_at,
			updated_at
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9,
			$10, $11, $12, $13
		)
	`

	_, err := s.db.ExecContext(
		context.Background(),
		queryStr,
		user.Username,
		user.Email,
		user.Password,
		user.Role,
		user.Position,
		user.Department,
		user.ProfileImage,
		user.IsExist,
		user.IsVerified,
		user.VerifyToken,
		user.VerifyTokenExpire,
		user.CreatedAt,
		user.UpdatedAt,
	)
	if err != nil {
		slog.Error("Error creating user", "error", err)
		return err
	}

	slog.Info("Successfully created user", "user", user)

	return nil
}

func (s *userService) UpdateUser(id int, user *models.User) error {
	queryStr := `
		UPDATE users SET
			username = $1,
			email = $2,
			password = $3,
			role = $4,
			position = $5,
			department = $6,
			profile_image = $7,
			is_exist = $8,
			is_verified = $9,
			verify_token = $10,
			verify_token_expires = $11,
			created_at = $12,
			updated_at = $13
		WHERE
			id = $14
	`

	_, err := s.db.ExecContext(
		context.Background(),
		queryStr,
		user.Username,
		user.Email,
		user.Password,
		user.Role,
		user.Position,
		user.Department,
		user.ProfileImage,
		user.IsExist,
		user.IsVerified,
		user.VerifyToken,
		user.VerifyTokenExpire,
		user.CreatedAt,
		user.UpdatedAt,
		id,
	)
	if err != nil {
		slog.Error("Error updating user", "error", err)
		return err
	}

	slog.Info("Successfully updated user", "user", user)

	return nil
}

func (s *userService) DeleteUser(id int) error {
	queryStr := `
		DELETE FROM users
		WHERE id = $1
	`

	_, err := s.db.ExecContext(context.Background(), queryStr, id)
	if err != nil {
		slog.Error("Error deleting user", "error", err)
		return err
	}

	slog.Info("Successfully deleted user", "id", id)

	return nil
}
