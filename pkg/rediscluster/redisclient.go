package rediscluster

import (
	"context"
	"fmt"
	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"
	"strings"
	"time"
)

type RedisClusterConfig struct {
	// Connection configs
	Addrs         string        `mapstructure:"addrs"`
	Username      string        `mapstructure:"username"`
	Password      string        `mapstructure:"password"`
	TLSEnabled    bool          `mapstructure:"tls_enabled"`
	TimeThreshold time.Duration `mapstructure:"time_threshold"`

	// Retry config
	DialTimeout     time.Duration `mapstructure:"dial_timeout"`
	ReadTimeout     time.Duration `mapstructure:"read_timeout"`
	WriteTimeout    time.Duration
	MaxRetries      int           `mapstructure:"max_retries"`
	MinRetryBackoff time.Duration `mapstructure:"min_retry_backoff"`
	MaxRetryBackoff time.Duration `mapstructure:"max_retry_backoff"`

	// Pool config
	PoolSize        int           `mapstructure:"pool_size"`
	PoolTimeout     time.Duration `mapstructure:"pool_timeout"`
	MinIdleConns    int           `mapstructure:"min_idle_conns"`
	MaxIdleConns    int           `mapstructure:"max_idle_conns"`
	MaxActiveConns  int           `mapstructure:"max_active_conns"`
	ConnMaxIdleTime time.Duration `mapstructure:"conn_max_idle_time"`
	ConnMaxLifetime time.Duration `mapstructure:"conn_max_lifetime"`

	// Cluster config
	MaxRedirects   int  `mapstructure:"max_redirects"`
	ReadOnly       bool `mapstructure:"read_only"`
	RouteByLatency bool `mapstructure:"route_by_latency"`
	RouteRandomly  bool `mapstructure:"route_randomly"`
}

type RedisClusterClient struct {
	logger        *zap.Logger
	client        *redis.ClusterClient
	timeThreshold time.Duration
}

func NewRedisCluster(config *RedisClusterConfig, logger *zap.Logger) IRedisCluster {
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

func (r *RedisClusterClient) logExecute(operation string, start time.Time) {
	duration := time.Since(start)
	r.logger.Info(fmt.Sprintf("execute redis cluster operation: %s took %s", operation, duration))
	if duration > r.timeThreshold {
		r.logger.Warn("REDIS CLUSTER EXCEEDED TIME THRESHOLD", zap.String("operation", operation), zap.String("duration", duration.String()))
	}
}
