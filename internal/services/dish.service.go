package services

import (
	"context"
	"e-gourmet/core/internal/database"
	"github.com/gofiber/fiber/v2"
	"strings"
	"time"
)

func (s *Service) CreateDish(params *database.CreateDishParams) (*database.CreateDishRow, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	params.Name = strings.TrimSpace(params.Name)
	if params.Name == "" {
		return nil, fiber.NewError(fiber.StatusBadRequest, "Dish name is required")
	}

	if params.Price < 0 {
		return nil, fiber.NewError(fiber.StatusBadRequest, "Dish price is required and must be greater than or equal to 0")
	}

	if params.Description != nil {
		*params.Description = strings.TrimSpace(*params.Description)
	}

	return s.querier.CreateDish(ctx, s.dbtx, params)
}

func (s *Service) GetDishById(id int32) (*database.GetDishByIDRow, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	dish, err := s.querier.GetDishByID(ctx, s.dbtx, id)
	if err != nil {
		return nil, err
	}

	if dish == nil {
		return nil, fiber.NewError(fiber.StatusNotFound, "Dish not found")
	}

	return dish, nil
}

func (s *Service) DeleteDishById(id int32) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	return s.querier.DeleteDish(ctx, s.dbtx, id)
}

func (s *Service) GetDishes(params *database.GetDishesParams) ([]*database.GetDishesRow, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	menu, err := s.querier.GetDishes(ctx, s.dbtx, params)
	if err != nil {
		return nil, err
	}

	return menu, nil
}
