package config

import (
	"e-gourmet/core/pkg/configloader"
	"e-gourmet/core/pkg/logger"
	"fmt"
	"go.uber.org/zap"
	"gopkg.in/natefinch/lumberjack.v2"
	"os"
)

const (
	DefaultConfigLoggerPath   = "etc/config/logger.yml"
	CustomConfigLoggerPathEnv = "EG_LOGGER_CONFIG_PATH"
	EnvPrefixConfigLogger     = "EG_LOGGER"
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

func defaultLoggerConfig() *LoggerConfig {
	return &LoggerConfig{
		Enable:    false,
		Level:     "DEBUG",
		FileName:  "",
		DirPath:   "logs",
		MaxSize:   0,
		MaxBackup: 0,
		MaxAge:    0,
		LocalTime: false,
		Compress:  false,
	}
}

func NewLogger() *zap.Logger {
	configPath := os.Getenv(CustomConfigLoggerPathEnv)
	if configPath == "" {
		configPath = DefaultConfigLoggerPath
	}
	config := configloader.LoadConfig[LoggerConfig](
		defaultLoggerConfig(),
		configPath,
		EnvPrefixConfigLogger)

	var logg *lumberjack.Logger = nil
	if config.Enable {
		logg = &lumberjack.Logger{
			Filename:   fmt.Sprintf("%s/%s-%d.log", config.DirPath, config.FileName, os.Getpid()),
			MaxSize:    config.MaxSize,
			MaxAge:     config.MaxAge,
			MaxBackups: config.MaxBackup,
			LocalTime:  config.LocalTime,
			Compress:   config.Compress,
		}
	}
	return logger.NewLogger(config.Level, logg)
}
