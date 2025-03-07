package services

import (
	"context"
	"e-gourmet/core/internal/db"

	//"e-gourmet/core/internal/config"
	//"e-gourmet/core/internal/db"
	"e-gourmet/core/pkg/pagination"
)

type ProfileServiceV1 struct {
	dbtx    db.DBTX
	querier db.Querier
}

func NewProfileServiceV1(dbtx db.DBTX, querier db.Querier) IProfileService {
	return &ProfileServiceV1{
		dbtx:    dbtx,
		querier: querier,
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
	profiles, err := p.querier.ListProfiles(ctx, p.dbtx, &db.ListProfilesParams{
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
