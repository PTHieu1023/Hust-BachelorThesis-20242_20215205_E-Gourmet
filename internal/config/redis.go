package config

import (
	"e-gourmet/core/pkg/configloader"
	"e-gourmet/core/pkg/rediscluster"
	"go.uber.org/zap"
	"os"
)

const (
	DefaultConfigRedisPath   = "etc/config/redis.yml"
	CustomConfigRedisPathEnv = "EG_REDIS_CONFIG_PATH"
	EnvPrefixConfigRedis     = "EG_REDIS"
)

func NewRedisStore(logger *zap.Logger) *rediscluster.RedisClusterClient {
	configPath := os.Getenv(CustomConfigRedisPathEnv)
	if configPath == "" {
		configPath = DefaultConfigRedisPath
	}
	config := configloader.LoadConfig[rediscluster.RedisClusterConfig](
		rediscluster.DefaultConfig(),
		configPath,
		EnvPrefixConfigRedis)
	return rediscluster.NewRedisCluster(config, logger)
}
