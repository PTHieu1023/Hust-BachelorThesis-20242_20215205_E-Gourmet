package app

import (
	"errors"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"net/http"
	"time"
)

func ErrorHandler(logger *zap.Logger) fiber.ErrorHandler {
	return func(c *fiber.Ctx, err error) error {
		code := fiber.StatusInternalServerError
		var e *fiber.Error
		if errors.As(err, &e) {
			code = e.Code
		}
		c.Status(code)

		fields := []zap.Field{
			zap.String("method", c.Method()),
			zap.String("ip", c.IP()),
			zap.Int("status", c.Response().StatusCode()),
			zap.String("latency", time.Since(c.Locals("startTime").(time.Time)).String()),
			zap.String("url", c.OriginalURL()),
			zap.String("error", err.Error()),
		}
		logger.Error("Error Request", fields...)
		json := fiber.Map{
			"time":    time.Now(),
			"status":  code,
			"message": http.StatusText(code),
		}
		if code != fiber.StatusInternalServerError {
			json["error"] = err.Error()
		}
		return c.JSON(json)
	}
}
