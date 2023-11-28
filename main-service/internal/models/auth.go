package models

type AuthSignIn struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type AuthUser struct {
	User
	AccessToken           string `json:"accessToken"`
	AccessTokenExpiresAt  int64  `json:"accessTokenExpiresAt"`
	RefreshToken          string `json:"refreshToken"`
	RefreshTokenExpiresAt int64  `json:"refreshTokenExpiresAt"`
}
