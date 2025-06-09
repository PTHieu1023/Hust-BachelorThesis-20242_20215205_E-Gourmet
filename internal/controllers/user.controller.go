package controllers

import (
	"database/sql"
	"e-gourmet/core/internal/database"
	"errors"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func (c *Controller) GetCurrentUser(ctx *fiber.Ctx) error {
	id := ctx.Locals("userID").(string)
	if id == "" {
		return fiber.NewError(fiber.StatusUnauthorized, "Unauthorized: No user ID found in context")
	}

	user, err := c.service.GetUserById(id)
	if err == nil {
		return ctx.Status(fiber.StatusOK).JSON(user)
	}

	if !errors.As(err, &fiber.ErrNotFound) {
		return err
	}

	params := new(database.CreateUserParams)
	claims := ctx.Locals("claims").(*jwt.MapClaims)
	username := (*claims)["preferred_username"].(string)
	email := (*claims)["email"].(string)
	name := (*claims)["name"].(string)

	params.ID = &id
	params.Username = &username
	params.Email = &email
	params.DisplayName = &name
	newUser, err := c.service.CreateUser(params)

	if err != nil {
		return err
	}
	return ctx.Status(fiber.StatusCreated).JSON(newUser)
}

func (c *Controller) GetUserByUsername(ctx *fiber.Ctx) error {
	username := ctx.Params("username")
	if username == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Username is required")
	}

	user, err := c.service.GetUserByUsername(username)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return fiber.NewError(fiber.StatusNotFound, "User not found")
		}
		return err
	}

	return ctx.Status(fiber.StatusOK).JSON(user)
}

func (c *Controller) UpdateCurrentUser(ctx *fiber.Ctx) error {
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

	updatedUser, err := c.service.UpdateUser(params)
	if err != nil {
		return err
	}

	return ctx.Status(fiber.StatusOK).JSON(updatedUser)
}
