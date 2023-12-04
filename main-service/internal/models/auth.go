package models

import (
	"github.com/golang-jwt/jwt/v5"
)

type AuthSignInRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type AuthUser struct {
	User         *User       `json:"user"`
	AccessToken  *JWTPayload `json:"accessToken"`
	RefreshToken *JWTPayload `json:"refreshToken"`
}

type JWTCustomClaims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

type JWTPayload struct {
	Username  string `json:"username"`
	Token     string `json:"token"`
	Issuer    string `json:"iss"`
	ExpiresAt int64  `json:"expiresAt"`
}
