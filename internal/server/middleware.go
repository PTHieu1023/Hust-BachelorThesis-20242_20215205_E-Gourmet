package server

import (
	"e-gourmet/core/internal/middlewares/cors"
	"e-gourmet/core/internal/middlewares/storage"
	"e-gourmet/core/pkg/configloader"
	"os"
)

type TMiddlewareConfig struct {
	Cors    cors.TCorsConfig       `mapstructure:"cors"`
	Storage storage.TStorageConfig `mapstructure:"storage"`
}

var _middlewareConfig *TMiddlewareConfig

func MiddlewareConfig() *TMiddlewareConfig {
	if _middlewareConfig == nil {
		_middlewareConfig = configloader.LoadConfig[TMiddlewareConfig](
			"etc/middleware.yml",
			os.Getenv("MIDDLEWARE_CONFIG_PATH"),
			"EG_MIDDLEWARE",
		)
	}
	return _middlewareConfig
}
