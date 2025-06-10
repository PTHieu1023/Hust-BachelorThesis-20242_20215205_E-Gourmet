package server

import (
	"e-gourmet/core/internal/middlewares"
	"e-gourmet/core/pkg/configloader"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"os"
	"time"
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
	Cors    CorsConfig    `mapstructure:"cors"`
	Storage StorageConfig `mapstructure:"storage"`
}

type Middlewares struct {
	Logger   fiber.Handler
	Recover  fiber.Handler
	Cors     fiber.Handler
	Compress fiber.Handler
	Auth     fiber.Handler
	Timeout  fiber.Handler
}

const (
	DefaultConfigPath = "etc/config/middleware.yml"
	ConfigPathEnv     = "EG_MIDDLEWARE_CONFIG"
	EnvPrefixConfig   = "EG_MIDDLEWARE"
)

func InitMiddlewares() *Middlewares {
	configPath := os.Getenv(ConfigPathEnv)
	if configPath == "" {
		configPath = DefaultConfigPath
	}
	config := configloader.LoadConfig[Config](configPath, EnvPrefixConfig)

	return &Middlewares{
		Recover: recover.New(),
		Cors: cors.New(cors.Config{
			AllowOrigins: config.Cors.AllowOrigins,
			AllowMethods: config.Cors.AllowMethods,
			AllowHeaders: config.Cors.AllowHeaders,
		}),
		Compress: compress.New(compress.Config{
			Level: compress.LevelBestSpeed,
		}),
		Auth:    middlewares.UseAuth(),
		Logger:  middlewares.UseLogging(),
		Timeout: middlewares.UseTimeout(1 * time.Minute),
	}
}
