package services

import (
	"context"
	"e-gourmet/core/internal/database"
	"strings"
)

func (s *EGServiceImpl) IsUserAdmin(ctx context.Context, userId string) (bool, error) {
	// In a real application, this would check against a database or an authorization service
	// For this example, we'll just check for a fixed admin ID or a prefix
	return strings.HasPrefix(userId, "admin-") || userId == "admin", nil
}

func (s *EGServiceImpl) GetRestaurantsAdmin(ctx context.Context, params *database.GetRestaurantsAdminParams) ([]*database.GetRestaurantsAdminRow, error) {
	return s.querier.GetRestaurantsAdmin(ctx, s.dbtx, params)
}

func (s *EGServiceImpl) ApproveRestaurant(ctx context.Context, params *database.ApproveRestaurantParams) (*database.ApproveRestaurantRow, error) {
	return s.querier.ApproveRestaurant(ctx, s.dbtx, params)
}

func (s *EGServiceImpl) GetAllUsers(ctx context.Context, params *database.GetAllUsersParams) ([]*database.GetAllUsersRow, error) {
	return s.querier.GetAllUsers(ctx, s.dbtx, params)
}

func (s *EGServiceImpl) SetUserStatus(ctx context.Context, params *database.SetUserStatusParams) error {
	return s.querier.SetUserStatus(ctx, s.dbtx, params)
}

func (s *EGServiceImpl) LikePost(ctx context.Context, params *database.LikePostParams) error {
	return s.querier.LikePost(ctx, s.dbtx, params)
}

func (s *EGServiceImpl) UnlikePost(ctx context.Context, params *database.UnlikePostParams) error {
	return s.querier.UnlikePost(ctx, s.dbtx, params)
}

func (s *EGServiceImpl) IsPostLiked(ctx context.Context, params *database.CheckPostLikeParams) (bool, error) {
	return s.querier.CheckPostLike(ctx, s.dbtx, params)
}
