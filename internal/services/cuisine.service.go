package services

import (
	"context"
	"e-gourmet/core/internal/database"
)

func (s *Service) GetCuisineRecursionById(ctx context.Context, id int16) ([]*database.GetCuisineRecursionByIdRow, error) {
	return s.querier.GetCuisineRecursionById(ctx, s.dbtx, int32(id))
}

func (s *Service) AddCuisine(ctx context.Context, params *database.AddCuisineParams) (*Cuisine, error) {
	if params.ParentID == nil {
		params.ParentID = new(int16)
		*params.ParentID = 0
	}

	cuisine, err := s.querier.AddCuisine(ctx, s.dbtx, params)
	if err != nil {
		return nil, err
	}
	return NewCuisine(int16(cuisine.ID), cuisine.Name, cuisine.ParentID, cuisine.ImageUrl), nil
}

func (s *Service) UpdateCuisine(ctx context.Context, params *database.UpdateCuisineParams) (*Cuisine, error) {
	cuisine, err := s.querier.UpdateCuisine(ctx, s.dbtx, params)
	if err != nil {
		return nil, err
	}
	return NewCuisine(int16(cuisine.ID), cuisine.Name, cuisine.ParentID, cuisine.ImageUrl), nil
}

func (s *Service) DeleteCuisine(ctx context.Context, id int16) error {
	return s.querier.DeleteCuisine(ctx, s.dbtx, int32(id))
}
