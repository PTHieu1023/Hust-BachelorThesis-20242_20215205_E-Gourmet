package controllers

import (
	"e-gourmet/core/internal/database"
	"e-gourmet/core/internal/services"
	"e-gourmet/core/internal/utils"
	"github.com/gofiber/fiber/v2"
	"strconv"
	"strings"
)

func (c *Controller) GetCuisines(ctx *fiber.Ctx) error {
	idStr := ctx.Params("id", "0")
	displayMode := ctx.Query("tree", "0")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid cuisine ID",
		})
	}

	cuisines, err := c.service.GetCuisineRecursionById(ctx.UserContext(), int16(id))
	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Cuisine not found",
			})
		}
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to retrieve cuisine",
		})
	}
	if displayMode == "0" || displayMode == "" {
		return ctx.Status(fiber.StatusOK).JSON(cuisines)
	}

	tree := make(map[int16]*services.Cuisine)
	for _, row := range cuisines {
		tree[row.ID] = services.NewCuisine(row.ID, row.Name, row.ParentID, row.ImageUrl)
	}
	for _, cuisine := range tree {
		if cuisine.ParentId == nil {
			continue
		}
		parent, exists := tree[*cuisine.ParentId]
		if !exists {
			continue
		}
		if parent.Children == nil {
			parent.Children = make(map[int16]*services.Cuisine)
		}
		parent.Children[cuisine.ID] = cuisine
	}

	return ctx.Status(fiber.StatusOK).JSON(tree[int16(id)])
}

func (c *Controller) AddCuisine(ctx *fiber.Ctx) error {
	isAdmin := ctx.UserContext().Value(utils.AuthIsAdmin).(bool)
	if !isAdmin {
		return fiber.NewError(fiber.StatusForbidden, errAdminOnly)
	}

	params := new(database.AddCuisineParams)
	params.Name = strings.TrimSpace(params.Name)
	if params.Name == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Cuisine name cannot be empty.")
	}

	if err := ctx.BodyParser(&params); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid request body.")
	}

	cuisine, err := c.service.AddCuisine(ctx.UserContext(), params)

	if err != nil {
		return err
	}

	return ctx.Status(fiber.StatusCreated).JSON(cuisine)
}

func (c *Controller) UpdateCuisine(ctx *fiber.Ctx) error {
	isAdmin := ctx.UserContext().Value(utils.AuthIsAdmin).(bool)
	if !isAdmin {
		return fiber.NewError(fiber.StatusForbidden, errAdminOnly)
	}

	params := new(database.UpdateCuisineParams)

	if err := ctx.BodyParser(&params); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid request body.")
	}
	params.Name = strings.TrimSpace(params.Name)
	if params.Name == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Cuisine name cannot be empty.")
	}

	cuisine, err := c.service.UpdateCuisine(ctx.UserContext(), params)
	if err != nil {
		return err
	}
	return ctx.Status(fiber.StatusOK).JSON(cuisine)
}

func (c *Controller) DeleteCuisine(ctx *fiber.Ctx) error {
	idStr := ctx.Params("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid cuisine ID.")
	}
	err = c.service.DeleteCuisine(ctx.UserContext(), int16(id))
	if err != nil {
		return err
	}
	return ctx.SendStatus(fiber.StatusNoContent)
}
