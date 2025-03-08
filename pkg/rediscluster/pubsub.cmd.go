package rediscluster

import (
	"context"
	"github.com/redis/go-redis/v9"
)

type PubSubCmd interface {
	Publish(ctx context.Context, channel string, message interface{}) error
	Subscribe(ctx context.Context, channel string) (*redis.PubSub, error)
	Unsubscribe(ctx context.Context, channel string) error
}

func (r *RedisClusterClient) Publish(ctx context.Context, channel string, message interface{}) error {
	//TODO implement me
	panic("implement me")
}

func (r *RedisClusterClient) Subscribe(ctx context.Context, channel string) (*redis.PubSub, error) {
	//TODO implement me
	panic("implement me")
}

func (r *RedisClusterClient) Unsubscribe(ctx context.Context, channel string) error {
	//TODO implement me
	panic("implement me")
}
