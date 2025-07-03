package controllers

import (
	"github.com/gofiber/fiber/v2"
)

func (c *Controller) GetRecommendations(ctx *fiber.Ctx) error {
	// TODO: check in database, get distince newest recommend item for user, if created_at over 1 day, call api into recommend system to regenerate new recommend items
	return ctx.Status(fiber.StatusOK).JSON("ok")
}
