package services

import (
	"context"
	"e-gourmet/core/internal/database"
)

func (s *Service) GetPosts(ctx context.Context, params *database.GetPostsParams) ([]*database.GetPostsRow, error) {
	return s.querier.GetPosts(ctx, s.dbtx, params)
}

func (s *Service) GetPostById(ctx context.Context, id int64) (*database.GetPostByIDRow, error) {
	return s.querier.GetPostByID(ctx, s.dbtx, id)
}

func (s *Service) GetPostsByRestaurant(ctx context.Context, params *database.GetPostsByRestaurantParams) ([]*database.GetPostsByRestaurantRow, error) {
	return s.querier.GetPostsByRestaurant(ctx, s.dbtx, params)
}

func (s *Service) CreatePost(ctx context.Context, params *database.CreatePostParams) (*database.Post, error) {
	return s.querier.CreatePost(ctx, s.dbtx, params)
}

func (s *Service) UpdatePost(ctx context.Context, params *database.UpdatePostParams) (*database.Post, error) {
	return s.querier.UpdatePost(ctx, s.dbtx, params)
}

func (s *Service) DeletePost(ctx context.Context, id int64) error {
	return s.querier.DeletePost(ctx, s.dbtx, id)
}

func (s *Service) CreateComment(ctx context.Context, params *database.CreateCommentParams) (*database.PostsComment, error) {
	return s.querier.CreateComment(ctx, s.dbtx, params)
}

func (s *Service) GetCommentsByPost(ctx context.Context, postId int64) ([]*database.GetCommentsByPostRow, error) {
	return s.querier.GetCommentsByPost(ctx, s.dbtx, postId)
}

func (s *Service) DeleteComment(ctx context.Context, params *database.DeleteCommentParams) error {
	return s.querier.DeleteComment(ctx, s.dbtx, params)
}
