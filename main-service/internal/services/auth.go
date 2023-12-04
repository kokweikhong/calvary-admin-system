package services

import (
	"errors"
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

	// accessTokenPayload, err := s.GenerateToken(user.Username, time.Minute*15)
	accessTokenPayload, err := s.GenerateToken(user.Username, time.Minute*1)
	if err != nil {
		return nil, err
	}

	// refreshTokenPayload, err := s.GenerateToken(user.Username, time.Hour*24*7)
	refreshTokenPayload, err := s.GenerateToken(user.Username, time.Minute*20)
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
