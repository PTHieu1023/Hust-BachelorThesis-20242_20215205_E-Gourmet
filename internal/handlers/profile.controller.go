package handlers

import (
	"e-gourmet/core/internal/services"
	"github.com/gofiber/fiber/v2"
)

func GetProfileList(ctx *fiber.Ctx) error {
	profiles, err := services.GetProfileList()
	if err != nil {
		return err
	}
	return ctx.JSON(profiles)
}
