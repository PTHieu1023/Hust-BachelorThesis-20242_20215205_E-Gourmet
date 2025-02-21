package main

import (
	"context"
	"e-gourmet/core/internal/db"
	"fmt"
	"github.com/jackc/pgx/v5/pgtype"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	ctx := context.Background()
	dbURL := "postgres://egourmet:egourmet@localhost:5432/egourmet"

	conn, err := pgxpool.New(ctx, dbURL)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}
	defer conn.Close()

	queries := db.New(conn)

	param := db.CreateProfileParams{
		ProfileType:   pgtype.Text{String: "USER", Valid: true},
		TagName:       "demo1",
		Name:          "Test User",
		Email:         "test1@example.com",
		PhoneNumber:   pgtype.Text{String: "123-456-78a", Valid: true},
		AvatarUrl:     pgtype.Text{String: "https://avatars.githubusercontent.com/u/123-456-789", Valid: true},
		Biography:     pgtype.Text{String: "Test User", Valid: true},
		DetailAddress: pgtype.Text{String: "Test User", Valid: true},
		LocalAddress:  pgtype.Text{String: "Test User", Valid: true},
		Lat:           pgtype.Float8{Float64: 0, Valid: true},
		Lng:           pgtype.Float8{Float64: 0, Valid: true},
		Enable:        pgtype.Bool{Bool: true, Valid: true},
	}
	// Create a new profile
	profile, err := queries.CreateProfile(ctx, param)
	if err != nil {
		log.Fatalf("Failed to create profile: %v\n", err)
	}
	fmt.Printf("Created Profile: %+v\n", profile)
}
