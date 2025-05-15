package controllers

import (
	"e-gourmet/core/internal/services"
	"github.com/gofiber/fiber/v2"
)

type IController interface {
	GetProfiles(ctx *fiber.Ctx) error
}

type Controller struct {
	service services.IService
}

func New(service services.IService) IController {
	return &Controller{
		service: service,
	}
}
