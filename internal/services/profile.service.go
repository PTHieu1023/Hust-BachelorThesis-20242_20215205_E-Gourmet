package services

import (
	"context"
	"e-gourmet/core/internal/db"
	"e-gourmet/core/internal/server/database"
	"e-gourmet/core/pkg/pagination"
	"time"
)

type ProfileServiceV1 struct {
	queries *db.Queries
}

func NewProfileServiceV1(queries *db.Queries) IProfileService {
	return &ProfileServiceV1{queries: queries}
}

func (p *ProfileServiceV1) CreateProfile(params db.CreateProfileParams) (db.Profile, error) {
	//TODO implement me
	panic("implement me")
}

func (p *ProfileServiceV1) UpdateProfile(params db.UpdateProfileParams) (db.Profile, error) {
	//TODO implement me
	panic("implement me")
}

func (p *ProfileServiceV1) GetProfileById(id string) (db.Profile, error) {
	//TODO implement me
	panic("implement me")
}

func (p *ProfileServiceV1) DeleteProfileById(id string) error {
	//TODO implement me
	panic("implement me")
}

func (p *ProfileServiceV1) GetListProfiles(filter *pagination.PageFilter) (pagination.Pagination[db.Profile], error) {
	dbtx, err := database.DBConn()
	if err != nil {
		return pagination.Pagination[db.Profile]{}, err
	}
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	profiles, err := p.queries.ListProfiles(ctx, dbtx, &db.ListProfilesParams{
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
