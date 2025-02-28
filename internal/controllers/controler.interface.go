package controllers

import "github.com/gofiber/fiber/v2"

type IProfileController interface {
	CreateProfile(ctx *fiber.Ctx) error
	GetProfile(ctx *fiber.Ctx) error
	GetProfiles(ctx *fiber.Ctx) error
	UpdateProfile(ctx *fiber.Ctx) error
	DeleteProfile(ctx *fiber.Ctx) error
}

type IUserController interface {
	CreateUser(ctx *fiber.Ctx) error
	GetUser(ctx *fiber.Ctx) error
	GetUsers(ctx *fiber.Ctx) error
	UpdateUser(ctx *fiber.Ctx) error
	DeleteUser(ctx *fiber.Ctx) error
}

type IRestaurantController interface {
	CreateRestaurant(ctx *fiber.Ctx) error
	GetRestaurant(ctx *fiber.Ctx) error
	GetRestaurants(ctx *fiber.Ctx) error
	UpdateRestaurant(ctx *fiber.Ctx) error
	DeleteRestaurant(ctx *fiber.Ctx) error
}

type IFoodController interface {
	CreateFood(ctx *fiber.Ctx) error
	GetFood(ctx *fiber.Ctx) error
	GetFoods(ctx *fiber.Ctx) error
	UpdateFood(ctx *fiber.Ctx) error
	DeleteFood(ctx *fiber.Ctx) error
}

type IFoodReviewController interface {
	CreateFoodReview(ctx *fiber.Ctx) error
	GetFoodReview(ctx *fiber.Ctx) error
	GetFoodReviews(ctx *fiber.Ctx) error
	UpdateFoodReview(ctx *fiber.Ctx) error
	DeleteFoodReview(ctx *fiber.Ctx) error
}

type ITagController interface {
	CreateTag(ctx *fiber.Ctx) error
	GetTag(ctx *fiber.Ctx) error
	GetTags(ctx *fiber.Ctx) error
	UpdateTag(ctx *fiber.Ctx) error
	DeleteTag(ctx *fiber.Ctx) error
}

type ITagReviewController interface {
	CreateTagReview(ctx *fiber.Ctx) error
	GetTagReview(ctx *fiber.Ctx) error
	GetTagReviews(ctx *fiber.Ctx) error
	UpdateTagReview(ctx *fiber.Ctx) error
	DeleteTagReview(ctx *fiber.Ctx) error
}
