package rediscluster

import (
	"context"
	"github.com/redis/go-redis/v9"
	"time"
)

type IRedisCluster interface {
	Set(ctx context.Context, key string, value interface{}, ttl time.Duration) error
	Get(ctx context.Context, key string) (interface{}, error)
	Del(ctx context.Context, key string) error
	Exist(ctx context.Context, key string) (bool, error)
	Append(ctx context.Context, key string, value string) error
	MSet(ctx context.Context, kvs map[string]interface{}) error
	MGet(ctx context.Context, keys []string) (map[string]interface{}, error)
}

type IRedisHash interface {
	HSet(ctx context.Context, key string, field string, value interface{}) error
	HGet(ctx context.Context, key string, field string) (interface{}, error)
	HDel(ctx context.Context, key string, field string) error
	HExists(ctx context.Context, key string, field string) (bool, error)
	HGetAll(ctx context.Context, key string) (map[string]string, error)
	HKeys(ctx context.Context, key string) ([]string, error)
	HVals(ctx context.Context, key string) ([]string, error)
}

type IRedisList interface {
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

type IRedisSet interface {
	SAdd(ctx context.Context, key string, values ...interface{}) error
	SRem(ctx context.Context, key string, values ...interface{}) error
	SMembers(ctx context.Context, key string) ([]interface{}, error)
	SIsMember(ctx context.Context, key string, value interface{}) (bool, error)
	SCard(ctx context.Context, key string) (int64, error)
	SRandMember(ctx context.Context, key string) (interface{}, error)
}

type IRedisSortedSet interface {
	ZAdd(ctx context.Context, key string, members ...redis.Z) error
	ZRem(ctx context.Context, key string, members ...interface{}) error
	ZRange(ctx context.Context, key string, start, stop int64) ([]interface{}, error)
	ZRevRange(ctx context.Context, key string, start, stop int64) ([]interface{}, error)
	ZRank(ctx context.Context, key string, member string) (int64, error)
	ZRevRank(ctx context.Context, key string, member string) (int64, error)
	ZScore(ctx context.Context, key string, member string) (float64, error)
	ZIncrBy(ctx context.Context, key string, increment float64, member string) error
}

type IRedisUtility interface {
	Expire(ctx context.Context, key string, duration time.Duration) error
	TTL(ctx context.Context, key string) (time.Duration, error)
	Persist(ctx context.Context, key string) error
}

type IRedisTransaction interface {
	Watch(ctx context.Context, keys ...string) error
	Exec(ctx context.Context, fn func(tx *redis.Tx) error) error
	Multi(ctx context.Context) error
}

type IRedisPubSub interface {
	Publish(ctx context.Context, channel string, message interface{}) error
	Subscribe(ctx context.Context, channel string) (*redis.PubSub, error)
	Unsubscribe(ctx context.Context, channel string) error
}

type IRedisScripting interface {
	Eval(ctx context.Context, script string, keys []string, args ...interface{}) (interface{}, error)
	EvalSha(ctx context.Context, sha1 string, keys []string, args ...interface{}) (interface{}, error)
	ScriptLoad(ctx context.Context, script string) (string, error)
}

type IRedisHyperLogLog interface {
	PFAdd(ctx context.Context, key string, elements ...interface{}) error
	PFCount(ctx context.Context, keys ...string) (int64, error)
	PFMerge(ctx context.Context, destKey string, sourceKeys ...string) error
}

type IRedisStream interface {
	XAdd(ctx context.Context, stream string, values map[string]interface{}) error
	XRead(ctx context.Context, streams []string, count int, block time.Duration) ([]redis.XStream, error)
	XLen(ctx context.Context, stream string) (int64, error)
	XGroupCreate(ctx context.Context, stream, group, start string) error
	XAck(ctx context.Context, stream, group string, messageIDs ...string) error
}
