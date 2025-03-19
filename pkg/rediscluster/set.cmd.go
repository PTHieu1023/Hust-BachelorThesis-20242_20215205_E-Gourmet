package rediscluster

import "context"

type SetCmd interface {
	SAdd(ctx context.Context, key string, values ...interface{}) error
	SRem(ctx context.Context, key string, values ...interface{}) error
	SMembers(ctx context.Context, key string) ([]interface{}, error)
	SIsMember(ctx context.Context, key string, value interface{}) (bool, error)
	SCard(ctx context.Context, key string) (int64, error)
	SRandMember(ctx context.Context, key string) (interface{}, error)
}

func (r *RedisClusterClient) SAdd(ctx context.Context, key string, values ...interface{}) error {
	//TODO implement me
	panic("implement me")
}

func (r *RedisClusterClient) SRem(ctx context.Context, key string, values ...interface{}) error {
	//TODO implement me
	panic("implement me")
}

func (r *RedisClusterClient) SMembers(ctx context.Context, key string) ([]interface{}, error) {
	//TODO implement me
	panic("implement me")
}

func (r *RedisClusterClient) SIsMember(ctx context.Context, key string, value interface{}) (bool, error) {
	//TODO implement me
	panic("implement me")
}

func (r *RedisClusterClient) SCard(ctx context.Context, key string) (int64, error) {
	//TODO implement me
	panic("implement me")
}

func (r *RedisClusterClient) SRandMember(ctx context.Context, key string) (interface{}, error) {
	//TODO implement me
	panic("implement me")
}
