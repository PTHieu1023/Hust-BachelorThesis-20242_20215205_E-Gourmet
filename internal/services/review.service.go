package services

import (
	"context"
	"github.com/gofiber/fiber/v2"
	"strings"
	"time"

	"e-gourmet/core/internal/database"
)

func (s *Service) CreateReview(params *database.CreateReviewParams) (*database.CreateReviewRow, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

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

func (s *Service) GetReviews(params *database.GetReviewsParams) ([]*database.GetReviewsRow, error) {
	if params == nil {
		return nil, fiber.NewError(fiber.StatusBadRequest, "params cannot be nil")
	}
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	return s.querier.GetReviews(ctx, s.dbtx, params)
}

func (s *Service) DeleteReview(dishId int64) error {
	if dishId <= 0 {
		return fiber.NewError(fiber.StatusBadRequest, "invalid dish ID")
	}
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	return s.querier.DeleteReview(ctx, s.dbtx, dishId)
}
