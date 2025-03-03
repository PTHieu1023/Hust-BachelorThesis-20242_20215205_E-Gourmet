package services

import (
	"context"
	"e-gourmet/core/internal/db"
	"e-gourmet/core/pkg/pagination"
)

type ProfileServiceV1 struct {
	db.DBContext
}

func NewProfileServiceV1(db db.DBContext) IProfileService {
	return &ProfileServiceV1{
		DBContext: db,
	}
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
	ctx := context.Background()
	dbtx, err := p.DBContext.GetConnection()
	if err != nil {
		return pagination.Pagination[db.Profile]{}, err
	}
	profiles, err := p.Query().ListProfiles(ctx, dbtx, &db.ListProfilesParams{
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
