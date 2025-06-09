package services

import (
	"e-gourmet/core/internal/database"
)

type IService interface {
	GetCuisineRecursionById(id int16) (*Cuisine, error)
	AddCuisine(params *database.AddCuisineParams) (*Cuisine, error)

	CreateDish(params *database.CreateDishParams) (*database.CreateDishRow, error)
	GetDishById(id int32) (*database.GetDishByIDRow, error)
	DeleteDishById(id int32) error
	GetDishes(params *database.GetDishesParams) ([]*database.GetDishesRow, error)

	CreateReview(params *database.CreateReviewParams) (*database.CreateReviewRow, error)
	GetReviews(params *database.GetReviewsParams) ([]*database.GetReviewsRow, error)
	DeleteReview(dishId int64) error

	CreateUser(params *database.CreateUserParams) (*database.User, error)
	GetUserByUsername(username string) (*database.GetUserByUsernameRow, error)
	GetUserById(id string) (*database.GetUserByIdRow, error)
	UpdateUser(params *database.UpdateUserParams) (*database.UpdateUserRow, error)
}

type Service struct {
	dbtx    database.DBTX
	querier database.Querier
}

func New(dbtx database.DBTX) IService {
	return &Service{
		dbtx:    dbtx,
		querier: database.New(),
	}
}
