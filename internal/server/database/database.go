package database

import (
	"context"
	"e-gourmet/core/internal/db"
	"e-gourmet/core/internal/server/constant"
	"e-gourmet/core/internal/server/logger"
	"e-gourmet/core/pkg/configloader"
	"fmt"
	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"
	"os"
	"time"
)

// DatabaseConfig holds the database configuration, including all pool settings
type DatabaseConfig struct {
	Host                  string `mapstructure:"host"`
	Port                  int    `mapstructure:"port"`
	User                  string `mapstructure:"user"`
	Password              string `mapstructure:"password"`
	DBName                string `mapstructure:"dbname"`
	SSLMode               string `mapstructure:"sslmode"`
	MaxPoolSize           int    `mapstructure:"max-pool-size"`
	MinPoolSize           int    `mapstructure:"min-pool-size"`
	IdlePoolTimeout       string `mapstructure:"idle-pool-timeout"`
	MaxPoolTimeout        string `mapstructure:"max-pool-timeout"`
	HealthCheckPeriod     string `mapstructure:"health-check-period"`
	MaxConnLifetime       string `mapstructure:"max-conn-lifetime"`
	MaxConnLifetimeJitter string `mapstructure:"max-conn-lifetime-jitter"`
	ConnAttemptTimeout    string `mapstructure:"conn-attempt-timeout"`
}

var _dbConfig *DatabaseConfig

// Config loads and returns the database configuration
func Config() *DatabaseConfig {
	if _dbConfig == nil {
		_dbConfig = configloader.LoadConfig[DatabaseConfig](
			constant.DefaultConfigDbPath,
			os.Getenv(constant.CustomConfigDbPathEnv),
			constant.EnvPrefixConfigDB)
	}
	return _dbConfig
}

var _pool *pgxpool.Pool
var _db *db.Queries

func newDBPool() error {
	if _pool != nil && _db != nil {
		return nil
	}

	// Format DSN (Data Source Name)
	dsn := fmt.Sprintf("postgres://%s:%s@%s:%d/%s?sslmode=%s",
		Config().User,
		Config().Password,
		Config().Host,
		Config().Port,
		Config().DBName,
		Config().SSLMode)

	// Parse pgxpool.Config from DSN
	poolConfig, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		return err
	}

	// Convert timeout strings to time.Duration
	if Config().IdlePoolTimeout != "" {
		poolConfig.MaxConnIdleTime, err = time.ParseDuration(Config().IdlePoolTimeout)
		if err != nil {
			return err
		}
	}
	if Config().MaxPoolTimeout != "" {
		poolConfig.MaxConnLifetime, err = time.ParseDuration(Config().MaxPoolTimeout)
		if err != nil {
			return err
		}
	}
	if Config().MaxConnLifetime != "" {
		poolConfig.MaxConnLifetime, err = time.ParseDuration(Config().MaxConnLifetime)
		if err != nil {
			return err
		}
	}
	if Config().MaxConnLifetimeJitter != "" {
		poolConfig.MaxConnLifetimeJitter, err = time.ParseDuration(Config().MaxConnLifetimeJitter)
		if err != nil {
			return err
		}
	}
	if Config().HealthCheckPeriod != "" {
		poolConfig.HealthCheckPeriod, err = time.ParseDuration(Config().HealthCheckPeriod)
		if err != nil {
			return err
		}
	}
	if Config().ConnAttemptTimeout != "" {
		poolConfig.ConnConfig.ConnectTimeout, err = time.ParseDuration(Config().ConnAttemptTimeout)
		if err != nil {
			return err
		}
	}

	// Set connection limits
	poolConfig.MaxConns = int32(Config().MaxPoolSize)
	poolConfig.MinConns = int32(Config().MinPoolSize)

	// Initialize connection pool
	connPool, err := pgxpool.NewWithConfig(context.Background(), poolConfig)
	if err != nil {
		return err
	}
	_pool = connPool
	_db = db.New(_pool)
	return nil
}

func DB() *db.Queries {
	if err := newDBPool(); err != nil {
		logger.Log().Error("Failed to connect to database", zap.Error(err))
	}
	return _db
}

func CloseDB() {
	if _pool != nil {
		_pool.Close()
	}
	logger.Log().Info("Closed database connection")
}

func PingDB() {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if _pool == nil {
		DB()
	}
	err := _pool.Ping(ctx)
	if err != nil {
		logger.Log().Error("Unable to ping database", zap.Error(err))
	} else {
		logger.Log().Info("Ping database successful")
	}
}
