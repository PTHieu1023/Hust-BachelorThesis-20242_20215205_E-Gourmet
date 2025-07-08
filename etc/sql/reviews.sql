-- name: CreateReview :one
WITH inserted_review as (
    INSERT INTO reviews (rating, comment, user_id, dish_id)
        VALUES (sqlc.narg(rating)::smallint,
                sqlc.narg(comment)::text,
                sqlc.narg(user_id)::varchar(63),
                sqlc.narg(dish_id)::int)
        RETURNING *)
SELECT r.id,
       r.comment,
       r.rating,
       r.dish_id,
       u.username,
       u.display_name as user_display_name,
       d.name         as dish_name
FROM inserted_review r
         LEFT JOIN users u on u.id = r.user_id
         LEFT JOIN dishes d on d.id = r.dish_id;

-- name: GetReviews :many
SELECT r.id,
       r.comment,
       r.rating,
       r.dish_id,
       d.name         as dish_name,
       d.images  as dish_image,
       r.user_id,
       u.username,
       u.avatar_url   as user_image,
       u.display_name as user_display_name,
       res.id as restaurant_id,
       res.username as restaurant_username,
       res.name as restaurant_name,
       r.created_at,
       r.updated_at
FROM reviews r
         LEFT JOIN dishes d on d.id = r.dish_id
         LEFT JOIN users u on r.user_id = u.id
         LEFT JOIN restaurants res on res.id = d.restaurant_id
WHERE (sqlc.narg(dish_id)::bigint is null or r.dish_id = sqlc.narg(dish_id)::bigint)
  and (sqlc.narg(user_id)::varchar(64) is null or r.user_id = sqlc.narg(user_id)::varchar(64))
  and (sqlc.narg(restaurant_id)::int is null or d.restaurant_id = sqlc.narg(restaurant_id)::int)
OFFSET $1 LIMIT $2;

-- name: DeleteReview :exec
DELETE
FROM reviews
WHERE id = $1;