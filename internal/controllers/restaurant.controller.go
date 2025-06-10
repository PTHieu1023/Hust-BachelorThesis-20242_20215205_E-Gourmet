package controllers

import (
	"database/sql"
	"e-gourmet/core/internal/database"
	"e-gourmet/core/pkg/pagination"
	"errors"
	"github.com/gofiber/fiber/v2"
)

func (c *Controller) CreateRestaurant(ctx *fiber.Ctx) error {
	params := new(database.CreateRestaurantParams)

	if err := ctx.BodyParser(params); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid request body.")
	}

	if params.Username == "" || params.Name == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Username and Name are required fields.")
	}

	ownerId := ctx.Locals("userID").(string)
	if ownerId == "" {
		return fiber.NewError(fiber.StatusUnauthorized, "Unauthorized: No user ID found in context")
	}

	restaurant, err := c.service.CreateRestaurant(ctx.UserContext(), params)
	if err != nil {
		return err
	}

	return ctx.Status(fiber.StatusCreated).JSON(restaurant)
}

func (c *Controller) GetRestaurantById(ctx *fiber.Ctx) error {
	id, err := ctx.ParamsInt("id")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid restaurant ID.")
	}

	restaurant, err := c.service.GetRestaurantById(ctx.UserContext(), int32(id))

	if errors.Is(err, sql.ErrNoRows) {
		return fiber.NewError(fiber.StatusNotFound, "Restaurant not found.")
	}

	if err != nil {
		return err
	}

	return ctx.JSON(restaurant)
}

func (c *Controller) GetRestaurants(ctx *fiber.Ctx) error {
	pageFilter, err := pagination.GetPageFilter(ctx)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid pagination parameters.")
	}

	params := &database.GetRestaurantsParams{
		Offset: int32((pageFilter.Page - 1) * pageFilter.Size),
		Limit:  int32(pageFilter.Size),
	}

	restaurants, err := c.service.GetRestaurants(ctx.UserContext(), params)
	if err != nil {
		return err
	}

	return ctx.JSON(restaurants)
}

func (c *Controller) UpdateRestaurant(ctx *fiber.Ctx) error {
	id, err := ctx.ParamsInt("id")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid restaurant ID.")
	}

	params := new(database.UpdateRestaurantParams)
	if err := ctx.BodyParser(params); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid request body.")
	}

	params.RestaurantID = int32(id)

	updatedRestaurant, err := c.service.UpdateRestaurant(ctx.UserContext(), params)
	if err != nil {
		return err
	}

	return ctx.JSON(updatedRestaurant)
}

func (c *Controller) DeleteRestaurantById(ctx *fiber.Ctx) error {
	id, err := ctx.ParamsInt("id")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid restaurant ID.")
	}

	if err := c.service.DeleteRestaurantById(ctx.UserContext(), int32(id)); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return fiber.NewError(fiber.StatusNotFound, "Restaurant not found.")
		}
		return err
	}

	return ctx.SendStatus(fiber.StatusNoContent)
}
