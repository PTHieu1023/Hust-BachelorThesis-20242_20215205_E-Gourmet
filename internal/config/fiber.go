package config

import (
	"e-gourmet/core/pkg/configloader"
	"github.com/gofiber/fiber/v2"
	"os"
)

const (
	DefaultConfigFiberPath   = "etc/config/fiber.yml"
	CustomConfigFiberPathEnv = "EG_FIBER_CONFIG_PATH"
	EnvPrefixConfigFiber     = "EG_FIBER"
)

type AppConfig struct {
	Name          string `mapstructure:"name"`
	Port          int    `mapstructure:"port"`
	Header        string `mapstructure:"header"`
	Prefork       bool   `mapstructure:"prefork"`
	CaseSensitive bool   `mapstructure:"case-sensitive"`
	Immutable     bool   `mapstructure:"immutable"`
}

type FiberApp struct {
	Config *AppConfig
	*fiber.App
}

func defaultAppConfig() *AppConfig {
	return &AppConfig{
		Name:          "Fiber",
		Port:          8080,
		Header:        "go-fiber",
		Prefork:       false,
		CaseSensitive: false,
		Immutable:     false,
	}
}

func NewFiberApp(errorhandler fiber.ErrorHandler) *FiberApp {
	app := &FiberApp{}
	app.loadConfig()
	app.App = fiber.New(fiber.Config{
		AppName:       app.Config.Name,
		ServerHeader:  app.Config.Header,
		Prefork:       app.Config.Prefork,
		CaseSensitive: app.Config.CaseSensitive,
		Immutable:     app.Config.Immutable,
		ErrorHandler:  errorhandler,
	})
	return app
}

func (a *FiberApp) loadConfig() *FiberApp {
	configPath := os.Getenv(CustomConfigFiberPathEnv)
	if configPath == "" {
		configPath = DefaultConfigFiberPath
	}
	a.Config = configloader.LoadConfig[AppConfig](
		defaultAppConfig(),
		configPath,
		EnvPrefixConfigFiber)
	return a
}
