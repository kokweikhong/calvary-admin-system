package models

type User struct {
	ID                int64  `json:"id" db:"id"`
	Username          string `json:"username" db:"username"`
	Email             string `json:"email" db:"email"`
	Password          string `json:"password" db:"password"`
	Role              string `json:"role" db:"role"`
	Position          string `json:"position" db:"position"`
	Department        string `json:"department" db:"department"`
	ProfileImage      string `json:"profileImage" db:"profile_image"`
	IsExist           bool   `json:"isExist" db:"is_exist"`
	IsVerified        bool   `json:"isVerified" db:"is_verified"`
	VerifyToken       string `json:"verifyToken" db:"verify_token"`
	VerifyTokenExpire string `json:"verifyTokenExpire" db:"verify_token_expires"`
	CreatedAt         string `json:"createdAt" db:"created_at"`
	UpdatedAt         string `json:"updatedAt" db:"updated_at"`
}
