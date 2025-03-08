package rediscluster

import "context"

type ListCmd interface {
	LPush(ctx context.Context, key string, values ...interface{}) error
	RPush(ctx context.Context, key string, values ...interface{}) error
	LPop(ctx context.Context, key string) (interface{}, error)
	RPop(ctx context.Context, key string) (interface{}, error)
	LLen(ctx context.Context, key string) (int64, error)
	LRange(ctx context.Context, key string, start, stop int64) ([]interface{}, error)
	LIndex(ctx context.Context, key string, index int64) (interface{}, error)
	LRem(ctx context.Context, key string, count int64, value interface{}) error
	LSet(ctx context.Context, key string, index int64, value interface{}) error
}

func (r *RedisClusterClient) LPush(ctx context.Context, key string, values ...interface{}) error {
	//TODO implement me
	panic("implement me")
}

func (r *RedisClusterClient) RPush(ctx context.Context, key string, values ...interface{}) error {
	//TODO implement me
	panic("implement me")
}

func (r *RedisClusterClient) LPop(ctx context.Context, key string) (interface{}, error) {
	//TODO implement me
	panic("implement me")
}

func (r *RedisClusterClient) RPop(ctx context.Context, key string) (interface{}, error) {
	//TODO implement me
	panic("implement me")
}

func (r *RedisClusterClient) LLen(ctx context.Context, key string) (int64, error) {
	//TODO implement me
	panic("implement me")
}

func (r *RedisClusterClient) LRange(ctx context.Context, key string, start, stop int64) ([]interface{}, error) {
	//TODO implement me
	panic("implement me")
}

func (r *RedisClusterClient) LIndex(ctx context.Context, key string, index int64) (interface{}, error) {
	//TODO implement me
	panic("implement me")
}

func (r *RedisClusterClient) LRem(ctx context.Context, key string, count int64, value interface{}) error {
	//TODO implement me
	panic("implement me")
}

func (r *RedisClusterClient) LSet(ctx context.Context, key string, index int64, value interface{}) error {
	//TODO implement me
	panic("implement me")
}
