package fiber

import (
	"e-gourmet/core/internal/middlewares/errorhandler"
	"e-gourmet/core/internal/server/constant"
	"e-gourmet/core/internal/server/logger"
	"e-gourmet/core/pkg/configloader"
	"github.com/gofiber/fiber/v2"
	"os"
)

type FiberConfig struct {
	Name          string `mapstructure:"name"`
	Port          int    `mapstructure:"port"`
	Header        string `mapstructure:"header"`
	Prefork       bool   `mapstructure:"prefork"`
	CaseSensitive bool   `mapstructure:"case-sensitive"`
	Immutable     bool   `mapstructure:"immutable"`
}

var _config *FiberConfig

func Config() *FiberConfig {
	if _config == nil {
		_config = configloader.LoadConfig[FiberConfig](
			constant.DefaultConfigFiberPath,
			os.Getenv(constant.CustomConfigFiberPathEnv),
			constant.EnvPrefixConfigFiber)
	}
	return _config
}

func newApp() *fiber.App {
	return fiber.New(fiber.Config{
		AppName:       Config().Name,
		ServerHeader:  Config().Header,
		Prefork:       Config().Prefork,
		CaseSensitive: Config().CaseSensitive,
		Immutable:     Config().Immutable,
		ErrorHandler:  errorhandler.New(logger.Log()),
	})
}

var _app *fiber.App

func App() *fiber.App {
	if _app == nil {
		_app = newApp()
		logger.Log().Info("App initialized")
	}
	return _app
}
