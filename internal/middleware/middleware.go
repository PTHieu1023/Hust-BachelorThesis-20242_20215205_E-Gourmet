package middleware

import (
	"e-gourmet/core/pkg/keycloak"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"go.uber.org/zap"
)

type CorsConfig struct {
	Enable       bool   `mapstructure:"enable"`
	AllowOrigins string `mapstructure:"allow-origins"`
	AllowMethods string `mapstructure:"allow-methods"`
	AllowHeaders string `mapstructure:"allow-headers"`
}

type StorageConfig struct {
	ResourcePath string `mapstructure:"resource-path"`
	URLPrefix    string `mapstructure:"url-prefix"`
}

type Config struct {
	Cors    *CorsConfig    `mapstructure:"cors"`
	Storage *StorageConfig `mapstructure:"storage"`
}

type Middlewares struct {
	Logger   fiber.Handler
	Recover  fiber.Handler
	Cors     fiber.Handler
	Compress fiber.Handler
	Auth     fiber.Handler
}

func DefaultConfig() *Config {
	return &Config{
		Cors: &CorsConfig{
			Enable:       true,
			AllowOrigins: "*",
			AllowMethods: "*",
			AllowHeaders: "*",
		},
		Storage: &StorageConfig{
			ResourcePath: "storage/resources",
			URLPrefix:    "public",
		},
	}
}

func New(config *Config, client keycloak.IKeycloak, logger *zap.Logger) *Middlewares {
	return &Middlewares{
		Logger:  RequestLogger(logger),
		Recover: recover.New(),
		Cors: cors.New(cors.Config{
			AllowOrigins: config.Cors.AllowOrigins,
			AllowMethods: config.Cors.AllowMethods,
			AllowHeaders: config.Cors.AllowHeaders,
		}),
		Compress: compress.New(compress.Config{
			Level: compress.LevelBestSpeed,
		}),
		Auth: AuthMiddleware(client, logger),
	}
}
