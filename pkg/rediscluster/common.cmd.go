package rediscluster

import (
	"context"
	"fmt"
	"time"
)

type CommonCmd interface {
	Set(ctx context.Context, key string, value interface{}, ttl time.Duration) error
	Get(ctx context.Context, key string) (interface{}, error)
	Del(ctx context.Context, key string) error
	Exist(ctx context.Context, key string) (bool, error)
	Append(ctx context.Context, key string, value string) error
	Expire(ctx context.Context, key string, duration time.Duration) error
	TTL(ctx context.Context, key string) (time.Duration, error)
	Persist(ctx context.Context, key string) error
}

func (r *RedisClusterClient) Set(ctx context.Context, key string, value interface{}, ttl time.Duration) error {
	start := time.Now()
	err := r.client.Set(ctx, key, value, 0).Err()
	r.logExecute(fmt.Sprintf("Set: %s <- %s [%s]", key, value, ttl), start)
	return err
}

func (r *RedisClusterClient) Get(ctx context.Context, key string) (interface{}, error) {
	start := time.Now()
	val, err := r.client.Get(ctx, key).Result()
	r.logExecute(fmt.Sprintf("Get: %s == %s", key, val), start)
	return val, err
}

func (r *RedisClusterClient) Del(ctx context.Context, key string) error {
	start := time.Now()
	err := r.client.Del(ctx, key).Err()
	r.logExecute(fmt.Sprintf("Del: %s", key), start)
	return err
}

func (r *RedisClusterClient) Exist(ctx context.Context, key string) (bool, error) {
	start := time.Now()
	res, err := r.client.Exists(ctx, key).Result()
	r.logExecute(fmt.Sprintf("Exist: %s (%t)", key, res > 0), start)
	return res > 0, err
}

func (r *RedisClusterClient) Append(ctx context.Context, key string, value string) error {
	start := time.Now()
	err := r.client.Append(ctx, key, value).Err()
	r.logExecute(fmt.Sprintf("Append: %s <- %s", key, value), start)
	return err
}

func (r *RedisClusterClient) Expire(ctx context.Context, key string, duration time.Duration) error {
	start := time.Now()
	_, err := r.client.Expire(ctx, key, duration).Result()
	r.logExecute(fmt.Sprintf("Expire: %s -> %s", key, duration), start)
	return err
}

func (r *RedisClusterClient) TTL(ctx context.Context, key string) (time.Duration, error) {
	start := time.Now()
	res, err := r.client.TTL(ctx, key).Result()
	r.logExecute(fmt.Sprintf("TTL: %s -> %s", key, res), start)
	return res, err
}

func (r *RedisClusterClient) Persist(ctx context.Context, key string) error {
	start := time.Now()
	_, err := r.client.Persist(ctx, key).Result()
	r.logExecute(fmt.Sprintf("Persist: %s -> %s", key, start), start)
	return err
}
