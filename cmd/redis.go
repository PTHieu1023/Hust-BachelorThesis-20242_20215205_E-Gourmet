package main

import (
	"context"
	"fmt"
	"log"

	"github.com/redis/go-redis/v9"
)

// Create a Redis Cluster client
func createClusterClient() *redis.ClusterClient {
	return redis.NewClusterClient(&redis.ClusterOptions{
		Addrs: []string{
			"localhost:7001",
			"localhost:7002",
			"localhost:7003",
			"localhost:7004",
			"localhost:7005",
			"localhost:7006",
		},
		ClientName:                 "",
		NewClient:                  nil,
		MaxRedirects:               0,
		ReadOnly:                   false,
		RouteByLatency:             false,
		RouteRandomly:              false,
		ClusterSlots:               nil,
		Dialer:                     nil,
		OnConnect:                  nil,
		Protocol:                   0,
		Username:                   "",
		Password:                   "",
		CredentialsProvider:        nil,
		CredentialsProviderContext: nil,
		MaxRetries:                 0,
		MinRetryBackoff:            0,
		MaxRetryBackoff:            0,
		DialTimeout:                0,
		ReadTimeout:                0,
		WriteTimeout:               0,
		ContextTimeoutEnabled:      false,
		PoolFIFO:                   false,
		PoolSize:                   0,
		PoolTimeout:                0,
		MinIdleConns:               0,
		MaxIdleConns:               0,
		MaxActiveConns:             0,
		ConnMaxIdleTime:            0,
		ConnMaxLifetime:            0,
		TLSConfig:                  nil,
		DisableIndentity:           false,
		IdentitySuffix:             "",
		UnstableResp3:              false,
	})
}

func main() {
	ctx := context.Background()
	client := createClusterClient()
	defer func(client *redis.ClusterClient) {
		err := client.Close()
		if err != nil {
			log.Fatal(err)
		}
	}(client)

	// Check the connection
	_, err := client.Ping(ctx).Result()
	if err != nil {
		log.Fatalf("Could not connect to Redis Cluster: %v", err)
	}

	fmt.Println("Connected to Redis Cluster!")

	// Set a key
	err = client.Set(ctx, "foo", "bar", 0).Err()
	if err != nil {
		log.Fatalf("Could not set key: %v", err)
	}

	// Get the key
	val, err := client.Get(ctx, "foo").Result()
	if err != nil {
		log.Fatalf("Could not get key: %v", err)
	}

	fmt.Println("Value of 'foo':", val)
}
