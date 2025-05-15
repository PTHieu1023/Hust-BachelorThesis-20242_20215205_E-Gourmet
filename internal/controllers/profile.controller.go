package controllers

import (
	"e-gourmet/core/internal/server/logger"
	"e-gourmet/core/pkg/pagination"
	"github.com/gofiber/fiber/v2"
)

func (c *Controller) GetProfiles(ctx *fiber.Ctx) error {
	logger.Instance().Info("GetProfiles")
	pageFilter, err := pagination.GetPageFilter(ctx)
	if err != nil {
		return err
	}
	profiles, err := c.service.GetListProfiles(pageFilter)
	if err != nil {
		return err
	}
	return ctx.JSON(profiles)
}
