package main

import (
	"context"
	"e-gourmet/core/internal/config"
	"e-gourmet/core/pkg/rediscluster"
	"fmt"
	"log"
	"time"
)

func main() {
	ctx := context.Background()
	logger := config.NewLogger()
	rc := rediscluster.NewRedisCluster(nil, logger)

	// Test Set and Get
	key := "test_key"
	value := "Hello, Redis!"
	err := rc.Set(ctx, key, value, time.Minute)
	if err != nil {
		log.Fatalf("Set error: %v", err)
	}
	fmt.Println("Set Success")

	res, err := rc.Get(ctx, key)
	if err != nil {
		log.Fatalf("Get error: %v", err)
	}
	fmt.Println("Get Success: ", res)

	// Test Existence
	exists, err := rc.Exist(ctx, key)
	if err != nil {
		log.Fatalf("Exist error: %v", err)
	}
	fmt.Println("Exist Success: ", exists)

	// Test Append
	appendValue := " - Appended!"
	err = rc.Append(ctx, key, appendValue)
	if err != nil {
		log.Fatalf("Append error: %v", err)
	}
	fmt.Println("Append Success")

	// Get Updated Value
	res, _ = rc.Get(ctx, key)
	fmt.Println("Updated Get: ", res)

	// Test TTL
	ttl, err := rc.TTL(ctx, key)
	if err != nil {
		log.Fatalf("TTL error: %v", err)
	}
	fmt.Println("TTL Success: ", ttl)

	// Test Expire
	err = rc.Expire(ctx, key, 2*time.Minute)
	if err != nil {
		log.Fatalf("Expire error: %v", err)
	}
	fmt.Println("Expire Success")

	// Test Persist
	err = rc.Persist(ctx, key)
	if err != nil {
		log.Fatalf("Persist error: %v", err)
	}
	fmt.Println("Persist Success")

	// Test Delete
	err = rc.Del(ctx, key)
	if err != nil {
		log.Fatalf("Del error: %v", err)
	}
	fmt.Println("Delete Success")
}
