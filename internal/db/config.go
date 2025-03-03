package db

import (
	"e-gourmet/core/pkg/configloader"

	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"

	"context"
	"fmt"
	"os"
	"time"
)

const (
	DefaultConfigDbPath   = "etc/config/db.yml"
	CustomConfigDbPathEnv = "EG_DB_CONFIG_PATH"
	EnvPrefixConfigDB     = "EG_DB"
)

type DBContext interface {
	GetConnection() (*pgxpool.Pool, error)
	Query() Querier
	LoadConfig() DBContext
	Connect() error
	Close() DBContext
	Ping()
}

type DBConfig struct {
	Host                      string `mapstructure:"host"`
	Port                      int    `mapstructure:"port"`
	User                      string `mapstructure:"user"`
	Password                  string `mapstructure:"password"`
	DBName                    string `mapstructure:"dbname"`
	SSLMode                   string `mapstructure:"sslmode"`
	ConnectTimeout            int    `mapstructure:"connect-timeout"`
	PoolMaxConns              int    `mapstructure:"pool-max-conns"`
	PoolMinConns              int    `mapstructure:"pool-min-conns"`
	PoolMaxConnLifetime       string `mapstructure:"pool-max-conn-lifetime"`
	PoolMaxConnIdleTime       string `mapstructure:"pool-max-conn-idle-time"`
	PoolHealthCheckPeriod     string `mapstructure:"pool-health-check-period"`
	PoolMaxConnLifetimeJitter string `mapstructure:"pool-max-conn-lifetime-jitter"`
}

type DBStore struct {
	logger *zap.Logger
	config *DBConfig
	pool   *pgxpool.Pool
	query  Querier
}

func NewDBStore(logger *zap.Logger) DBContext {
	db := &DBStore{logger: logger}
	return db.LoadConfig()
}

func (dc *DBStore) GetConnection() (*pgxpool.Pool, error) {
	if dc.pool != nil {
		return dc.pool, nil
	}
	if err := dc.Connect(); err != nil {
		return nil, err
	}
	return dc.pool, nil
}

func (dc *DBStore) Query() Querier {
	if dc.query == nil {
		dc.query = New()
	}
	return dc.query
}

func (dc *DBStore) LoadConfig() DBContext {
	dc.config = configloader.LoadConfig[DBConfig](
		DefaultConfigDbPath,
		os.Getenv(CustomConfigDbPathEnv),
		EnvPrefixConfigDB)
	return dc
}

func (dc *DBStore) Connect() error {
	dsn := fmt.Sprintf("user=%s password=%s host=%s port=%d dbname=%s sslmode=%s connect_timeout=%d pool_max_conns=%d  pool_min_conns=%d pool_max_conn_lifetime=%s pool_max_conn_idle_time=%s pool_health_check_period=%s pool_max_conn_lifetime_jitter=%s",
		dc.config.User,
		dc.config.Password,
		dc.config.Host,
		dc.config.Port,
		dc.config.DBName,
		dc.config.SSLMode,
		dc.config.ConnectTimeout,
		dc.config.PoolMaxConns,
		dc.config.PoolMinConns,
		dc.config.PoolMaxConnLifetime,
		dc.config.PoolMaxConnIdleTime,
		dc.config.PoolHealthCheckPeriod,
		dc.config.PoolMaxConnLifetimeJitter)

	poolConfig, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		dc.logger.Error("error parsing database config", zap.Error(err))
		return err
	}
	dc.logger.Info("Connecting to database")
	dc.pool, err = pgxpool.NewWithConfig(context.Background(), poolConfig)
	if err != nil {
		dc.logger.Error("error connecting to database", zap.Error(err))
		return err
	}
	return nil
}

func (dc *DBStore) Close() DBContext {
	if dc.pool != nil {
		dc.pool.Close()
		dc.pool = nil
	}
	dc.logger.Info("Closed database connection")
	return dc
}

func (dc *DBStore) Ping() {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	dbtx, err := dc.GetConnection()
	if err != nil {
		dc.logger.Error("error connecting to database", zap.Error(err))
		return
	}
	if err := dbtx.Ping(ctx); err != nil {
		dc.logger.Error("Unable to ping database", zap.Error(err))
	} else {
		dc.logger.Info("Ping database successful")
	}
}
