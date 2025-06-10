package services

import (
	"context"
	"e-gourmet/core/internal/database"
	"e-gourmet/core/internal/middlewares"
	"errors"
	"github.com/gofiber/fiber/v2"
)

func (s *Service) GetRestaurants(ctx context.Context, params *database.GetRestaurantsParams) ([]*database.GetRestaurantsRow, error) {
	return s.querier.GetRestaurants(ctx, s.dbtx, params)
}

func (s *Service) GetRestaurantById(ctx context.Context, id int32) (*database.GetRestaurantByIDRow, error) {
	return s.querier.GetRestaurantByID(ctx, s.dbtx, id)
}

func (s *Service) CreateRestaurant(ctx context.Context, params *database.CreateRestaurantParams) (*database.Restaurant, error) {
	tx, err := s.dbtx.Begin(ctx)
	if err != nil {
		return nil, err
	}

	committed := false
	defer func() {
		if !committed {
			_ = tx.Rollback(ctx)
		}
	}()

	restaurant, err := s.querier.CreateRestaurant(ctx, tx, params)
	if err != nil {
		return nil, err
	}

	userID, ok := ctx.Value(middlewares.CtxUserID).(string)
	if !ok || userID == "" {
		return nil, errors.New("USER_ID_NIL_OR_EMPTY")
	}
	managerParams := &database.AddRestaurantManagerParams{
		RestaurantID: restaurant.ID,
		UserID:       userID,
		IsOwner:      true,
	}

	err = s.querier.AddRestaurantManager(ctx, tx, managerParams)
	if err != nil {
		return nil, err
	}

	if err = tx.Commit(ctx); err != nil {
		return nil, err
	}
	committed = true
	return restaurant, nil
}

func (s *Service) UpdateRestaurant(ctx context.Context, params *database.UpdateRestaurantParams) (*database.Restaurant, error) {
	if params == nil {
		return nil, fiber.NewError(fiber.StatusBadRequest, "params must not be nil")
	}
	if params.RestaurantID <= 0 {
		return nil, fiber.NewError(fiber.StatusBadRequest, "id must be greater than 0")
	}

	return s.querier.UpdateRestaurant(ctx, s.dbtx, params)
}

func (s *Service) DeleteRestaurantById(ctx context.Context, id int32) error {
	if id <= 0 {
		return fiber.NewError(fiber.StatusBadRequest, "id must be greater than 0")
	}

	return s.querier.DeleteRestaurant(ctx, s.dbtx, id)
}
