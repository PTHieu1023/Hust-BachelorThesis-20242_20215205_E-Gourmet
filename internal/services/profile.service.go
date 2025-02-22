package services

import (
	"context"
	"e-gourmet/core/internal/db"
	"e-gourmet/core/internal/server/database"
	"time"
)

func GetProfileList() ([]db.Profile, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	return database.DB().ListProfiles(ctx, db.ListProfilesParams{
		Limit:  10,
		Offset: 0,
	})
}
