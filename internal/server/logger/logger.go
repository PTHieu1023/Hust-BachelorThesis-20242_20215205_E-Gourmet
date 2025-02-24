package logger

import (
	"e-gourmet/core/internal/server/constant"
	"e-gourmet/core/pkg/configloader"
	"e-gourmet/core/pkg/logger"
	"fmt"
	"go.uber.org/zap"
	"gopkg.in/natefinch/lumberjack.v2"
	"os"
)

type LoggerConfig struct {
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

var _loggerConfig *LoggerConfig

func Config() *LoggerConfig {
	if _loggerConfig == nil {
		_loggerConfig = configloader.LoadConfig[LoggerConfig](
			constant.DefaultConfigLoggerPath,
			os.Getenv(constant.CustomConfigLoggerPathEnv),
			constant.EnvPrefixConfigLogger)
	}
	return _loggerConfig
}

func newLogger() *zap.Logger {
	var logg *lumberjack.Logger = nil
	if Config().Enable {
		logg = &lumberjack.Logger{
			Filename:   fmt.Sprintf("%s/%s-%d.log", Config().DirPath, Config().FileName, os.Getpid()),
			MaxSize:    Config().MaxSize,
			MaxAge:     Config().MaxAge,
			MaxBackups: Config().MaxBackup,
			LocalTime:  Config().LocalTime,
			Compress:   Config().Compress,
		}
	}
	return logger.NewLogger(Config().Level, logg)
}

var _logger *zap.Logger

func Log() *zap.Logger {
	if _logger == nil {
		_logger = newLogger()
		Log().Info("Initiated logger")
	}
	return _logger
}
