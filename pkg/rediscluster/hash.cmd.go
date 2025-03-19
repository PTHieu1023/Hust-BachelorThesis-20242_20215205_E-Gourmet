package rediscluster

import (
	"context"
	"fmt"
	"time"
)

type HashCmd interface {
	HashSet(ctx context.Context, key string, field string, value interface{}) error
	HashGet(ctx context.Context, key string, field string) (interface{}, error)
	HashDelete(ctx context.Context, key string, field string) error
	HashExists(ctx context.Context, key string, field string) (bool, error)
	HashGetAll(ctx context.Context, key string) (map[string]string, error)
	HashKeys(ctx context.Context, key string) ([]string, error)
	HashValues(ctx context.Context, key string) ([]string, error)
}

func (r *RedisClusterClient) HashSet(ctx context.Context, key string, field string, value interface{}) error {
	start := time.Now()
	err := r.client.HSet(ctx, key, field, value).Err()
	r.logExecute(fmt.Sprintf("HashSet: %s <- { %s : %s }", key, field, value), start)
	return err
}

func (r *RedisClusterClient) HashGet(ctx context.Context, key string, field string) (interface{}, error) {
	start := time.Now()
	val, err := r.client.HGet(ctx, key, field).Result()
	r.logExecute(fmt.Sprintf("HashGet: %s -> %s = %s", key, field, val), start)
	return val, err
}

func (r *RedisClusterClient) HashDelete(ctx context.Context, key string, field string) error {
	start := time.Now()
	err := r.client.HDel(ctx, key, field).Err()
	r.logExecute(fmt.Sprintf("HashDelete: %s -> %s", key, field), start)
	return err
}

func (r *RedisClusterClient) HashExists(ctx context.Context, key string, field string) (bool, error) {
	start := time.Now()
	res, err := r.client.HExists(ctx, key, field).Result()
	r.logExecute(fmt.Sprintf("HashExists: %s -> %s (%v)", key, field, res), start)
	return res, err
}

func (r *RedisClusterClient) HashGetAll(ctx context.Context, key string) (map[string]string, error) {
	start := time.Now()
	val, err := r.client.HGetAll(ctx, key).Result()
	r.logExecute(fmt.Sprintf("HashGetAll: %s -> %s", key, val), start)
	return val, err
}

func (r *RedisClusterClient) HashKeys(ctx context.Context, key string) ([]string, error) {
	start := time.Now()
	val, err := r.client.HKeys(ctx, key).Result()
	r.logExecute(fmt.Sprintf("HashKeys: %s -> %s", key, val), start)
	return val, err
}

func (r *RedisClusterClient) HashValues(ctx context.Context, key string) ([]string, error) {
	start := time.Now()
	val, err := r.client.HVals(ctx, key).Result()
	r.logExecute(fmt.Sprintf("HashValues: %s -> %s", key, val), start)
	return val, err
}
