package config

import (
	"time"
)

// Config holds Redis cluster connection settings
type Config struct {
	Addrs        []string      `mapstructure:"addrs"`          // Redis cluster nodes
	Username     string        `mapstructure:"username"`       // ACL username
	Password     string        `mapstructure:"password"`       // Redis password
	TLSEnabled   bool          `mapstructure:"tls_enabled"`    // Enable TLS
	PoolSize     int           `mapstructure:"pool_size"`      // Max connections per node
	MinIdleConns int           `mapstructure:"min_idle_conns"` // Min idle connections
	ReadTimeout  time.Duration `mapstructure:"read_timeout"`   // Read timeout
	WriteTimeout time.Duration `mapstructure:"write_timeout"`  // Write timeout
	DialTimeout  time.Duration `mapstructure:"dial_timeout"`   // Connection timeout
}
