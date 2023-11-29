package middlewares

import (
	"errors"
	"net/http"
	"strings"

	"github.com/kokweikhong/calvary-admin-system/main-service/internal/services"
	"github.com/kokweikhong/calvary-admin-system/main-service/internal/utils"
)

type AuthMiddleware interface {
	AuthRoute(next http.Handler) http.Handler
}

type authMiddleware struct {
	jsonH utils.JSONHandler
}

func NewAuthMiddleware() AuthMiddleware {
	return &authMiddleware{
		jsonH: utils.NewJSONHandler(),
	}
}

func (m *authMiddleware) AuthRoute(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Get token from header
		tokenString := r.Header.Get("Authorization")
		if tokenString == "" {
			m.jsonH.ErrorJSON(w, errors.New("missing token"), http.StatusUnauthorized)
			return
		}

		// Remove "Bearer " from token string
		tokenString = strings.Replace(tokenString, "Bearer ", "", 1)

		// Verify token
		verified, err := services.NewAuthService().VerifyToken(tokenString)
		if err != nil {
			m.jsonH.ErrorJSON(w, err, http.StatusUnauthorized)
			return
		}

		if !verified {
			m.jsonH.ErrorJSON(w, errors.New("user not verified"), http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r)
	})
}
