package services

import (
	"context"
	"e-gourmet/core/internal/database"
	"github.com/gofiber/fiber/v2"
)

func (s *EGServiceImpl) GetTopRatedDishes(ctx context.Context, limit int32) ([]*database.GetTopRatedDishesRow, error) {
	if limit <= 0 {
		limit = 10
	}
	return s.querier.GetTopRatedDishes(ctx, s.dbtx, limit)
}

func (s *EGServiceImpl) GetUserRecommendations(ctx context.Context, userId string) ([]*database.GetUserRecommendationsRow, error) {
	if userId == "" {
		return nil, fiber.NewError(fiber.StatusBadRequest, "user ID is required")
	}
	return s.querier.GetUserRecommendations(ctx, s.dbtx, &userId)
}

func (s *EGServiceImpl) GetLatestUserRecommendation(ctx context.Context, userId string) (interface{}, error) {
	if userId == "" {
		return nil, fiber.NewError(fiber.StatusBadRequest, "user ID is required")
	}
	return s.querier.GetLatestUserRecommendation(ctx, s.dbtx, &userId)
}

func (s *EGServiceImpl) DeleteOldUserRecommendations(ctx context.Context, userId string) error {
	if userId == "" {
		return fiber.NewError(fiber.StatusBadRequest, "user ID is required")
	}
	return s.querier.DeleteOldUserRecommendations(ctx, s.dbtx, &userId)
}
