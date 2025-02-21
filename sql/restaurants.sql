-- name: CreateRestaurant :one
INSERT INTO restaurants (id, operating_hours)
VALUES ($1, $2) RETURNING *;

-- name: GetRestaurantByID :one
SELECT * FROM restaurants WHERE id = $1;

-- name: UpdateRestaurant :exec
UPDATE restaurants SET operating_hours = $2, updated_at = now() WHERE id = $1;

-- name: DeleteRestaurant :exec
DELETE FROM restaurants WHERE id = $1;

-- name: ListRestaurants :many
SELECT * FROM restaurants ORDER BY created_at DESC LIMIT $1 OFFSET $2;
