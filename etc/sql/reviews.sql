-- name: CreateReview :one
INSERT INTO reviews (rating, comment, user_id, dish_id)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetReviewByID :one
SELECT * FROM reviews WHERE id = $1;

-- name: UpdateReview :exec
UPDATE reviews SET content = $2, rate = $3, updated_at = now() WHERE id = $1;

-- name: DeleteReview :exec
DELETE FROM reviews WHERE id = $1;

-- name: ListReviewsByRestaurant :many
SELECT * FROM reviews WHERE restaurant_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3;
