package services

import (
	"context"
	"e-gourmet/core/internal/repository"
	"e-gourmet/core/internal/server/database"
	"e-gourmet/core/pkg/pagination"
	"time"
)

type IProfileService interface {
	CreateProfile(params repository.CreateProfileParams) (repository.Profile, error)
	UpdateProfile(params repository.UpdateProfileParams) (repository.Profile, error)
	GetProfileById(id string) (repository.Profile, error)
	GetListProfiles(filter pagination.PageFilter) (pagination.Pagination[repository.Profile], error)
	DeleteProfileById(id string) error
}

type PService struct {
	querier repository.Querier
}

func NewProfileService(querier repository.Querier) PService {
	return PService{
		querier: querier,
	}
}

func (p *PService) GetListProfiles() (pagination.Pagination[repository.Profile], error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	profiles, err := p.querier.ListProfiles(ctx, database.DBConn(), &repository.ListProfilesParams{
		Limit:  10,
		Offset: 0,
	})
	if err != nil {
		return pagination.Pagination[repository.Profile]{}, err
	}
	res := pagination.Pagination[repository.Profile]{
		Page:       1,
		Size:       10,
		Count:      1,
		TotalPage:  1,
		TotalCount: 1,
		Content:    profiles,
	}
	return res, nil
}
