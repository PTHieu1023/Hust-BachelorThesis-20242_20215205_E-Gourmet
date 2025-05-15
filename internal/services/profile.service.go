package services

import (
	"context"

	"e-gourmet/core/internal/database"
	"e-gourmet/core/pkg/pagination"
)

func (p *Service) GetListProfiles(filter *pagination.PageFilter) (pagination.Pagination[database.Profile], error) {
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
