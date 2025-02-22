package fiber

import (
	"e-gourmet/core/internal/middlewares/errorhandler"
	"e-gourmet/core/internal/server/logger"
	"e-gourmet/core/pkg/configloader"
	"github.com/gofiber/fiber/v2"
	"os"
)

type TFiberConfig struct {
	Name          string `mapstructure:"name"`
	Port          int    `mapstructure:"port"`
	Header        string `mapstructure:"header"`
	Prefork       bool   `mapstructure:"prefork"`
	CaseSensitive bool   `mapstructure:"case-sensitive"`
	Immutable     bool   `mapstructure:"immutable"`
}

var _config *TFiberConfig

func AppConfig() *TFiberConfig {
	if _config == nil {
		_config = configloader.LoadConfig[TFiberConfig](
			"etc/config/fiber.yml",
			os.Getenv("FIBER_CONFIG_PATH"),
			"EG")
	}
	return _config
}

func newApp() *fiber.App {
	return fiber.New(fiber.Config{
		AppName:       AppConfig().Name,
		ServerHeader:  AppConfig().Header,
		Prefork:       AppConfig().Prefork,
		CaseSensitive: AppConfig().CaseSensitive,
		Immutable:     AppConfig().Immutable,
		ErrorHandler:  errorhandler.New(logger.Logger()),
	})
}

var _app *fiber.App

func App() *fiber.App {
	if _app == nil {
		_app = newApp()
		logger.Logger().Info("App initialized")
	}
	return _app
}
