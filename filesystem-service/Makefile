OS = Windows

build:
	@echo "Building for $(OS)"
	@go build -o bin/$(OS)/main.exe cmd/main/main.go
	@echo "Build complete"

run: build
	@echo "Running for $(OS)"
	@bin/$(OS)/main.exe
