package services

import (
	"crypto/rand"
	"errors"
	"fmt"
	"log/slog"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/kokweikhong/calvary-admin-system/main-service/internal/config"
	"github.com/kokweikhong/calvary-admin-system/main-service/internal/db"
	"github.com/kokweikhong/calvary-admin-system/main-service/internal/models"
	"golang.org/x/crypto/bcrypt"
)

type AuthService interface {
	SignIn(request *models.AuthSignInRequest) (*models.AuthUser, error)
	ResetPassword(email string) error
	UpdatePassword(email string, token string, password string) error

	RefreshToken(username, refreshToken string, duration time.Duration) (*models.JWTPayload, error)
	VerifyToken(tokenString string) (bool, error)
	GenerateToken(username string, duration time.Duration) (*models.JWTPayload, error)
}

type authService struct {
}

func NewAuthService() AuthService {
	return &authService{}
}

func (s *authService) SignIn(request *models.AuthSignInRequest) (*models.AuthUser, error) {
	db := db.GetDB()

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
            email = $1
    `

	stmt, err := db.Prepare(queryStr)
	if err != nil {
		return nil, err
	}

	row := stmt.QueryRow(request.Email)

	user := &models.User{}
	err = row.Scan(
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
		slog.Error("failed to scan user", "error", err)
		return nil, err
	}

	if !user.IsExist {
		return nil, errors.New("user does not exist")
	}

	comparePassword := s.comparePassord(user.Password, request.Password)
	if !comparePassword {
		return nil, errors.New("invalid password")
	}

	accessTokenPayload, err := s.GenerateToken(user.Username, time.Minute*30)
	// accessTokenPayload, err := s.GenerateToken(user.Username, time.Minute*1)
	if err != nil {
		return nil, err
	}

	refreshTokenPayload, err := s.GenerateToken(user.Username, time.Hour*24*7)
	// refreshTokenPayload, err := s.GenerateToken(user.Username, time.Minute*20)
	if err != nil {
		return nil, err
	}

	slog.Info("user logged in", "user", user)

	authUser := &models.AuthUser{
		User:         user,
		AccessToken:  accessTokenPayload,
		RefreshToken: refreshTokenPayload,
	}

	return authUser, nil
}

func (s *authService) ResetPassword(email string) error {
	db := db.GetDB()

	queryStr := `
		SELECT
			id,
			username,
			email
		FROM
			users
		WHERE
			email = $1
	`

	stmt, err := db.Prepare(queryStr)
	if err != nil {
		return err
	}

	row := stmt.QueryRow(email)

	var userID int
	var username string
	var userEmail string
	err = row.Scan(
		&userID,
		&username,
		&userEmail,
	)
	if err != nil {
		return err
	}

	queryStr = `
		INSERT INTO reset_passwords (
			user_id,
			token,
			expires_at,
			create_at
		) VALUES (
			$1,
			$2,
			$3,
			CURRENT_TIMESTAMP
		)
	`

	stmt, err = db.Prepare(queryStr)
	if err != nil {
		return err
	}

	// generate token
	token := s.generateRandomToken(32)

	// expires at 5 days
	expiresAt := time.Now().Add(time.Hour * 24 * 5)

	_, err = stmt.Exec(userID, token, expiresAt)

	if err != nil {
		return err
	}

	// send email

	return nil
}

func (s *authService) UpdatePassword(email string, token string, password string) error {
	db := db.GetDB()

	user, err := s.verifyResetPasswordToken(email, token)
	if err != nil {
		return err
	}

	queryStr := `
		UPDATE users SET
			password = $1,
			updated_at = CURRENT_TIMESTAMP
		WHERE
			id = $2
	`

	stmt, err := db.Prepare(queryStr)
	if err != nil {
		return err
	}

	_, err = stmt.Exec(password, user.UserID)
	if err != nil {
		return err
	}

	return nil
}

func (s *authService) RefreshToken(username, refreshToken string, duration time.Duration) (*models.JWTPayload, error) {
	isVerified, err := s.VerifyToken(refreshToken)
	if err != nil {
		return nil, err
	}

	if !isVerified {
		return nil, errors.New("invalid refresh token")
	}

	payload, err := s.GenerateToken(username, duration)
	if err != nil {
		return nil, err
	}

	return payload, nil
}

func (s *authService) VerifyToken(tokenString string) (bool, error) {
	token, err := jwt.ParseWithClaims(tokenString, &models.JWTCustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(config.Cfg.JWTSecret), nil
	})

	if err != nil {
		return false, err
	}

	_, ok := token.Claims.(*models.JWTCustomClaims)
	if !ok {
		return false, err
	}

	return true, nil
}

// GenerateToken generates a jwt token
func (s *authService) GenerateToken(username string, duration time.Duration) (*models.JWTPayload, error) {
	claims := models.JWTCustomClaims{
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: &jwt.NumericDate{Time: time.Now().Add(duration)},
			Issuer:    "calvary-admin-system",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString([]byte(config.Cfg.JWTSecret))
	if err != nil {
		return nil, err
	}

	payload := new(models.JWTPayload)
	payload.Username = username
	payload.Token = tokenString

	expiresAt, err := token.Claims.GetExpirationTime()
	if err != nil {
		return nil, err
	}
	payload.ExpiresAt = expiresAt.Unix()

	issuer, err := token.Claims.GetIssuer()
	if err != nil {
		return nil, err
	}
	payload.Issuer = issuer

	return payload, nil
}

func (s *authService) comparePassord(hashedPassword string, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	return err == nil
}

func (s *authService) generateRandomToken(size int) string {
	b := make([]byte, size)
	rand.Read(b)
	return fmt.Sprintf("%x", b)
}

func (s *authService) verifyResetPasswordToken(email, token string) (*models.ResetPasswordResponse, error) {
	res := &models.ResetPasswordResponse{}

	// get the reset password record by email and token from db and latest record
	queryStr := `
		SELECT
			id,
			user_id,
			token,
			expires_at,
			created_at
		FROM
			reset_passwords
		WHERE
			email = $1 AND token = $2 AND expires_at > CURRENT_TIMESTAMP
		ORDER BY
			when_ DESC LIMIT 1
	`

	db := db.GetDB()

	stmt, err := db.Prepare(queryStr)
	if err != nil {
		return nil, err
	}

	row := stmt.QueryRow(email, token)

	err = row.Scan(
		&res.Id,
		&res.UserID,
		&res.Token,
		&res.ExpiresAt,
		&res.CreatedAt,
	)

	if err != nil {
		return nil, err
	}

	return res, nil
}
