package controllers

import (
	"database/sql"
	"e-gourmet/core/internal/database"
	"e-gourmet/core/internal/utils"
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

	return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{"data": restaurant})
}

func (c *Controller) GetRestaurants(ctx *fiber.Ctx) error {
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

func (c *Controller) UpdateRestaurant(ctx *fiber.Ctx) error {
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

	return ctx.JSON(fiber.Map{"data": updatedRestaurant})
}

func (c *Controller) DeleteRestaurantById(ctx *fiber.Ctx) error {
	id, err := ctx.ParamsInt("id")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, errInvalidID)
	}

	if err := c.service.DeleteRestaurantById(ctx.UserContext(), int32(id)); err != nil {
		return err
	}

	return ctx.SendStatus(fiber.StatusNoContent)
}

func (c *Controller) GetCurrentUserRestaurant(ctx *fiber.Ctx) error {
	userId := ctx.UserContext().Value(utils.AuthUserID).(string)
	restaurant, err := c.service.GetRestaurantByOwnerId(ctx.UserContext(), userId)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return fiber.NewError(fiber.StatusNotFound, "Restaurant not found for the current user.")
		}
		return err
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"data": restaurant})
}

func (c *Controller) GetRestaurantByUsername(ctx *fiber.Ctx) error {
	username := ctx.Params("username")
	if username == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Username is required.")
	}

	restaurant, err := c.service.GetRestaurantByUsername(ctx.UserContext(), username)
	if errors.Is(err, sql.ErrNoRows) {
		return fiber.NewError(fiber.StatusNotFound, errResourceNotFound)
	}

	if err != nil {
		return err
	}

	return ctx.JSON(fiber.Map{"data": restaurant})
}

func (c *Controller) GetRestaurantProfile(ctx *fiber.Ctx) error {
	id, err := ctx.ParamsInt("id")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, errInvalidID)
	}

	profile, err := c.service.GetRestaurantProfile(ctx.UserContext(), int32(id))
	if errors.Is(err, sql.ErrNoRows) {
		return fiber.NewError(fiber.StatusNotFound, errResourceNotFound)
	}

	if err != nil {
		return err
	}

	return ctx.JSON(fiber.Map{"data": profile})
}

func (c *Controller) GetRestaurantHighlights(ctx *fiber.Ctx) error {
	id, err := ctx.ParamsInt("id")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, errInvalidID)
	}

	highlights, err := c.service.GetRestaurantHighlights(ctx.UserContext(), int32(id))
	if err != nil {
		return err
	}

	return ctx.JSON(fiber.Map{"data": highlights})
}

func (c *Controller) GetRestaurantRecentReviews(ctx *fiber.Ctx) error {
	id, err := ctx.ParamsInt("id")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, errInvalidID)
	}

	reviews, err := c.service.GetRestaurantRecentReviews(ctx.UserContext(), int32(id))
	if err != nil {
		return err
	}

	return ctx.JSON(fiber.Map{"data": reviews})
}
