package server

import (
	"e-gourmet/core/internal/controllers"
	"e-gourmet/core/internal/services"
)

func InitHandler() {
	app := AppInstance()
	middlewareSet := InitMiddlewares()

	app.Use(middlewareSet.Timeout)
	app.Use(middlewareSet.Logger)
	app.Use(middlewareSet.Recover)
	app.Use(middlewareSet.Cors)
	app.Use(middlewareSet.Compress)
	app.Use(middlewareSet.Auth)

	dbtx := connectDB()

	handlers := controllers.New(services.New(dbtx))
	routerV1 := app.Group("/api/v1")
	routerV1.Group("/cuisine").
		Get("/", handlers.GetCuisineRecursionById).
		Post("/", handlers.AddCuisine).
		Get("/:id", handlers.GetCuisineRecursionById)

	routerV1.Group("/dish").
		Get("/", handlers.GetDishes).
		Post("/", handlers.CreateDish).
		Group("/:id").
		Get("/", handlers.GetDishById).
		Delete("/", handlers.DeleteDishById)

	routerV1.Group("/review").
		Get("/", handlers.GetReviews).
		Post("/", handlers.CreateReview).
		Group("/:id").
		Delete("/", handlers.DeleteReview)

	routerV1.Group("/user").
		Get("/me", handlers.GetCurrentUser).
		Get("/:username", handlers.GetUserByUsername).
		Put("/", handlers.UpdateCurrentUser)
}
