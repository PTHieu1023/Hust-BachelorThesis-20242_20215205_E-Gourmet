package services

import (
	"context"
	"e-gourmet/core/internal/database"
	"github.com/gofiber/fiber/v2"
	"strings"
)

func (s *Service) CreateReview(ctx context.Context, params *database.CreateReviewParams) (*database.CreateReviewRow, error) {
	if params == nil {
		return nil, fiber.NewError(fiber.StatusBadRequest, "params cannot be nil")
	}
	if params.Rating == nil || params.Comment == nil || params.UserID == nil || params.DishID == nil {
		return nil, fiber.NewError(fiber.StatusBadRequest, "all fields are required")
	}

	if *params.Rating < 1 || *params.Rating > 5 {
		return nil, fiber.NewError(fiber.StatusBadRequest, "rating must be between 1 and 5")
	}

	*params.UserID = strings.TrimSpace(*params.UserID)

	return s.querier.CreateReview(ctx, s.dbtx, params)
}

func (s *Service) GetReviews(ctx context.Context, params *database.GetReviewsParams) ([]*database.GetReviewsRow, error) {
	if params == nil {
		return nil, fiber.NewError(fiber.StatusBadRequest, "params cannot be nil")
	}
	return s.querier.GetReviews(ctx, s.dbtx, params)
}

func (s *Service) GetReviewsCount(ctx context.Context, params *database.GetReviewsCountParams) (int64, error) {
	return s.querier.GetReviewsCount(ctx, s.dbtx, params)
}

func (s *Service) DeleteReview(ctx context.Context, dishId int64) error {
	if dishId <= 0 {
		return fiber.NewError(fiber.StatusBadRequest, "invalid dish ID")
	}

	return s.querier.DeleteReview(ctx, s.dbtx, dishId)
}

func (s *Service) GetCurrentUserReview(ctx context.Context, dishId int32, userId string) (*database.GetCurrentUserReviewRow, error) {
	if dishId <= 0 {
		return nil, fiber.NewError(fiber.StatusBadRequest, "invalid dish ID")
	}
	if strings.TrimSpace(userId) == "" {
		return nil, fiber.NewError(fiber.StatusBadRequest, "user ID is required")
	}

	params := &database.GetCurrentUserReviewParams{
		DishID: dishId,
		UserID: strings.TrimSpace(userId),
	}

	return s.querier.GetCurrentUserReview(ctx, s.dbtx, params)
}

func (s *Service) GetUserProfileReviews(ctx context.Context, params *database.GetUserProfileReviewsParams) ([]*database.GetUserProfileReviewsRow, error) {
	if params == nil {
		return nil, fiber.NewError(fiber.StatusBadRequest, "params cannot be nil")
	}
	if params.UserID == nil {
		return nil, fiber.NewError(fiber.StatusBadRequest, "user ID is required")
	}

	// Set default pagination if not provided
	if params.Limit <= 0 {
		params.Limit = 10
	}
	if params.Offset < 0 {
		params.Offset = 0
	}

	return s.querier.GetUserProfileReviews(ctx, s.dbtx, params)
}
