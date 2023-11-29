package routes

import (
	"fmt"
	"log"
	"log/slog"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/kokweikhong/calvary-admin-system/main-service/internal/middlewares"
)

func Init() chi.Router {
	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)

	// cors
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// static files serving uploads directory
	r.Handle("/uploads/*", http.StripPrefix("/uploads/", http.FileServer(http.Dir("./uploads"))))

	// routes
	r.Route("/api/v1", func(r chi.Router) {
		
		r.Use(middlewares.NewAuthMiddleware().AuthRoute)
		r.Mount("/filesystem", NewFileSystemRouter())
		r.Mount("/inventory", NewInventoryRouter())
		r.Mount("/", NewUserRouter())
	})

	return r
}

func Run(r chi.Router, addr string) {
	slog.Info("Server running on port "+addr, "addr", addr)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", addr), r))
}
