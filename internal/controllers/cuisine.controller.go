package controllers

import (
	"e-gourmet/core/internal/database"
	"github.com/gofiber/fiber/v2"
	"strconv"
)

func (c *Controller) GetCuisineRecursionById(ctx *fiber.Ctx) error {
	idStr := ctx.Params("id", "0")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid cuisine ID",
		})
	}

	cuisine, err := c.service.GetCuisineRecursionById(int16(id))
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to retrieve cuisine",
		})
	}
	return ctx.Status(fiber.StatusOK).JSON(cuisine)
}

func (c *Controller) AddCuisine(ctx *fiber.Ctx) error {
	params := new(database.AddCuisineParams)

	if err := ctx.BodyParser(&params); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	cuisine, err := c.service.AddCuisine(params)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to add cuisine",
		})
	}
	return ctx.Status(fiber.StatusCreated).JSON(cuisine)
}
