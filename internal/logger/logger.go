package logger

import (
	"e-gourmet/core/pkg/logger"
	"fmt"
	"go.uber.org/zap"
	"gopkg.in/natefinch/lumberjack.v2"
)

func New(config *Config) *zap.Logger {
	var logg *lumberjack.Logger = nil
	if config.Enable {
		logg = &lumberjack.Logger{
			Filename:   fmt.Sprintf("%s/%s.log", config.DirPath, config.FileName),
			MaxSize:    config.MaxSize,
			MaxAge:     config.MaxAge,
			MaxBackups: config.MaxBackup,
			LocalTime:  config.LocalTime,
			Compress:   config.Compress,
		}
	}
	return logger.NewLogger(config.Level, logg)
}
