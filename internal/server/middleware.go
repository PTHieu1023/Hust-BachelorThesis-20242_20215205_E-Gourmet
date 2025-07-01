package server

import (
	"e-gourmet/core/internal/middlewares"
	"github.com/Nerzal/gocloak/v13"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"os"
	"time"
)

type Middlewares struct {
	Logger   fiber.Handler
	Recover  fiber.Handler
	Cors     fiber.Handler
	Compress fiber.Handler
	Auth     fiber.Handler
	Timeout  fiber.Handler
}

func InitMiddlewares(kc *gocloak.GoCloak) *Middlewares {
	return &Middlewares{
		Recover: recover.New(),
		Cors: cors.New(cors.Config{
			AllowOrigins: os.Getenv("EG_CORS_ALLOW_ORIGINS"),
			AllowMethods: os.Getenv("EG_CORS_ALLOW_METHODS"),
			AllowHeaders: os.Getenv("EG_CORS_ALLOW_HEADERS"),
		}),
		Compress: compress.New(compress.Config{
			Level: compress.LevelBestSpeed,
		}),
		Auth:    middlewares.UseAuth(kc),
		Logger:  middlewares.UseLogging(),
		Timeout: middlewares.UseTimeout(1 * time.Minute),
	}
}
