package rediscluster

import (
	"time"
)

type Config struct {
	// Connection configs
	Addrs         string        `mapstructure:"addrs"`
	Username      string        `mapstructure:"username"`
	Password      string        `mapstructure:"password"`
	TLSEnabled    bool          `mapstructure:"tls_enabled"`
	TimeThreshold time.Duration `mapstructure:"time_threshold"`

	// Retry server
	DialTimeout     time.Duration `mapstructure:"dial_timeout"`
	ReadTimeout     time.Duration `mapstructure:"read_timeout"`
	WriteTimeout    time.Duration
	MaxRetries      int           `mapstructure:"max_retries"`
	MinRetryBackoff time.Duration `mapstructure:"min_retry_backoff"`
	MaxRetryBackoff time.Duration `mapstructure:"max_retry_backoff"`

	// Pool server
	PoolSize        int           `mapstructure:"pool_size"`
	PoolTimeout     time.Duration `mapstructure:"pool_timeout"`
	MinIdleConns    int           `mapstructure:"min_idle_conns"`
	MaxIdleConns    int           `mapstructure:"max_idle_conns"`
	MaxActiveConns  int           `mapstructure:"max_active_conns"`
	ConnMaxIdleTime time.Duration `mapstructure:"conn_max_idle_time"`
	ConnMaxLifetime time.Duration `mapstructure:"conn_max_lifetime"`

	// Cluster server
	MaxRedirects   int  `mapstructure:"max_redirects"`
	ReadOnly       bool `mapstructure:"read_only"`
	RouteByLatency bool `mapstructure:"route_by_latency"`
	RouteRandomly  bool `mapstructure:"route_randomly"`
}

func DefaultConfig() *Config {
	return &Config{
		Addrs:           "127.0.0.1:6379",
		Username:        "hiusnef",
		Password:        "",
		TLSEnabled:      false,
		TimeThreshold:   0,
		DialTimeout:     0,
		ReadTimeout:     0,
		WriteTimeout:    0,
		MaxRetries:      0,
		MinRetryBackoff: 0,
		MaxRetryBackoff: 0,
		PoolSize:        0,
		PoolTimeout:     0,
		MinIdleConns:    0,
		MaxIdleConns:    0,
		MaxActiveConns:  0,
		ConnMaxIdleTime: 0,
		ConnMaxLifetime: 0,
		MaxRedirects:    0,
		ReadOnly:        false,
		RouteByLatency:  false,
		RouteRandomly:   true,
	}
}
