package database

import (
	"context"
	"e-gourmet/core/internal/db"
	"e-gourmet/core/internal/server/logger"
	"e-gourmet/core/pkg/configloader"
	"fmt"
	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"
	"os"
	"time"
)

// TDBConfig holds the database configuration, including all pool settings
type TDBConfig struct {
	Driver                string `mapstructure:"driver"`
	Host                  string `mapstructure:"host"`
	Port                  int    `mapstructure:"port"`
	User                  string `mapstructure:"user"`
	Password              string `mapstructure:"password"`
	DBName                string `mapstructure:"dbname"`
	SSLMode               string `mapstructure:"sslmode"`
	IdlePoolSize          int    `mapstructure:"idle-pool-size"`
	MaxPoolSize           int    `mapstructure:"max-pool-size"`
	MinPoolSize           int    `mapstructure:"min-pool-size"`
	IdlePoolTimeout       string `mapstructure:"idle-pool-timeout"`
	MaxPoolTimeout        string `mapstructure:"max-pool-timeout"`
	HealthCheckPeriod     string `mapstructure:"health-check-period"`
	MaxConnLifetime       string `mapstructure:"max-conn-lifetime"`
	MaxConnLifetimeJitter string `mapstructure:"max-conn-lifetime-jitter"`
	PreferSimpleProtocol  bool   `mapstructure:"prefer-simple-protocol"`
	ConnAttemptTimeout    string `mapstructure:"conn-attempt-timeout"`
}

var _dbConfig *TDBConfig

// DBConfig loads and returns the database configuration
func DBConfig() *TDBConfig {
	if _dbConfig == nil {
		_dbConfig = configloader.LoadConfig[TDBConfig](
			"etc/config/db.yml",
			os.Getenv("OS_CONFIG_PATH"),
			"EG_DATABASE")
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
		DBConfig().User,
		DBConfig().Password,
		DBConfig().Host,
		DBConfig().Port,
		DBConfig().DBName,
		DBConfig().SSLMode)

	// Parse pgxpool.Config from DSN
	poolConfig, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		return err
	}

	// Convert timeout strings to time.Duration
	if DBConfig().IdlePoolTimeout != "" {
		poolConfig.MaxConnIdleTime, err = time.ParseDuration(DBConfig().IdlePoolTimeout)
		if err != nil {
			return err
		}
	}
	if DBConfig().MaxPoolTimeout != "" {
		poolConfig.MaxConnLifetime, err = time.ParseDuration(DBConfig().MaxPoolTimeout)
		if err != nil {
			return err
		}
	}
	if DBConfig().MaxConnLifetime != "" {
		poolConfig.MaxConnLifetime, err = time.ParseDuration(DBConfig().MaxConnLifetime)
		if err != nil {
			return err
		}
	}
	if DBConfig().MaxConnLifetimeJitter != "" {
		poolConfig.MaxConnLifetimeJitter, err = time.ParseDuration(DBConfig().MaxConnLifetimeJitter)
		if err != nil {
			return err
		}
	}
	if DBConfig().HealthCheckPeriod != "" {
		poolConfig.HealthCheckPeriod, err = time.ParseDuration(DBConfig().HealthCheckPeriod)
		if err != nil {
			return err
		}
	}
	if DBConfig().ConnAttemptTimeout != "" {
		poolConfig.ConnConfig.ConnectTimeout, err = time.ParseDuration(DBConfig().ConnAttemptTimeout)
		if err != nil {
			return err
		}
	}

	// Set connection limits
	poolConfig.MaxConns = int32(DBConfig().MaxPoolSize)
	poolConfig.MinConns = int32(DBConfig().MinPoolSize)

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
		logger.Logger().Error("Failed to connect to database", zap.Error(err))
	}
	return _db
}

func CloseDB() {
	if _pool != nil {
		_pool.Close()
	}
	logger.Logger().Info("Closed database connection")
}

func PingDB() {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if _pool == nil {
		DB()
	}
	err := _pool.Ping(ctx)
	if err != nil {
		logger.Logger().Error("Unable to ping database", zap.Error(err))
	} else {
		logger.Logger().Info(
			"Ping database successful")
	}
}
