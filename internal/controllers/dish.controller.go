package controllers

import (
	"e-gourmet/core/internal/database"
	"e-gourmet/core/pkg/pagination"
	"github.com/gofiber/fiber/v2"
	"strconv"
)

func (c *Controller) CreateDish(ctx *fiber.Ctx) error {
	params := new(database.CreateDishParams)

	if err := ctx.BodyParser(&params); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid request body.")
	}

	dish, err := c.service.CreateDish(ctx.UserContext(), params)
	if err != nil {
		return err
	}

	return ctx.Status(fiber.StatusCreated).JSON(dish)
}

func (c *Controller) GetDishById(ctx *fiber.Ctx) error {
	idStr := ctx.Params("id", "0")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid dish ID",
		})
	}
	dish, err := c.service.GetDishById(ctx.UserContext(), int32(id))
	if err != nil {
		return err
	}
	return ctx.Status(fiber.StatusOK).JSON(dish)
}

func (c *Controller) DeleteDishById(ctx *fiber.Ctx) error {
	idStr := ctx.Params("id", "0")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid dish ID",
		})
	}

	err = c.service.DeleteDishById(ctx.UserContext(), int32(id))
	if err != nil {
		return err
	}
	return ctx.SendStatus(fiber.StatusNoContent)
}

func (c *Controller) GetDishes(ctx *fiber.Ctx) error {
	pageFilter, err := pagination.GetPageFilter(ctx)
	if err != nil {
		return err
	}
	params := new(database.GetDishesParams)
	params.Offset = int32((pageFilter.Page - 1) * pageFilter.Size)
	params.Limit = int32(pageFilter.Size)

	if err := ctx.QueryParser(params); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid query parameters.")
	}

	dishes, err := c.service.GetDishes(ctx.UserContext(), params)

	if err != nil {
		return err
	}

	return ctx.Status(fiber.StatusOK).JSON(dishes)
}
