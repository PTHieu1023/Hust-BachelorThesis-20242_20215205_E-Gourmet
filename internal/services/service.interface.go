package services

import (
	"e-gourmet/core/internal/database"
	"e-gourmet/core/pkg/pagination"
)

type IService interface {
	GetListProfiles(filter *pagination.PageFilter) (pagination.Pagination[database.Profile], error)
}

type Service struct {
	dbtx    database.DBTX
	querier database.Querier
}

func New(dbtx database.DBTX) IService {
	return &Service{
		dbtx:    dbtx,
		querier: database.New(),
	}
}
