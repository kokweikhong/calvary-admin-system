package models

import "github.com/golang-jwt/jwt/v5"

type AuthSignIn struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type AuthUser struct {
	UserID                int64  `json:"userId"`
	Username              string `json:"username"`
	Role                  string `json:"role"`
	AccessToken           string `json:"accessToken"`
	AccessTokenExpiresAt  int64  `json:"accessTokenExpiresAt"`
	RefreshToken          string `json:"refreshToken"`
	RefreshTokenExpiresAt int64  `json:"refreshTokenExpiresAt"`
}

type JWTCustomClaims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

type JWTPayload struct {
	Username  string `json:"username"`
	Token     string `json:"token"`
	Issuer    string `json:"iss"`
	ExpiresAt int64  `json:"exp"`
}

type SignInRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
