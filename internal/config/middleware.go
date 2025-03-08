package config

import (
	"e-gourmet/core/internal/middleware"
	"e-gourmet/core/pkg/configloader"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"go.uber.org/zap"
	"os"
)

const (
	DefaultConfigMiddlewarePath   = "etc/config/middleware.yml"
	CustomConfigMiddlewarePathEnv = "EG_MIDDLEWARE_CONFIG_PATH"
	EnvPrefixConfigMiddleware     = "EG_MIDDLEWARE"
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

type MiddlewareConfig struct {
	*CorsConfig    `mapstructure:"cors"`
	*StorageConfig `mapstructure:"storage"`
}

type Middlewares struct {
	Configs      *MiddlewareConfig
	Logger       fiber.Handler
	Recover      fiber.Handler
	Cors         fiber.Handler
	Compress     fiber.Handler
	ErrorHandler fiber.ErrorHandler
}

func defaultMiddlewareConfig() *MiddlewareConfig {
	return &MiddlewareConfig{
		CorsConfig: &CorsConfig{
			Enable:       true,
			AllowOrigins: "*",
			AllowMethods: "*",
			AllowHeaders: "*",
		},
		StorageConfig: &StorageConfig{
			ResourcePath: "storage/resources",
			URLPrefix:    "public",
		},
	}
}

func NewMiddlewareSet(logger *zap.Logger) *Middlewares {
	configPath := os.Getenv(CustomConfigMiddlewarePathEnv)
	if configPath == "" {
		configPath = DefaultConfigMiddlewarePath
	}
	config := configloader.LoadConfig[MiddlewareConfig](
		defaultMiddlewareConfig(),
		configPath,
		EnvPrefixConfigMiddleware,
	)

	loggerMdw := middleware.RequestLogger(logger)
	recoverMdw := recover.New()
	corsMdw := cors.New(cors.Config{
		AllowOrigins: config.CorsConfig.AllowOrigins,
		AllowMethods: config.CorsConfig.AllowMethods,
		AllowHeaders: config.CorsConfig.AllowHeaders,
	})
	compressMdw := compress.New(compress.Config{
		Level: compress.LevelBestSpeed,
	})
	errorHandlerMdw := middleware.ErrorHandler(logger)

	return &Middlewares{
		Configs:      config,
		Logger:       loggerMdw,
		Recover:      recoverMdw,
		Cors:         corsMdw,
		Compress:     compressMdw,
		ErrorHandler: errorHandlerMdw,
	}
}
