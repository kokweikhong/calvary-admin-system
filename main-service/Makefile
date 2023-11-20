build:
	@echo "Building..."
	@go build -o ./bin/main-service -v ./cmd/main/main.go
	@echo "Build complete."

run: build
	@echo "Running..."
	@./bin/main-service
	
DB_URL=postgres://calvary:calvary@123@localhost:5432/calvary?sslmode=disable

migrate-create:
	@echo "Creating migration..."
	@migrate create -ext sql -dir ./migrations -seq $(name)
	@echo "Migration created."
	
migrate-up:
	@echo "Migrating up..."
	@migrate -path ./migrations -database $(DB_URL) up
	@echo "Migration up complete."

migrate-down:
	@echo "Migrating down..."
	@migrate -path ./migrations -database $(DB_URL) down
	@echo "Migration down complete."

migrate-force:
	@echo "Migrating force..."
	@migrate -path ./migrations -database $(DB_URL) force $(version)
	@echo "Migration force complete."
	
