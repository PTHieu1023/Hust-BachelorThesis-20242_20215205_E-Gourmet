package server

import (
	"e-gourmet/core/internal/server/logger"
	"e-gourmet/core/pkg/configloader"
	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"
	"os"

	"context"
	"fmt"
	"time"
)

const (
	DefaultDatabaseConfigPath = "etc/config/database.yml"
	DatabaseConfigPathEnv     = "EG_DATABASE_CONFIG"
	DatabaseEnvPrefixConfig   = "EG_DATABASE"
)

type DatabaseConfig struct {
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

var _pool *pgxpool.Pool

func connectDB() *pgxpool.Pool {
	logger.Instance().Info("Connecting to database")
	configPath := os.Getenv(DatabaseConfigPathEnv)
	if configPath == "" {
		configPath = DefaultDatabaseConfigPath
	}
	config := configloader.LoadConfig[DatabaseConfig](configPath, DatabaseEnvPrefixConfig)
	dsn := fmt.Sprintf("user=%s password=%s host=%s port=%d dbname=%s "+
		"sslmode=%s connect_timeout=%d pool_max_conns=%d  pool_min_conns=%d "+
		"pool_max_conn_lifetime=%s pool_max_conn_idle_time=%s "+
		"pool_health_check_period=%s pool_max_conn_lifetime_jitter=%s",
		config.User,
		config.Password,
		config.Host,
		config.Port,
		config.DBName,
		config.SSLMode,
		config.ConnectTimeout,
		config.PoolMaxConns,
		config.PoolMinConns,
		config.PoolMaxConnLifetime,
		config.PoolMaxConnIdleTime,
		config.PoolHealthCheckPeriod,
		config.PoolMaxConnLifetimeJitter)

	poolConfig, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		logger.Instance().Error("exceptions parsing database server", zap.Error(err))
		return nil
	}
	_pool, err = pgxpool.NewWithConfig(context.Background(), poolConfig)
	if err != nil {
		logger.Instance().Error("exceptions connecting to database", zap.Error(err))
		return nil
	}
	err = _pool.Ping(context.Background())
	if err != nil {
		logger.Instance().Error("exceptions pinging database", zap.Error(err))
		return nil
	}
	logger.Instance().Info("Connected to database")
	return _pool
}

func closeDB() {
	if _pool != nil {
		_pool.Close()
	}
	logger.Instance().Info("Closed database connection")
}
