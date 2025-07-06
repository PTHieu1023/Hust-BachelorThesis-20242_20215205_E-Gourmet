package controllers

import (
	"e-gourmet/core/internal/database"
	"e-gourmet/core/pkg/pagination"
	"github.com/gofiber/fiber/v2"
)

func (c *EGControllerImpl) CreateRestaurant(ctx *fiber.Ctx) error {
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

func (c *EGControllerImpl) GetRestaurants(ctx *fiber.Ctx) error {
	params := new(database.GetRestaurantsParams)
	if err := ctx.QueryParser(params); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}
	pageFilter, err := pagination.GetPageFilter(ctx)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid pagination parameters")
	}
	params.Limit = int32(pageFilter.Size)
	params.Offset = int32((pageFilter.Page - 1) * pageFilter.Size)

	restaurants, err := c.service.GetRestaurants(ctx.UserContext(), params)
	if err != nil {
		return err
	}

	return ctx.JSON(restaurants)
}

func (c *EGControllerImpl) UpdateRestaurant(ctx *fiber.Ctx) error {
	id, err := ctx.ParamsInt("id")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, errInvalidID)
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

func (c *EGControllerImpl) DeleteRestaurantById(ctx *fiber.Ctx) error {
	id, err := ctx.ParamsInt("id")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, errInvalidID)
	}

	if err := c.service.DeleteRestaurantById(ctx.UserContext(), int32(id)); err != nil {
		return err
	}

	return ctx.SendStatus(fiber.StatusNoContent)
}

func (c *EGControllerImpl) GetRestaurantById(ctx *fiber.Ctx) error {
	//TODO implement me
	panic("implement me")
}

func (c *EGControllerImpl) FollowRestaurant(ctx *fiber.Ctx) error {
	//TODO implement me
	panic("implement me")
}

func (c *EGControllerImpl) UnfollowRestaurant(ctx *fiber.Ctx) error {
	//TODO implement me
	panic("implement me")
}
