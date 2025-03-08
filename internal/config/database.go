package config

import (
	"e-gourmet/core/internal/db"
	"e-gourmet/core/pkg/configloader"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"go.uber.org/zap"

	"context"
	"fmt"
	"time"
)

type DBConfig struct {
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

type DBContext interface {
	GetConnection() *pgxpool.Pool
	Connect() error
	Close() DBContext
	Ping()
	db.DBTX
}

type DBClient struct {
	logger *zap.Logger
	config *DBConfig
	pool   *pgxpool.Pool
}

const (
	DefaultConfigDbPath   = "etc/config/db.yml"
	CustomConfigDbPathEnv = "EG_DB_CONFIG_PATH"
	EnvPrefixConfigDB     = "EG_DB"
)

func defaultDBConfig() *DBConfig {
	return &DBConfig{
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

func NewDBClient(logger *zap.Logger) *DBClient {
	configPath := os.Getenv(CustomConfigDbPathEnv)
	if configPath == "" {
		configPath = DefaultConfigDbPath
	}
	config := configloader.LoadConfig[DBConfig](defaultDBConfig(), configPath, EnvPrefixConfigDB)
	dbClient := &DBClient{
		logger: logger,
		config: config,
	}
	dbClient.Ping()
	return dbClient
}

func (db *DBClient) GetConnection() *pgxpool.Pool {
	return db.pool
}

func (db *DBClient) Connect() error {
	dsn := fmt.Sprintf("user=%s password=%s host=%s port=%d dbname=%s sslmode=%s connect_timeout=%d pool_max_conns=%d  pool_min_conns=%d pool_max_conn_lifetime=%s pool_max_conn_idle_time=%s pool_health_check_period=%s pool_max_conn_lifetime_jitter=%s",
		db.config.User,
		db.config.Password,
		db.config.Host,
		db.config.Port,
		db.config.DBName,
		db.config.SSLMode,
		db.config.ConnectTimeout,
		db.config.PoolMaxConns,
		db.config.PoolMinConns,
		db.config.PoolMaxConnLifetime,
		db.config.PoolMaxConnIdleTime,
		db.config.PoolHealthCheckPeriod,
		db.config.PoolMaxConnLifetimeJitter)

	poolConfig, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		db.logger.Error("error parsing database config", zap.Error(err))
		return err
	}
	db.logger.Info("Connecting to database")
	db.pool, err = pgxpool.NewWithConfig(context.Background(), poolConfig)
	if err != nil {
		db.logger.Error("error connecting to database", zap.Error(err))
		return err
	}
	return nil
}

func (db *DBClient) Close() DBContext {
	if db.pool != nil {
		db.pool.Close()
	}
	db.logger.Info("Closed database connection")
	return db
}

func (db *DBClient) Ping() {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if db.pool == nil {
		err := db.Connect()
		if err != nil {
			db.logger.Error("error connecting to database", zap.Error(err))
		}
	}
	if err := db.pool.Ping(ctx); err != nil {
		db.logger.Error("Unable to ping database", zap.Error(err))
	} else {
		db.logger.Info("Ping database successful")
	}
}

func (db *DBClient) Exec(ctx context.Context, s string, i ...interface{}) (pgconn.CommandTag, error) {
	start := time.Now()
	res, err := db.GetConnection().Exec(ctx, s, i...)
	db.logExecuteTime(start, "Exec", s)
	return res, err
}

func (db *DBClient) Query(ctx context.Context, s string, i ...interface{}) (pgx.Rows, error) {
	start := time.Now()
	res, err := db.GetConnection().Query(ctx, s, i...)
	db.logExecuteTime(start, "Query", s)
	return res, err
}

func (db *DBClient) QueryRow(ctx context.Context, s string, i ...interface{}) pgx.Row {
	start := time.Now()
	res := db.GetConnection().QueryRow(ctx, s, i...)
	db.logExecuteTime(start, "QueryRow", s)
	return res
}

func (db *DBClient) logExecuteTime(start time.Time, operation string, query string) {
	duration := time.Since(start)
	db.logger.Info(fmt.Sprintf("%s: %s took %s", operation, query, duration))
	if duration > db.config.DurationThreshold {
		db.logger.Warn("SQL OPERATION EXCEEDED TIME THRESHOLD", zap.String("query", query), zap.String("duration", duration.String()))
	}
}
