package services

import (
	"context"
	"e-gourmet/core/internal/db"
	"e-gourmet/core/internal/server/database"
	"e-gourmet/core/pkg/pagination"
	"time"
)

type IProfileService interface {
	CreateProfile(params db.CreateProfileParams) (db.Profile, error)
	UpdateProfile(params db.UpdateProfileParams) (db.Profile, error)
	GetProfileById(id string) (db.Profile, error)
	GetListProfiles(filter pagination.PageFilter) (pagination.Pagination[db.Profile], error)
	DeleteProfileById(id string) error
}

type PService struct {
}

func (p *PService) GetListProfiles() (pagination.Pagination[db.Profile], error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	profiles, err := database.DB().ListProfiles(ctx, db.ListProfilesParams{
		Limit:  10,
		Offset: 0,
	})
	if err != nil {
		return pagination.Pagination[db.Profile]{}, err
	}
	res := pagination.Pagination[db.Profile]{
		Page:       1,
		Size:       10,
		Count:      1,
		TotalPage:  1,
		TotalCount: 1,
		Content:    profiles,
	}
	return res, nil
}
