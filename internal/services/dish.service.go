package services

import (
	"context"
	"e-gourmet/core/internal/database"
	"errors"
	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5"
	"strings"
)

func (s *EGServiceImpl) CreateDish(ctx context.Context, params *database.CreateDishParams) (*database.CreateDishRow, error) {
	if params.RestaurantID == nil {
		return nil, fiber.NewError(fiber.StatusBadRequest, "restaurantId is required")
	}
	if params.CuisineID == nil {
		return nil, fiber.NewError(fiber.StatusBadRequest, "cuisineId is required")
	}
	if params.Price == nil {
		return nil, fiber.NewError(fiber.StatusBadRequest, "price is required")
	}
	if params.Name == nil || strings.TrimSpace(*params.Name) == "" {
		return nil, fiber.NewError(fiber.StatusBadRequest, "name is required")
	}
	*params.Name = strings.TrimSpace(*params.Name)

	if *params.Price < 0 {
		return nil, fiber.NewError(fiber.StatusBadRequest, "Dish price is required and must be greater than or equal to 0")
	}

	if params.Description != nil {
		*params.Description = strings.TrimSpace(*params.Description)
	}

	return s.querier.CreateDish(ctx, s.dbtx, params)
}

func (s *EGServiceImpl) GetDishById(ctx context.Context, id int32, interaction *database.AddInteractionParams) (*database.GetDishByIDRow, error) {
	dish, err := s.querier.GetDishByID(ctx, s.dbtx, id)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, fiber.NewError(fiber.StatusNotFound, "Dish not found")
	}
	if err != nil {
		return nil, err
	}
	err = s.querier.AddInteraction(ctx, s.dbtx, interaction)
	if err != nil {
		return nil, err
	}
	return dish, nil
}

func (s *EGServiceImpl) DeleteDishById(ctx context.Context, id int32) error {
	return s.querier.DeleteDish(ctx, s.dbtx, id)
}

func (s *EGServiceImpl) GetDishes(ctx context.Context, params *database.GetDishesParams) ([]*database.GetDishesRow, error) {
	menu, err := s.querier.GetDishes(ctx, s.dbtx, params)
	if err != nil {
		return nil, err
	}

	return menu, nil
}

func (s *EGServiceImpl) GetDishesCount(ctx context.Context, params *database.GetDishesParams) (int64, error) {
	// For now, we'll use the total count from the dishes table with the same filters
	// In a production environment, you might want to create a separate count query
	countParams := *params
	countParams.Limit = 999999 // Set a very high limit to get all matching records
	countParams.Offset = 0

	dishes, err := s.querier.GetDishes(ctx, s.dbtx, &countParams)
	if err != nil {
		return 0, err
	}

	return int64(len(dishes)), nil
}
