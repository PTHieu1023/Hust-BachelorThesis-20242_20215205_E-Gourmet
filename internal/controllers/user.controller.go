package controllers

import (
	"database/sql"
	"e-gourmet/core/internal/database"
	"e-gourmet/core/internal/utils"
	"errors"
	"github.com/gofiber/fiber/v2"
)

func (c *EGControllerImpl) GetCurrentUser(ctx *fiber.Ctx) error {
	id := ctx.UserContext().Value(utils.AuthUserID).(string)
	if id == "" {
		return fiber.NewError(fiber.StatusUnauthorized, "Unauthorized: No user ID found in context")
	}

	user, err := c.service.GetUserById(ctx.UserContext(), id)
	if err != nil {
		return err
	}

	return ctx.Status(fiber.StatusOK).JSON(user)
}

func (c *EGControllerImpl) GetUserByUsername(ctx *fiber.Ctx) error {
	username := ctx.Params("username")
	if username == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Username is required")
	}

	user, err := c.service.GetUserByUsername(ctx.UserContext(), username)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return fiber.NewError(fiber.StatusNotFound, "User not found")
		}
		return err
	}

	return ctx.Status(fiber.StatusOK).JSON(user)
}

func (c *EGControllerImpl) UpdateCurrentUser(ctx *fiber.Ctx) error {
	params := new(database.UpdateUserParams)

	if err := ctx.BodyParser(&params); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}

	if params.ID != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Cannot contain id in request body")
	}

	userId := ctx.Locals("userID").(string)
	if userId == "" {
		return fiber.NewError(fiber.StatusUnauthorized, "Unauthorized: No user ID found in context")
	}
	params.ID = &userId

	updatedUser, err := c.service.UpdateUser(ctx.UserContext(), params)
	if err != nil {
		return err
	}

	return ctx.Status(fiber.StatusOK).JSON(updatedUser)
}
