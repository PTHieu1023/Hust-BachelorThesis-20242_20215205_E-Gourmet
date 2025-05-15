package logger

import (
	"e-gourmet/core/pkg/configloader"
	"e-gourmet/core/pkg/logger"
	"go.uber.org/zap"
	"os"
)

var _logger *zap.Logger

const (
	DefaultLoggingConfigPath = "etc/config/logging.yml"
	LoggingConfigPathEnv     = "EG_LOGGING_CONFIG"
	LoggingEnvPrefixConfig   = "EG_LOGGING"
)

func Instance() *zap.Logger {
	if _logger == nil {
		configPath := os.Getenv(LoggingConfigPathEnv)
		if configPath == "" {
			configPath = DefaultLoggingConfigPath
		}
		config := configloader.LoadConfig[logger.Config](configPath, LoggingEnvPrefixConfig)
		_logger = logger.New(config)
	}
	return _logger
}
