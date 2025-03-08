package rediscluster

import (
	"context"
	"fmt"
	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"
	"strings"
	"time"
)

type RedisClusterClient struct {
	logger        *zap.Logger
	client        *redis.ClusterClient
	timeThreshold time.Duration
}

func NewRedisCluster(config *RedisClusterConfig, logger *zap.Logger) *RedisClusterClient {
	if config == nil {
		config = DefaultConfig()
	}
	options := &redis.ClusterOptions{
		Addrs:          strings.Split(config.Addrs, ","),
		MaxRedirects:   config.MaxRedirects,
		ReadOnly:       config.ReadOnly,
		RouteByLatency: config.RouteByLatency,
		RouteRandomly:  config.RouteRandomly,
		OnConnect: func(ctx context.Context, cn *redis.Conn) error {
			logger.Info(fmt.Sprintf("connect to redis cluster: %s", cn.String()))
			return nil
		},
		Username:        config.Username,
		Password:        config.Password,
		MaxRetries:      config.MaxRetries,
		MinRetryBackoff: config.MinRetryBackoff,
		MaxRetryBackoff: config.MaxRetryBackoff,
		DialTimeout:     config.DialTimeout,
		ReadTimeout:     config.ReadTimeout,
		WriteTimeout:    config.WriteTimeout,
		PoolSize:        config.PoolSize,
		PoolTimeout:     config.PoolTimeout,
		MinIdleConns:    config.MinIdleConns,
		MaxIdleConns:    config.MaxIdleConns,
		MaxActiveConns:  config.MaxActiveConns,
		ConnMaxIdleTime: config.ConnMaxIdleTime,
		ConnMaxLifetime: config.ConnMaxLifetime,
	}
	client := redis.NewClusterClient(options)
	if config.TimeThreshold == 0 {
		config.TimeThreshold = time.Millisecond * 100
	}
	return &RedisClusterClient{
		logger:        logger,
		client:        client,
		timeThreshold: config.TimeThreshold,
	}
}

func (r *RedisClusterClient) Close() {
	if r.client == nil {
		r.logger.Warn("Redis cluster client not initialized")
		return
	}
	if err := r.client.Close(); err != nil {
		r.logger.Error(fmt.Sprintf("Close redis cluster client error: %s", err.Error()))
		return
	}
	r.logger.Info("Redis cluster client closed")
}

func (r *RedisClusterClient) logExecute(operation string, start time.Time) {
	duration := time.Since(start)
	r.logger.Info(fmt.Sprintf("execute redis cluster operation: %s took %s", operation, duration))
	if duration > r.timeThreshold {
		r.logger.Warn("REDIS CLUSTER EXCEEDED TIME THRESHOLD", zap.String("operation", operation), zap.String("duration", duration.String()))
	}
}
