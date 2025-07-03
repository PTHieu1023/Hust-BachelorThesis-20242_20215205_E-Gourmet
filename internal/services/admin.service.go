package services

import (
	"context"
	"e-gourmet/core/internal/database"
	"strings"
)

func (s *Service) IsUserAdmin(ctx context.Context, userId string) (bool, error) {
	// In a real application, this would check against a database or an authorization service
	// For this example, we'll just check for a fixed admin ID or a prefix
	return strings.HasPrefix(userId, "admin-") || userId == "admin", nil
}

func (s *Service) GetRestaurantsAdmin(ctx context.Context, params *database.GetRestaurantsAdminParams) ([]*database.GetRestaurantsAdminRow, error) {
	return s.querier.GetRestaurantsAdmin(ctx, s.dbtx, params)
}

func (s *Service) ApproveRestaurant(ctx context.Context, params *database.ApproveRestaurantParams) (*database.ApproveRestaurantRow, error) {
	return s.querier.ApproveRestaurant(ctx, s.dbtx, params)
}

func (s *Service) GetAllUsers(ctx context.Context, params *database.GetAllUsersParams) ([]*database.GetAllUsersRow, error) {
	return s.querier.GetAllUsers(ctx, s.dbtx, params)
}

func (s *Service) SetUserStatus(ctx context.Context, params *database.SetUserStatusParams) error {
	return s.querier.SetUserStatus(ctx, s.dbtx, params)
}

func (s *Service) LikePost(ctx context.Context, params *database.LikePostParams) error {
	return s.querier.LikePost(ctx, s.dbtx, params)
}

func (s *Service) UnlikePost(ctx context.Context, params *database.UnlikePostParams) error {
	return s.querier.UnlikePost(ctx, s.dbtx, params)
}

func (s *Service) IsPostLiked(ctx context.Context, params *database.CheckPostLikeParams) (bool, error) {
	return s.querier.CheckPostLike(ctx, s.dbtx, params)
}
