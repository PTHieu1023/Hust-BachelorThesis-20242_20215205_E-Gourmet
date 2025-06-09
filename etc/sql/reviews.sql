-- name: CreateReview :one
WITH inserted_review as (
    INSERT INTO reviews (rating, comment, user_id, dish_id)
    VALUES (
        sqlc.narg(rating)::smallint,
        sqlc.narg(comment)::text,
        sqlc.narg(user_id)::varchar(63),
        sqlc.narg(dish_id)::int)
    RETURNING *
)
SELECT
    r.id,
    r.comment,
    r.rating,
    r.dish_id,
    u.username,
    u.display_name as user_display_name,
    d.name as dish_name
FROM inserted_review r
LEFT JOIN  users u on u.id = r.user_id
LEFT JOIN  dishes d on d.id = r.dish_id;

-- name: GetReviews :many
SELECT
    r.id,
    r.comment,
    r.rating,
    r.dish_id,
    d.name,
    r.user_id,
    u.username,
    u.display_name,
    r.created_at,
    r.updated_at
FROM reviews r
LEFT JOIN dishes d on d.id = r.dish_id
LEFT JOIN users u on r.user_id = u.id
WHERE
    (sqlc.narg(dish_id)::bigint is null or r.dish_id = sqlc.narg(dish_id)::bigint)
  and
    (sqlc.narg(username)::varchar(64) is null or u.username = sqlc.narg(username)::varchar(64))
OFFSET $1 LIMIT $2;

-- name: DeleteReview :exec
DELETE FROM reviews WHERE id = $1;