package database

import (
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"

	"context"
	"fmt"
	"time"
)

type IDatabase interface {
	Connect() error
	Close() IDatabase
	Ping()
	DBTX
}

type DBClient struct {
	logger *zap.Logger
	config *Config
	pool   *pgxpool.Pool
}

func NewDBClient(config *Config, logger *zap.Logger) *DBClient {
	dbClient := &DBClient{
		logger: logger,
		config: config,
	}
	dbClient.Ping()
	return dbClient
}

func (db *DBClient) Connect() error {
	dsn := fmt.Sprintf("user=%s password=%s host=%s port=%d dbname=%s "+
		"sslmode=%s connect_timeout=%d pool_max_conns=%d  pool_min_conns=%d "+
		"pool_max_conn_lifetime=%s pool_max_conn_idle_time=%s "+
		"pool_health_check_period=%s pool_max_conn_lifetime_jitter=%s",
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
		db.logger.Error("error parsing database server", zap.Error(err))
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

func (db *DBClient) Close() IDatabase {
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
	res, err := db.pool.Exec(ctx, s, i...)
	db.logExecuteTime(start, "EXEC", s)
	return res, err
}

func (db *DBClient) Query(ctx context.Context, s string, i ...interface{}) (pgx.Rows, error) {
	start := time.Now()
	res, err := db.pool.Query(ctx, s, i...)
	db.logExecuteTime(start, "QUERY", s)
	return res, err
}

func (db *DBClient) QueryRow(ctx context.Context, s string, i ...interface{}) pgx.Row {
	start := time.Now()
	res := db.pool.QueryRow(ctx, s, i...)
	db.logExecuteTime(start, "QUERYROW", s)
	return res
}

func (db *DBClient) logExecuteTime(start time.Time, operation string, query string) {
	duration := time.Since(start)
	db.logger.Info(fmt.Sprintf("SQL %s: (%s) -> %s", operation, query, duration))
	if duration > db.config.DurationThreshold {
		db.logger.Warn("SQL EXCEEDED TIME THRESHOLD",
			zap.String("query", query),
			zap.String("duration", duration.String()))
	}
}
