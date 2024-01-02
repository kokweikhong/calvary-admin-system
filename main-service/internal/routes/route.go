package routes

import (
	"fmt"
	"log"
	"log/slog"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
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
	// r.Handle("/uploads/*", http.StripPrefix("/uploads/", http.FileServer(http.Dir("uploads"))))

	workDir, _ := os.Getwd()
    slog.Info("workDir", "workDir", workDir)
	filesDir := http.Dir(filepath.Join(workDir, "app/uploads"))
	FileServer(r, "/uploads", filesDir)

	// fs := http.FileServer(http.Dir("uploads"))
	// http.Handle("/uploads/", http.StripPrefix("/uploads/", fs))

	// routes
	r.Route("/api/v1", func(r chi.Router) {
		NewUserRouter(r)
		NewAuthRouter(r)
		// r.Use(middlewares.NewAuthMiddleware().AuthRoute)
		r.Mount("/filesystem", NewFileSystemRouter())
		r.Mount("/inventory", NewInventoryRouter())
	})

	return r
}

func Run(r chi.Router, addr string) {
	slog.Info("Server running on port "+addr, "addr", addr)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", addr), r))
}

func FileServer(r chi.Router, path string, root http.FileSystem) {
	if strings.ContainsAny(path, "{}*") {
		panic("FileServer does not permit any URL parameters.")
	}

	if path != "/" && path[len(path)-1] != '/' {
		r.Get(path, http.RedirectHandler(path+"/", 301).ServeHTTP)
		path += "/"
	}
	path += "*"

	r.Get(path, func(w http.ResponseWriter, r *http.Request) {
		rctx := chi.RouteContext(r.Context())
		pathPrefix := strings.TrimSuffix(rctx.RoutePattern(), "/*")
		fs := http.StripPrefix(pathPrefix, http.FileServer(root))
		fs.ServeHTTP(w, r)
	})
}
