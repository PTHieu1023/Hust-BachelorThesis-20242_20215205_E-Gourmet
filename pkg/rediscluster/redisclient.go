package rediscluster

import (
	"context"
	"fmt"
	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"
	"strings"
	"time"
)

type RedisCluster interface {
	CommonCmd
	HashCmd
	SetCmd
	ListCmd
	SortedSetCmd
	PubSubCmd
	Close()
}

type RedisClusterClient struct {
	logger *zap.Logger
	client *redis.ClusterClient
	config *RedisClusterConfig
}

func NewRedisCluster(config *RedisClusterConfig, logger *zap.Logger) RedisCluster {
	clusterClient := &RedisClusterClient{
		logger: logger,
		config: config,
	}
	clusterClient.Ping()
	return clusterClient
}

func (r *RedisClusterClient) Connect() {
	if r.config == nil {
		r.config = DefaultConfig()
	}
	options := &redis.ClusterOptions{
		Addrs:           strings.Split(r.config.Addrs, ","),
		MaxRedirects:    r.config.MaxRedirects,
		ReadOnly:        r.config.ReadOnly,
		RouteByLatency:  r.config.RouteByLatency,
		RouteRandomly:   r.config.RouteRandomly,
		Username:        r.config.Username,
		Password:        r.config.Password,
		MaxRetries:      r.config.MaxRetries,
		MinRetryBackoff: r.config.MinRetryBackoff,
		MaxRetryBackoff: r.config.MaxRetryBackoff,
		DialTimeout:     r.config.DialTimeout,
		ReadTimeout:     r.config.ReadTimeout,
		WriteTimeout:    r.config.WriteTimeout,
		PoolSize:        r.config.PoolSize,
		PoolTimeout:     r.config.PoolTimeout,
		MinIdleConns:    r.config.MinIdleConns,
		MaxIdleConns:    r.config.MaxIdleConns,
		MaxActiveConns:  r.config.MaxActiveConns,
		ConnMaxIdleTime: r.config.ConnMaxIdleTime,
		ConnMaxLifetime: r.config.ConnMaxLifetime,
		OnConnect: func(ctx context.Context, cn *redis.Conn) error {
			r.logger.Info("redis connect success", zap.String("addrs", cn.String()))
			return nil
		},
	}
	r.client = redis.NewClusterClient(options)
	if r.config.TimeThreshold == 0 {
		r.config.TimeThreshold = time.Millisecond * 100
	}
}

func (r *RedisClusterClient) Ping() {
	if r.client == nil {
		r.Connect()
	}
	r.logger.Info("ping to redis cluster", zap.String("addrs", r.config.Addrs), zap.String("username", r.config.Username))
	if r.client.Ping(context.Background()).Err() != nil {
		r.logger.Error("Can't ping redis server", zap.Error(r.client.Ping(context.Background()).Err()))
	} else {
		r.logger.Info("redis ping success", zap.String("addrs", r.config.Addrs), zap.String("username", r.config.Username))
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
	if duration > r.config.TimeThreshold {
		r.logger.Warn("REDIS CLUSTER EXCEEDED TIME THRESHOLD", zap.String("operation", operation), zap.String("duration", duration.String()))
	}
}
