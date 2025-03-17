package services

import (
	"context"

	"e-gourmet/core/internal/database"
	"e-gourmet/core/pkg/pagination"
)

type ProfileServiceV1 struct {
	dbtx    database.DBTX
	querier database.Querier
}

func NewProfileServiceV1(dbtx database.DBTX, querier database.Querier) IProfileService {
	return &ProfileServiceV1{
		dbtx:    dbtx,
		querier: querier,
	}
}

func (p *ProfileServiceV1) CreateProfile(params database.CreateProfileParams) (database.Profile, error) {
	//TODO implement me
	panic("implement me")
}

func (p *ProfileServiceV1) UpdateProfile(params database.UpdateProfileParams) (database.Profile, error) {
	//TODO implement me
	panic("implement me")
}

func (p *ProfileServiceV1) GetProfileById(id string) (database.Profile, error) {
	//TODO implement me
	panic("implement me")
}

func (p *ProfileServiceV1) DeleteProfileById(id string) error {
	//TODO implement me
	panic("implement me")
}

func (p *ProfileServiceV1) GetListProfiles(filter *pagination.PageFilter) (pagination.Pagination[database.Profile], error) {
	ctx := context.Background()
	profiles, err := p.querier.ListProfiles(ctx, p.dbtx, &database.ListProfilesParams{
		Limit:  int32(filter.Size),
		Offset: int32((filter.Page - 1) * filter.Size),
	})

	if err != nil {
		return pagination.Pagination[database.Profile]{}, err
	}
	res := pagination.Pagination[database.Profile]{
		Page:       1,
		Size:       10,
		Count:      1,
		TotalPage:  1,
		TotalCount: 1,
		Content:    profiles,
	}
	return res, nil
}
