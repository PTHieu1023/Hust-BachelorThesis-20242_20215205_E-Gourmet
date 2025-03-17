package app

import (
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

func NewFiberApp(config *Config, logger *zap.Logger) *fiber.App {
	return fiber.New(fiber.Config{
		AppName:       config.Name,
		ServerHeader:  config.Header,
		Prefork:       config.Prefork,
		CaseSensitive: config.CaseSensitive,
		Immutable:     config.Immutable,
		ErrorHandler:  ErrorHandler(logger),
	})
}
