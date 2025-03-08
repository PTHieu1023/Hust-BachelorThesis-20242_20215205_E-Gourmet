package rediscluster

import (
	"context"
	
	"github.com/redis/go-redis/v9"
)

type SortedSetCmd interface {
	ZAdd(ctx context.Context, key string, members ...redis.Z) error
	ZRem(ctx context.Context, key string, members ...interface{}) error
	ZRange(ctx context.Context, key string, start, stop int64) ([]interface{}, error)
	ZRevRange(ctx context.Context, key string, start, stop int64) ([]interface{}, error)
	ZRank(ctx context.Context, key string, member string) (int64, error)
	ZRevRank(ctx context.Context, key string, member string) (int64, error)
	ZScore(ctx context.Context, key string, member string) (float64, error)
	ZIncrBy(ctx context.Context, key string, increment float64, member string) error
}

func (r *RedisClusterClient) ZAdd(ctx context.Context, key string, members ...redis.Z) error {
	//TODO implement me
	panic("implement me")
}

func (r *RedisClusterClient) ZRem(ctx context.Context, key string, members ...interface{}) error {
	//TODO implement me
	panic("implement me")
}

func (r *RedisClusterClient) ZRange(ctx context.Context, key string, start, stop int64) ([]interface{}, error) {
	//TODO implement me
	panic("implement me")
}

func (r *RedisClusterClient) ZRevRange(ctx context.Context, key string, start, stop int64) ([]interface{}, error) {
	//TODO implement me
	panic("implement me")
}

func (r *RedisClusterClient) ZRank(ctx context.Context, key string, member string) (int64, error) {
	//TODO implement me
	panic("implement me")
}

func (r *RedisClusterClient) ZRevRank(ctx context.Context, key string, member string) (int64, error) {
	//TODO implement me
	panic("implement me")
}

func (r *RedisClusterClient) ZScore(ctx context.Context, key string, member string) (float64, error) {
	//TODO implement me
	panic("implement me")
}

func (r *RedisClusterClient) ZIncrBy(ctx context.Context, key string, increment float64, member string) error {
	//TODO implement me
	panic("implement me")
}
