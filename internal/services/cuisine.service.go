package services

import (
	"context"
	"e-gourmet/core/internal/database"
	"github.com/gofiber/fiber/v2"
	"strings"
)

func (s *Service) GetCuisineRecursionById(ctx context.Context, id int16) ([]*database.GetCuisineRecursionByIdRow, error) {
	return s.querier.GetCuisineRecursionById(ctx, s.dbtx, id)
}

func (s *Service) AddCuisine(ctx context.Context, params *database.AddCuisineParams) (*Cuisine, error) {
	params.Name = strings.TrimSpace(params.Name)
	if params.Name == "" {
		return nil, fiber.NewError(
			fiber.StatusBadRequest,
			"Cuisine name is required")
	}
	if params.ParentID == nil {
		params.ParentID = new(int16)
		*params.ParentID = 0
	}

	cuisine, err := s.querier.AddCuisine(ctx, s.dbtx, params)
	if err != nil {
		return nil, err
	}
	return NewCuisine(cuisine.ID, cuisine.Name, cuisine.ParentID, cuisine.ImageUrl), nil
}
