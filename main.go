package main

import (
	"context"
	"e-gourmet/core/repo"
	"fmt"
	"github.com/jackc/pgx/v5"
	"os"
)

func main() {
	urlExample := "postgres://egourmet:egourmet@localhost:5432/egourmet"
	conn, err := pgx.Connect(context.Background(), urlExample)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	defer conn.Close(context.Background())

	q := repo.New(conn)

	author, err := q.GetRestaurants(context.Background())
	if err != nil {
		fmt.Fprintf(os.Stderr, "GetAuthor failed: %v\n", err)
		os.Exit(1)
	}

	fmt.Println(author)
}
