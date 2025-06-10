package middlewares

import (
	"context"
	"github.com/gofiber/fiber/v2"
	"time"
)

func UseTimeout(duration time.Duration) fiber.Handler {
	return func(c *fiber.Ctx) error {
		ctx, cancel := context.WithTimeout(c.UserContext(), duration)
		defer cancel()
		c.SetUserContext(ctx)
		return c.Next()
	}
}
