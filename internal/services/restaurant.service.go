package services

import (
	"context"
	"e-gourmet/core/internal/database"
	"e-gourmet/core/internal/utils"
	"errors"
	"github.com/gofiber/fiber/v2"
)

func (s *Service) GetRestaurants(ctx context.Context, params *database.GetRestaurantsParams) ([]*database.GetRestaurantsRow, error) {
	return s.querier.GetRestaurants(ctx, s.dbtx, params)
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

	userID, ok := ctx.Value(utils.AuthUserID).(string)
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

func (s *Service) GetRestaurantByOwnerId(ctx context.Context, ownerId string) (*database.GetRestaurantByOwnerIdRow, error) {
	if ownerId == "" {
		return nil, fiber.NewError(fiber.StatusBadRequest, "Owner ID cannot be empty")
	}

	result, err := s.querier.GetRestaurantByOwnerId(ctx, s.dbtx, ownerId)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func (s *Service) GetRestaurantByUsername(ctx context.Context, username string) (*database.GetRestaurantByUsernameRow, error) {
	return s.querier.GetRestaurantByUsername(ctx, s.dbtx, username)
}

func (s *Service) GetRestaurantProfile(ctx context.Context, id int32) (*database.GetRestaurantProfileRow, error) {
	return s.querier.GetRestaurantProfile(ctx, s.dbtx, id)
}

func (s *Service) GetRestaurantHighlights(ctx context.Context, id int32) ([]*database.GetRestaurantHighlightsRow, error) {
	return s.querier.GetRestaurantHighlights(ctx, s.dbtx, id)
}

func (s *Service) GetRestaurantRecentReviews(ctx context.Context, id int32) ([]*database.GetRestaurantRecentReviewsRow, error) {
	return s.querier.GetRestaurantRecentReviews(ctx, s.dbtx, id)
}
