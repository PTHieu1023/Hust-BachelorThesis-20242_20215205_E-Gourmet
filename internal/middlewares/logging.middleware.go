package middlewares

import (
	"e-gourmet/core/internal/server/logger"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"time"
)

func UseLogging() fiber.Handler {
	return func(c *fiber.Ctx) error {
		c.Locals("startTime", time.Now())

		if err := c.Next(); err != nil {
			return err
		}

		fields := []zap.Field{
			zap.String("method", c.Method()),
			zap.String("ip", c.IP()),
			zap.Int("status", c.Response().StatusCode()),
			zap.String("latency", time.Since(c.Locals("startTime").(time.Time)).String()),
			zap.String("url", c.OriginalURL()),
		}

		logger.Instance().Info("Request", fields...)
		return nil
	}
}
