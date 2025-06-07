package controllers

import (
	"e-gourmet/core/internal/database"
	"github.com/gofiber/fiber/v2"
	"strconv"
	"strings"
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
	params := &database.AddCuisineParams{
		Name:     "",
		ParentID: &[]int16{0}[0],
		ImageUrl: nil,
	}

	if err := ctx.BodyParser(&params); err != nil {
		return fiber.NewError(
			fiber.StatusBadRequest,
			"Invalid request body. Valid fields: name(string), parentId(int), imageUrl(string)")
	}

	params.Name = strings.TrimSpace(params.Name)
	if params.Name == "" {
		return fiber.NewError(
			fiber.StatusBadRequest,
			"Cuisine name is required")
	}

	cuisine, err := c.service.AddCuisine(params)

	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	return ctx.Status(fiber.StatusCreated).JSON(cuisine)
}
