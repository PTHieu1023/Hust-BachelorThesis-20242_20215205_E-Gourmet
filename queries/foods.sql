-- name: CreateFood :one
INSERT INTO foods (restaurant_id, name, description, price)
VALUES ($1, $2, $3, $4) RETURNING *;

-- name: GetFoodByID :one
SELECT * FROM foods WHERE id = $1;

-- name: UpdateFood :exec
UPDATE foods SET name = $2, description = $3, price = $4, updated_at = now() WHERE id = $1;

-- name: DeleteFood :exec
DELETE FROM foods WHERE id = $1;

-- name: ListFoodsByRestaurant :many
SELECT * FROM foods WHERE restaurant_id = $1 ORDER BY updated_at DESC LIMIT $2 OFFSET $3;
