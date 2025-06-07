package services

import (
	"e-gourmet/core/internal/database"
)

type IService interface {
	GetCuisineRecursionById(id int16) (*Cuisine, error)
	AddCuisine(params *database.AddCuisineParams) (*Cuisine, error)
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
