package services

import (
	"context"
	"e-gourmet/core/internal/database"
	"github.com/Nerzal/gocloak/v13"
	"github.com/jackc/pgx/v5/pgxpool"
)

type EGService interface {
	GetCuisineRecursionById(ctx context.Context, id int16) ([]*database.GetCuisineRecursionByIdRow, error)
	AddCuisine(ctx context.Context, params *database.AddCuisineParams) (*Cuisine, error)
	UpdateCuisine(ctx context.Context, params *database.UpdateCuisineParams) (*Cuisine, error)
	DeleteCuisine(ctx context.Context, id int16) error

	CreateDish(ctx context.Context, params *database.CreateDishParams) (*database.CreateDishRow, error)
	GetDishById(ctx context.Context, id int32, interaction *database.AddInteractionParams) (*database.GetDishByIDRow, error)
	DeleteDishById(ctx context.Context, id int32) error
	GetDishes(ctx context.Context, params *database.GetDishesParams) ([]*database.GetDishesRow, error)
	GetDishesCount(ctx context.Context, params *database.GetDishesParams) (int64, error)

	CreateReview(ctx context.Context, params *database.CreateReviewParams) (*database.CreateReviewRow, error)
	GetReviews(ctx context.Context, params *database.GetReviewsParams) ([]*database.GetReviewsRow, error)
	DeleteReview(ctx context.Context, dishId int64) error

	CreateUser(ctx context.Context, params *database.CreateUserParams) (*database.User, error)
	CreateUserFromAuth(ctx context.Context, params *database.CreateUserFromAuthParams) (*database.User, error)
	GetUserByUsername(ctx context.Context, username string) (*database.GetUserByUsernameRow, error)
	GetUserById(ctx context.Context, id string) (*database.GetUserByIdRow, error)
	UpdateUser(ctx context.Context, params *database.UpdateUserParams) (*database.UpdateUserRow, error)

	GetRestaurants(ctx context.Context, params *database.GetRestaurantsParams) ([]*database.GetRestaurantsRow, error)
	CreateRestaurant(ctx context.Context, params *database.CreateRestaurantParams) (*database.Restaurant, error)
	UpdateRestaurant(ctx context.Context, params *database.UpdateRestaurantParams) (*database.Restaurant, error)
	DeleteRestaurantById(ctx context.Context, id int32) error
	GetRestaurantByOwnerId(ctx context.Context, ownerId string) (*database.GetRestaurantByOwnerIdRow, error)

	GetRestaurantByUsername(ctx context.Context, username string) (*database.GetRestaurantByUsernameRow, error)
	GetRestaurantProfile(ctx context.Context, id int32) (*database.GetRestaurantProfileRow, error)
	GetRestaurantHighlights(ctx context.Context, id int32) ([]*database.GetRestaurantHighlightsRow, error)
	GetRestaurantRecentReviews(ctx context.Context, id int32) ([]*database.GetRestaurantRecentReviewsRow, error)

	GetPosts(ctx context.Context, params *database.GetPostsParams) ([]*database.GetPostsRow, error)
	GetPostById(ctx context.Context, id int64) (*database.GetPostByIDRow, error)
	GetPostsByRestaurant(ctx context.Context, params *database.GetPostsByRestaurantParams) ([]*database.GetPostsByRestaurantRow, error)
	CreatePost(ctx context.Context, params *database.CreatePostParams) (*database.Post, error)
	UpdatePost(ctx context.Context, params *database.UpdatePostParams) (*database.Post, error)
	DeletePost(ctx context.Context, id int64) error

	CreateComment(ctx context.Context, params *database.CreateCommentParams) (*database.PostsComment, error)
	GetCommentsByPost(ctx context.Context, postId int64) ([]*database.GetCommentsByPostRow, error)
	DeleteComment(ctx context.Context, params *database.DeleteCommentParams) error

	IsUserAdmin(ctx context.Context, userId string) (bool, error)
	GetRestaurantsAdmin(ctx context.Context, params *database.GetRestaurantsAdminParams) ([]*database.GetRestaurantsAdminRow, error)
	ApproveRestaurant(ctx context.Context, params *database.ApproveRestaurantParams) (*database.ApproveRestaurantRow, error)
	GetAllUsers(ctx context.Context, params *database.GetAllUsersParams) ([]*database.GetAllUsersRow, error)
	SetUserStatus(ctx context.Context, params *database.SetUserStatusParams) error
	LikePost(ctx context.Context, params *database.LikePostParams) error
	UnlikePost(ctx context.Context, params *database.UnlikePostParams) error
	IsPostLiked(ctx context.Context, params *database.CheckPostLikeParams) (bool, error)

	GetTopRatedDishes(ctx context.Context, limit int32) ([]*database.GetTopRatedDishesRow, error)
	GetUserRecommendations(ctx context.Context, userId string) ([]*database.GetUserRecommendationsRow, error)
	GetLatestUserRecommendation(ctx context.Context, userId string) (interface{}, error)
	DeleteOldUserRecommendations(ctx context.Context, userId string) error
}

type EGServiceImpl struct {
	kc      *gocloak.GoCloak
	dbtx    *pgxpool.Pool
	querier database.Querier
}

func New(dbtx *pgxpool.Pool, kc *gocloak.GoCloak) EGService {
	return &EGServiceImpl{
		kc:      kc,
		dbtx:    dbtx,
		querier: database.New(),
	}
}
