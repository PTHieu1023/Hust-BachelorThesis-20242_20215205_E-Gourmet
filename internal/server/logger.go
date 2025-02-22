package server

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

func LoggerConfig() *TLoggerConfig {
	if _loggerConfig == nil {
		_loggerConfig = configloader.LoadConfig[TLoggerConfig](
			"etc/logger.yml",
			os.Getenv("LOGGER_CONFIG_FILE"),
			"EG")
	}
	return _loggerConfig
}

func logFilePath() string {
	if AppConfig().Prefork {
		return fmt.Sprintf("%s/%d/%s.log", LoggerConfig().DirPath, os.Getpid(), LoggerConfig().FileName)
	}
	return fmt.Sprintf("%s/%s.log", LoggerConfig().DirPath, LoggerConfig().FileName)
}

func newLogger(conf *TLoggerConfig, isForked bool) *zap.Logger {
	return logger.NewLogger(
		LoggerConfig().Level,
		&lumberjack.Logger{
			Filename:   logFilePath(),
			MaxSize:    conf.MaxSize,
			MaxAge:     conf.MaxAge,
			MaxBackups: conf.MaxBackup,
			LocalTime:  conf.LocalTime,
			Compress:   conf.Compress,
		},
	)
}

var _logger *zap.Logger

func Logger() *zap.Logger {
	if _logger == nil {
		_logger = newLogger(LoggerConfig(), AppConfig().Prefork)
		Logger().Info("Initiated logger")
	}
	return _logger
}
