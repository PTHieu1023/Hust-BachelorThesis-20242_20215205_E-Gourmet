package database

import "time"

type Config struct {
	Host                      string        `mapstructure:"host"`
	Port                      int           `mapstructure:"port"`
	User                      string        `mapstructure:"user"`
	Password                  string        `mapstructure:"password"`
	DBName                    string        `mapstructure:"dbname"`
	SSLMode                   string        `mapstructure:"sslmode"`
	ConnectTimeout            int           `mapstructure:"connect-timeout"`
	PoolMaxConns              int           `mapstructure:"pool-max-conns"`
	PoolMinConns              int           `mapstructure:"pool-min-conns"`
	PoolMaxConnLifetime       time.Duration `mapstructure:"pool-max-conn-lifetime"`
	PoolMaxConnIdleTime       time.Duration `mapstructure:"pool-max-conn-idle-time"`
	PoolHealthCheckPeriod     time.Duration `mapstructure:"pool-health-check-period"`
	PoolMaxConnLifetimeJitter time.Duration `mapstructure:"pool-max-conn-lifetime-jitter"`
	DurationThreshold         time.Duration `mapstructure:"duration-threshold"`
}

func DefaultConfig() *Config {
	return &Config{
		Host:                      "localhost",
		Port:                      5432,
		User:                      "postgres",
		Password:                  "postgres",
		DBName:                    "postgres",
		SSLMode:                   "disable",
		ConnectTimeout:            60,
		PoolMaxConns:              20,
		PoolMinConns:              5,
		PoolMaxConnLifetime:       30 * time.Minute,
		PoolMaxConnIdleTime:       5 * time.Minute,
		PoolHealthCheckPeriod:     5 * time.Minute,
		PoolMaxConnLifetimeJitter: 5 * time.Minute,
		DurationThreshold:         100 * time.Millisecond,
	}
}
