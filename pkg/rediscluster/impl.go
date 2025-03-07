package rediscluster

import (
	"context"
	"fmt"
	"github.com/redis/go-redis/v9"
	"time"
)

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

func (r *RedisClusterClient) MSet(ctx context.Context, kvs map[string]interface{}) error {
	start := time.Now()
	err := r.client.MSet(ctx, kvs).Err()
	r.logExecute(fmt.Sprintf("MSet: %s", kvs), start)
	return err
}

func (r *RedisClusterClient) MGet(ctx context.Context, keys []string) (map[string]interface{}, error) {
	start := time.Now()
	vals, err := r.client.MGet(ctx, keys...).Result()
	results := make(map[string]interface{})
	if err != nil {
		for i, key := range keys {
			if vals[i] != nil {
				results[key] = vals[i]
			}
		}
	}
	r.logExecute(fmt.Sprintf("MGet: %s", keys), start)

	return results, err
}

func (r *RedisClusterClient) HSet(ctx context.Context, key string, field string, value interface{}) error {
	start := time.Now()
	err := r.client.HSet(ctx, key, field, value).Err()
	r.logExecute(fmt.Sprintf("HSet: %s <- { %s : %s }", key, field, value), start)
	return err
}

func (r *RedisClusterClient) HGet(ctx context.Context, key string, field string) (interface{}, error) {
	start := time.Now()
	val, err := r.client.HGet(ctx, key, field).Result()
	r.logExecute(fmt.Sprintf("HGet: %s -> %s = %s", key, field, val), start)
	return val, err
}

func (r *RedisClusterClient) HDel(ctx context.Context, key string, field string) error {
	start := time.Now()
	err := r.client.HDel(ctx, key, field).Err()
	r.logExecute(fmt.Sprintf("HDel: %s -> %s", key, field), start)
	return err
}

func (r *RedisClusterClient) HExists(ctx context.Context, key string, field string) (bool, error) {
	start := time.Now()
	res, err := r.client.HExists(ctx, key, field).Result()
	r.logExecute(fmt.Sprintf("HExists: %s -> %s (%v)", key, field, res), start)
	return res, err
}

func (r *RedisClusterClient) HGetAll(ctx context.Context, key string) (map[string]string, error) {
	start := time.Now()
	val, err := r.client.HGetAll(ctx, key).Result()
	r.logExecute(fmt.Sprintf("HGetAll: %s -> %s", key, val), start)
	return val, err
}

func (r *RedisClusterClient) HKeys(ctx context.Context, key string) ([]string, error) {
	start := time.Now()
	val, err := r.client.HKeys(ctx, key).Result()
	r.logExecute(fmt.Sprintf("HKeys: %s -> %s", key, val), start)
	return val, err
}

func (r *RedisClusterClient) HVals(ctx context.Context, key string) ([]string, error) {
	start := time.Now()
	val, err := r.client.HVals(ctx, key).Result()
	r.logExecute(fmt.Sprintf("HVals: %s -> %s", key, val), start)
	return val, err
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

func (r *RedisClusterClient) Watch(ctx context.Context, keys ...string) error {
	//TODO implement me
	panic("implement me")
}

func (r *RedisClusterClient) Exec(ctx context.Context, fn func(tx *redis.Tx) error) error {
	//TODO implement me
	panic("implement me")
}

func (r *RedisClusterClient) Multi(ctx context.Context) error {
	//TODO implement me
	panic("implement me")
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

func (r *RedisClusterClient) Eval(ctx context.Context, script string, keys []string, args ...interface{}) (interface{}, error) {
	//TODO implement me
	panic("implement me")
}

func (r *RedisClusterClient) EvalSha(ctx context.Context, sha1 string, keys []string, args ...interface{}) (interface{}, error) {
	//TODO implement me
	panic("implement me")
}

func (r *RedisClusterClient) ScriptLoad(ctx context.Context, script string) (string, error) {
	//TODO implement me
	panic("implement me")
}

func (r *RedisClusterClient) PFAdd(ctx context.Context, key string, elements ...interface{}) error {
	//TODO implement me
	panic("implement me")
}

func (r *RedisClusterClient) PFCount(ctx context.Context, keys ...string) (int64, error) {
	//TODO implement me
	panic("implement me")
}

func (r *RedisClusterClient) PFMerge(ctx context.Context, destKey string, sourceKeys ...string) error {
	//TODO implement me
	panic("implement me")
}

func (r *RedisClusterClient) XAdd(ctx context.Context, stream string, values map[string]interface{}) error {
	//TODO implement me
	panic("implement me")
}

func (r *RedisClusterClient) XRead(ctx context.Context, streams []string, count int, block time.Duration) ([]redis.XStream, error) {
	//TODO implement me
	panic("implement me")
}

func (r *RedisClusterClient) XLen(ctx context.Context, stream string) (int64, error) {
	//TODO implement me
	panic("implement me")
}

func (r *RedisClusterClient) XGroupCreate(ctx context.Context, stream, group, start string) error {
	//TODO implement me
	panic("implement me")
}

func (r *RedisClusterClient) XAck(ctx context.Context, stream, group string, messageIDs ...string) error {
	//TODO implement me
	panic("implement me")
}
