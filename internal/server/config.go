package server

import (
	"e-gourmet/core/internal/app"
	"e-gourmet/core/internal/database"
	"e-gourmet/core/internal/keycloak"
	"e-gourmet/core/internal/logger"
	"e-gourmet/core/internal/middleware"
	"e-gourmet/core/internal/rediscluster"
	"e-gourmet/core/pkg/configloader"
	"fmt"
	"os"
)

const (
	ConfigPathEnv   = "EG_CONFIG_PATH"
	EnvPrefixConfig = "EG"
)

type Config struct {
	Database   *database.Config     `mapstructure:"database"`
	App        *app.Config          `mapstructure:"server"`
	Keycloak   *keycloak.Config     `mapstructure:"keycloak"`
	Logger     *logger.Config       `mapstructure:"logger"`
	Redis      *rediscluster.Config `mapstructure:"redis"`
	Middleware *middleware.Config   `mapstructure:"middleware"`
}

func DefaultConfig() *Config {
	return &Config{
		Database:   database.DefaultConfig(),
		App:        app.DefaultConfig(),
		Keycloak:   keycloak.DefaultConfig(),
		Logger:     logger.DefaultConfig(),
		Redis:      rediscluster.DefaultConfig(),
		Middleware: middleware.DefaultConfig(),
	}
}

func InitConfig() *Config {
	fmt.Println(os.Getenv(ConfigPathEnv))
	return configloader.LoadConfig[Config](DefaultConfig(), os.Getenv(ConfigPathEnv), EnvPrefixConfig)
}
