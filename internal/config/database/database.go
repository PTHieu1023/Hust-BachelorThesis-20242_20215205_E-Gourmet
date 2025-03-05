package database

import (
	"e-gourmet/core/internal/db"
	"e-gourmet/core/pkg/configloader"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"

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
	GetConnection() (*DBClient, error)
	Query() db.Querier
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
	DurationThreshold         string `mapstructure:"duration-threshold"`
}

type DBClient struct {
	pool              *pgxpool.Pool
	logger            *zap.Logger
	durationThreshold time.Duration
}

func NewDBClient(pool *pgxpool.Pool, logger *zap.Logger, durationThreshold time.Duration) *DBClient {
	return &DBClient{
		pool:              pool,
		logger:            logger,
		durationThreshold: durationThreshold,
	}
}

func (db *DBClient) logExecuteTime(start time.Time, operation string, query string) {
	duration := time.Since(start)
	db.logger.Info(fmt.Sprintf("%s: %s took %s", operation, query, duration))
	if duration > db.durationThreshold {
		db.logger.Warn("SQL operation exceeded time limit threshold", zap.String("query", query), zap.String("duration", duration.String()))
	}
}

func (db *DBClient) Exec(ctx context.Context, s string, i ...interface{}) (pgconn.CommandTag, error) {
	start := time.Now()
	res, err := db.pool.Exec(ctx, s, i...)

	go db.logExecuteTime(start, "Exec", s)

	return res, err
}

func (db *DBClient) Query(ctx context.Context, s string, i ...interface{}) (pgx.Rows, error) {
	start := time.Now()
	res, err := db.pool.Query(ctx, s, i...)
	go db.logExecuteTime(start, "Query", s)
	return res, err
}

func (db *DBClient) QueryRow(ctx context.Context, s string, i ...interface{}) pgx.Row {
	start := time.Now()
	res := db.pool.QueryRow(ctx, s, i...)
	go db.logExecuteTime(start, "QueryRow", s)
	return res
}

type DBStore struct {
	logger *zap.Logger
	config *DBConfig
	client *DBClient
	query  db.Querier
}

func NewDBStore(logger *zap.Logger) DBContext {
	dbStore := &DBStore{logger: logger}
	return dbStore.LoadConfig()
}

func (dc *DBStore) GetConnection() (*DBClient, error) {
	if dc.client != nil {
		return dc.client, nil
	}
	if err := dc.Connect(); err != nil {
		return nil, err
	}
	return dc.client, nil
}

func (dc *DBStore) Query() db.Querier {
	if dc.query == nil {
		dc.query = db.New()
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
	durationThreshold, err := time.ParseDuration(dc.config.DurationThreshold)
	if err != nil {
		dc.logger.Error("error parsing database duration threshold", zap.Error(err))
		dc.logger.Info("use default database duration threshold: 100ms")
		durationThreshold = 100 * time.Millisecond
	}
	dc.logger.Info("Connecting to database")
	pool, err := pgxpool.NewWithConfig(context.Background(), poolConfig)
	dc.client = NewDBClient(pool, dc.logger, durationThreshold)
	if err != nil {
		dc.logger.Error("error connecting to database", zap.Error(err))
		return err
	}
	return nil
}

func (dc *DBStore) Close() DBContext {
	if dc.client != nil {
		dc.client.pool.Close()
		dc.client = nil
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
	if err := dbtx.pool.Ping(ctx); err != nil {
		dc.logger.Error("Unable to ping database", zap.Error(err))
	} else {
		dc.logger.Info("Ping database successful")
	}
}
