package logger

import (
	"e-gourmet/core/pkg/configloader"
	"e-gourmet/core/pkg/logger"
	"fmt"
	"go.uber.org/zap"
	"gopkg.in/natefinch/lumberjack.v2"
	"os"
)

type TLoggerConfig struct {
	Enable    bool   `mapstructure:"enable"`
	Level     string `mapstructure:"level"`
	FileName  string `mapstructure:"filename"`
	DirPath   string `mapstructure:"dir-path"`
	MaxSize   int    `mapstructure:"max-size"`
	MaxBackup int    `mapstructure:"max-backup"`
	MaxAge    int    `mapstructure:"max-age"`
	LocalTime bool   `mapstructure:"local-time"`
	Compress  bool   `mapstructure:"compress"`
}

var _loggerConfig *TLoggerConfig

func Config() *TLoggerConfig {
	if _loggerConfig == nil {
		_loggerConfig = configloader.LoadConfig[TLoggerConfig](
			"etc/config/logger.yml",
			os.Getenv("LOGGER_CONFIG_FILE"),
			"EG_LOGGER")
	}
	return _loggerConfig
}

func newLogger() *zap.Logger {
	if Config().Enable {
		return logger.NewLogger(
			Config().Level,
			&lumberjack.Logger{
				Filename:   fmt.Sprintf("%s/%s-%d.log", Config().DirPath, Config().FileName, os.Getpid()),
				MaxSize:    Config().MaxSize,
				MaxAge:     Config().MaxAge,
				MaxBackups: Config().MaxBackup,
				LocalTime:  Config().LocalTime,
				Compress:   Config().Compress,
			},
		)
	}
	return logger.NewLogger(Config().Level, nil)
}

var _logger *zap.Logger

func Logger() *zap.Logger {
	if _logger == nil {
		_logger = newLogger()
		Logger().Info("Initiated logger")
	}
	return _logger
}
