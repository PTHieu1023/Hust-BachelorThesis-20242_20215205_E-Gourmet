package services

import (
	"context"
	"e-gourmet/core/internal/database"
)

func (s *Service) GetTopRatedDishes(ctx context.Context, limit int32) ([]*database.GetTopRatedDishesRow, error) {
	return s.querier.GetTopRatedDishes(ctx, s.dbtx, limit)
}
