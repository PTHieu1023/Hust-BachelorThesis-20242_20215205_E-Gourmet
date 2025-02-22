package services

import (
	"context"
	"e-gourmet/core/internal/db"
	"e-gourmet/core/internal/server"
	"time"
)

func GetProfileList() ([]db.Profile, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	return server.DB().ListProfiles(ctx, db.ListProfilesParams{
		Limit:  10,
		Offset: 0,
	})
}
