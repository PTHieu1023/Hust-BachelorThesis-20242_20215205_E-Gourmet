# syntax=docker/dockerfile:1

# Build the application from source
FROM golang:1.24 AS build-stage

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o ./e-gourmet

FROM alpine:latest AS run-stage

WORKDIR /

COPY --from=build-stage /app/e-gourmet /e-gourmet
COPY ./etc/config /etc/config

EXPOSE 8080

ENTRYPOINT ["/e-gourmet"]