FROM golang:1.21.2-alpine3.18 AS build-stage

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o /app/bin/main-service ./cmd/main

# Run the tests in the container
# FROM build-stage AS run-test-stage
# RUN go test -v ./...

# Deploy the application binary into a lean image
FROM gcr.io/distroless/base-debian11 AS build-release-stage

WORKDIR /

COPY --from=build-stage /app/bin/main-service /app/bin/main-service

# Copy the environment file
COPY --from=build-stage /app/.env /app/.env

USER nonroot:nonroot

ENTRYPOINT ["/app/bin/main-service"]