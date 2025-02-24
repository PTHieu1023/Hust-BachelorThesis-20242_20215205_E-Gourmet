package middleware

import (
	"e-gourmet/core/internal/middlewares/cors"
	"e-gourmet/core/internal/middlewares/storage"
	"e-gourmet/core/internal/server/constant"
	"e-gourmet/core/pkg/configloader"
	"os"
)

type MiddlewareConfig struct {
	Cors    cors.CorsConfig       `mapstructure:"cors"`
	Storage storage.StorageConfig `mapstructure:"storage"`
}

var _middlewareConfig *MiddlewareConfig

func Config() *MiddlewareConfig {
	if _middlewareConfig == nil {
		_middlewareConfig = configloader.LoadConfig[MiddlewareConfig](
			constant.DefaultConfigMiddlewarePath,
			os.Getenv(constant.CustomConfigMiddlewarePathEnv),
			constant.EnvPrefixConfigMiddleware,
		)
	}
	return _middlewareConfig
}
