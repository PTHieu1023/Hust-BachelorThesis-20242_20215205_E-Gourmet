package controllers

import (
	"e-gourmet/core/internal/services"
	"github.com/gofiber/fiber/v2"
)

type IController interface {
	GetCuisines(ctx *fiber.Ctx) error
	AddCuisine(ctx *fiber.Ctx) error
	UpdateCuisine(ctx *fiber.Ctx) error
	DeleteCuisine(ctx *fiber.Ctx) error

	CreateDish(ctx *fiber.Ctx) error
	GetDishById(ctx *fiber.Ctx) error
	DeleteDishById(ctx *fiber.Ctx) error
	GetDishes(ctx *fiber.Ctx) error

	CreateReview(ctx *fiber.Ctx) error
	GetReviews(ctx *fiber.Ctx) error
	DeleteReview(ctx *fiber.Ctx) error

	GetCurrentUser(ctx *fiber.Ctx) error
	GetUserByUsername(ctx *fiber.Ctx) error
	UpdateCurrentUser(ctx *fiber.Ctx) error

	CreateRestaurant(ctx *fiber.Ctx) error
	GetRestaurants(ctx *fiber.Ctx) error
	UpdateRestaurant(ctx *fiber.Ctx) error
	DeleteRestaurantById(ctx *fiber.Ctx) error
	GetCurrentUserRestaurant(ctx *fiber.Ctx) error

	GetRestaurantByUsername(ctx *fiber.Ctx) error
	GetRestaurantProfile(ctx *fiber.Ctx) error
	GetRestaurantHighlights(ctx *fiber.Ctx) error
	GetRestaurantRecentReviews(ctx *fiber.Ctx) error

	GetPosts(ctx *fiber.Ctx) error
	GetPostById(ctx *fiber.Ctx) error
	CreatePost(ctx *fiber.Ctx) error
	UpdatePost(ctx *fiber.Ctx) error
	DeletePost(ctx *fiber.Ctx) error
	LikePost(ctx *fiber.Ctx) error
	UnlikePost(ctx *fiber.Ctx) error

	CreateComment(ctx *fiber.Ctx) error
	GetCommentsByPost(ctx *fiber.Ctx) error
	DeleteComment(ctx *fiber.Ctx) error

	GetRecommendations(ctx *fiber.Ctx) error

	UploadFile(ctx *fiber.Ctx) error
}

type Controller struct {
	service services.IService
}

func New(service services.IService) IController {
	return &Controller{
		service: service,
	}
}
