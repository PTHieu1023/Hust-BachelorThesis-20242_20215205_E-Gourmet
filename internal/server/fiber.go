package server

import (
	"e-gourmet/core/internal/server/logger"
	"e-gourmet/core/pkg/configloader"
	"errors"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"net/http"
	"os"
	"time"
)

type FiberConfig struct {
	Name          string `mapstructure:"name"`
	Port          int    `mapstructure:"port"`
	Header        string `mapstructure:"header"`
	Prefork       bool   `mapstructure:"prefork"`
	CaseSensitive bool   `mapstructure:"case-sensitive"`
	Immutable     bool   `mapstructure:"immutable"`
}

const (
	DefaultFiberConfigPath = "etc/config/fiber.yml"
	FiberConfigPathEnv     = "EG_FIBER_CONFIG"
	FiberEnvPrefixConfig   = "EG_FIBER"
)

var (
	_port = 8080
	_app  *fiber.App
)

func errorHandler() fiber.ErrorHandler {
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
		logger.Instance().Error("Error Request", fields...)
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

func AppInstance() *fiber.App {
	if _app == nil {
		configPath := os.Getenv(FiberConfigPathEnv)
		if configPath == "" {
			configPath = DefaultFiberConfigPath
		}
		config := configloader.LoadConfig[FiberConfig](configPath, FiberEnvPrefixConfig)
		_port = config.Port
		_app = fiber.New(fiber.Config{
			AppName:       config.Name,
			ServerHeader:  config.Header,
			Prefork:       config.Prefork,
			CaseSensitive: config.CaseSensitive,
			Immutable:     config.Immutable,
			ErrorHandler:  errorHandler(),
		})
	}
	return _app
}
