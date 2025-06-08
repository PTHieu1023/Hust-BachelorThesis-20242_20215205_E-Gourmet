package server

import (
	"e-gourmet/core/internal/controllers"
	"e-gourmet/core/internal/services"
)

func InitHandler() {
	app := AppInstance()
	middlewares := InitMiddlewares()

	app.Use(middlewares.Logger)
	app.Use(middlewares.Recover)
	app.Use(middlewares.Cors)
	app.Use(middlewares.Compress)
	app.Use(middlewares.Auth)

	dbtx := connectDB()

	handlers := controllers.New(services.New(dbtx))

	app.Group("/api/v1/cuisine/").
		Get("/", handlers.GetCuisineRecursionById).
		Post("/", handlers.AddCuisine).
		Get("/:id", handlers.GetCuisineRecursionById)

	app.Group("/api/v1/dish").
		Get("/", handlers.GetDishes).
		Post("/", handlers.CreateDish).
		Get("/:id", handlers.GetDishById).
		Delete("/:id", handlers.DeleteDishById)
}
