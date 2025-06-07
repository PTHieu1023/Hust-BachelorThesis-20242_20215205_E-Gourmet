-- name: CreateReview :one
WITH inserted_review as (
    INSERT INTO reviews (rating, comment, user_id, dish_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
)
SELECT
    r.comment,
    r.rating,
    u.username,
    u.display_name,
    d.id,
    d.name
FROM inserted_review r
LEFT JOIN  users u on u.id = r.user_id
LEFT JOIN  dishes d on d.id = r.dish_id;

-- name: GetDishReviews :many
SELECT
    r.id,
    r.comment,
    r.rating,
    r.dish_id,
    d.name,
    r.user_id,
    u.username,
    u.display_name
FROM reviews r
LEFT JOIN dishes d on d.id = r.dish_id
LEFT JOIN users u on r.user_id = u.id
WHERE r.dish_id = $1
OFFSET $2 LIMIT $3;

-- name: UpdateReview :one
WITH updated_review as (
    UPDATE reviews r
    SET comment = coalesce(sqlc.narg('comment'), r.comment),
        rating = coalesce(sqlc.narg('rating'), r.rating),
        updated_at = now()
    WHERE id = sqlc.narg('review_id')
    RETURNING *
)
SELECT
    r."comment",
    r.rating,
    u.username,
    u.display_name,
    d.id,
    d.name
FROM updated_review r
LEFT JOIN  users u on u.id = r.user_id
LEFT JOIN  dishes d on d.id = r.dish_id;


-- name: DeleteReview :exec
DELETE FROM reviews WHERE id = $1;

-- name: GetUserReviews :many
SELECT
    r.id,
    r.comment,
    r.rating,
    r.dish_id,
    d.name,
    r.user_id,
    u.username,
    u.display_name
FROM reviews r
         LEFT JOIN dishes d on d.id = r.dish_id
         LEFT JOIN users u on r.user_id = u.id
WHERE r.user_id = $1
OFFSET $2 LIMIT $3;
