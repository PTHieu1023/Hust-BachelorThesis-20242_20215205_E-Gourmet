package services

import (
	"context"
	"e-gourmet/core/internal/database"
	"github.com/jackc/pgx/v5/pgxpool"
)

type IService interface {
	GetCuisineRecursionById(ctx context.Context, id int16) (*Cuisine, error)
	AddCuisine(ctx context.Context, params *database.AddCuisineParams) (*Cuisine, error)

	CreateDish(ctx context.Context, params *database.CreateDishParams) (*database.CreateDishRow, error)
	GetDishById(ctx context.Context, id int32) (*database.GetDishByIDRow, error)
	DeleteDishById(ctx context.Context, id int32) error
	GetDishes(ctx context.Context, params *database.GetDishesParams) ([]*database.GetDishesRow, error)

	CreateReview(ctx context.Context, params *database.CreateReviewParams) (*database.CreateReviewRow, error)
	GetReviews(ctx context.Context, params *database.GetReviewsParams) ([]*database.GetReviewsRow, error)
	DeleteReview(ctx context.Context, dishId int64) error

	CreateUser(ctx context.Context, params *database.CreateUserParams) (*database.User, error)
	GetUserByUsername(ctx context.Context, username string) (*database.GetUserByUsernameRow, error)
	GetUserById(ctx context.Context, id string) (*database.GetUserByIdRow, error)
	UpdateUser(ctx context.Context, params *database.UpdateUserParams) (*database.UpdateUserRow, error)

	GetRestaurants(ctx context.Context, params *database.GetRestaurantsParams) ([]*database.GetRestaurantsRow, error)
	GetRestaurantById(ctx context.Context, id int32) (*database.GetRestaurantByIDRow, error)
	CreateRestaurant(ctx context.Context, params *database.CreateRestaurantParams) (*database.Restaurant, error)
	UpdateRestaurant(ctx context.Context, params *database.UpdateRestaurantParams) (*database.Restaurant, error)
	DeleteRestaurantById(ctx context.Context, id int32) error
}

type Service struct {
	dbtx    *pgxpool.Pool
	querier database.Querier
}

func New(dbtx *pgxpool.Pool) IService {
	return &Service{
		dbtx:    dbtx,
		querier: database.New(),
	}
}
