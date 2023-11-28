package services

import (
	"github.com/kokweikhong/calvary-admin-system/main-service/internal/db"
	"github.com/kokweikhong/calvary-admin-system/main-service/internal/models"
)

type AuthService interface {
    SignIn(username string, password string) (*models.AuthUser, error)
    GetAccessToken(refreshToken string) (*models.AuthUser, error)
    RefreshAccessToken(refreshToken string) (*models.AuthUser, error)
    IsAuthenticated(accessToken string) (*models.AuthUser, error)
}

type authService struct {
}

func NewAuthService() AuthService {
    return &authService{}
}

func (s *authService) SignIn(username string, password string) (*models.AuthUser, error) {
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
            username = $1 OR email = $1
    `

    row := db.QueryRow(queryStr, username)

    user := &models.User{}
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
        return nil, err
    }





    return nil, nil
}

func (s *authService) GetAccessToken(refreshToken string) (*models.AuthUser, error) {
    return nil, nil
}

func (s *authService) RefreshAccessToken(refreshToken string) (*models.AuthUser, error) {
    return nil, nil
}

func (s *authService) IsAuthenticated(accessToken string) (*models.AuthUser, error) {
    return nil, nil
}

// validate jwt token
// func (s *authService) ValidateToken(token string) (*models.AuthUser, error) {

