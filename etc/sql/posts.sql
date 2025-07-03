-- name: CreatePost :one
INSERT INTO posts (caption, media, restaurant_id)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetPostByID :one
SELECT
    p.id,
    p.caption,
    p.media,
    p.created_at,
    p.updated_at,
    p.restaurant_id,
    r.name as restaurant_name,
    r.username as restaurant_username,
    r.avatar_url as restaurant_avatar,
    COUNT(DISTINCT pl.user_id) as like_count
FROM posts p
JOIN restaurants r ON p.restaurant_id = r.id
LEFT JOIN post_like pl ON p.id = pl.post_id
WHERE p.id = $1
GROUP BY p.id, p.caption, p.media, p.created_at, p.updated_at, p.restaurant_id, r.name, r.username, r.avatar_url;

-- name: UpdatePost :one
UPDATE posts
SET
    caption = coalesce(sqlc.narg('caption'), caption),
    media = coalesce(sqlc.narg('media'), media),
    updated_at = now()
WHERE id = @post_id
RETURNING *;

-- name: DeletePost :exec
DELETE FROM posts WHERE id = $1;

-- name: GetPosts :many
SELECT
    p.id,
    p.caption,
    p.media,
    p.created_at,
    p.updated_at,
    p.restaurant_id,
    r.name as restaurant_name,
    r.username as restaurant_username,
    r.avatar_url as restaurant_avatar,
    COUNT(DISTINCT pl.user_id) as like_count
FROM posts p
JOIN restaurants r ON p.restaurant_id = r.id
LEFT JOIN post_like pl ON p.id = pl.post_id
WHERE (@restaurant_id::varchar(64) = '' or r.id::text = @restaurant_id or r.username = @restaurant_id)
GROUP BY p.id, p.caption, p.media, p.created_at, p.updated_at, p.restaurant_id, r.name, r.username, r.avatar_url
ORDER BY p.created_at DESC
LIMIT $1 OFFSET $2;

-- name: GetPostsByRestaurant :many
SELECT
    p.id,
    p.caption,
    p.media,
    p.created_at,
    p.updated_at,
    p.restaurant_id,
    r.name as restaurant_name,
    r.username as restaurant_username,
    r.avatar_url as restaurant_avatar,
    COUNT(DISTINCT pl.user_id) as like_count
FROM posts p
JOIN restaurants r ON p.restaurant_id = r.id
LEFT JOIN post_like pl ON p.id = pl.post_id
WHERE p.restaurant_id = $1
GROUP BY p.id, p.caption, p.media, p.created_at, p.updated_at, p.restaurant_id, r.name, r.username, r.avatar_url
ORDER BY p.created_at DESC
LIMIT $2 OFFSET $3;

-- name: LikePost :exec
INSERT INTO post_like (post_id, user_id)
VALUES ($1, $2)
ON CONFLICT (post_id, user_id) DO NOTHING;

-- name: UnlikePost :exec
DELETE FROM post_like
WHERE post_id = $1 AND user_id = $2;

-- name: CheckPostLike :one
SELECT EXISTS(
    SELECT 1 FROM post_like
    WHERE post_id = $1 AND user_id = $2
);

-- name: CreateComment :one
INSERT INTO posts_comment (post_id, user_id, reply_to_id, content, media)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: GetCommentsByPost :many
SELECT
    pc.id,
    pc.post_id,
    pc.user_id,
    pc.reply_to_id,
    pc.content,
    pc.media,
    u.username,
    u.display_name,
    u.avatar_url
FROM posts_comment pc
JOIN users u ON pc.user_id = u.id
WHERE pc.post_id = $1
ORDER BY pc.id ASC;

-- name: DeleteComment :exec
DELETE FROM posts_comment WHERE id = $1 AND user_id = $2;

-- name: GetCommentByID :one
SELECT
    pc.id,
    pc.post_id,
    pc.user_id,
    pc.reply_to_id,
    pc.content,
    pc.media,
    u.username,
    u.display_name,
    u.avatar_url
FROM posts_comment pc
JOIN users u ON pc.user_id = u.id
WHERE pc.id = $1;

