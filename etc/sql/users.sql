-- name: CreateUser :one
INSERT INTO users (id, username, email, display_name)
VALUES (sqlc.narg(id)::varchar(64),
        sqlc.narg(username)::varchar(64),
        sqlc.narg(email)::varchar(127),
        sqlc.narg(display_name)::varchar(255))
RETURNING *;

-- name: GetUserByUsername :one
SELECT u.id,
       u.username,
       u.email,
       u.display_name,
       u.avatar_url,
       u.lat,
       u.lng,
       u.budget,
       u.created_at,
       u.updated_at,
       count(r.*)                 AS review_count,
       coalesce(avg(r.rating), 0) as average_rating
FROM users u
         LEFT JOIN reviews r ON u.id = r.user_id
WHERE u.username = @username::varchar(64)
GROUP BY u.id, u.username, u.email, u.display_name, u.avatar_url, u.created_at, u.updated_at;

-- name: GetUserById :one
SELECT
    u.id,
    u.username,
    u.email,
    u.display_name,
    u.avatar_url,
    u.lat,
    u.lng,
    COALESCE(u.budget, 0) AS budget,
    u.created_at,
    u.updated_at,
    COUNT(r.id) AS review_count,
    COALESCE(AVG(r.rating), 0) AS average_rating,
    ARRAY_AGG(DISTINCT JSONB_BUILD_OBJECT(
            'id',   c.id,
            'name', c.name,
            'imageUrl', c.image_url
                       )) FILTER (
        WHERE
        c.name IS NOT NULL
        ) AS fav_cuisines
FROM
    users u
        LEFT JOIN reviews r ON r.user_id = u.id
        LEFT JOIN user_cuisine uc ON uc.user_id = u.id
        LEFT JOIN cuisines c ON c.id = uc.cuisine_id
WHERE
    u.id = @id :: varchar(64)
GROUP BY
    u.id,
    u.username,
    u.email,
    u.display_name,
    u.avatar_url,
    u.lat,
    u.lng,
    u.budget,
    u.created_at,
    u.updated_at;

-- name: UpdateUser :one
WITH updated_user AS (
    UPDATE users
        SET
            username = coalesce(sqlc.narg(username)::varchar(64), username),
            email = coalesce(sqlc.narg(email)::varchar(127), email),
            display_name = coalesce(sqlc.narg(display_name)::varchar(255), display_name),
            avatar_url = coalesce(sqlc.narg(avatar_url)::varchar(255), avatar_url),
            lat = coalesce(sqlc.narg(lat)::float8, lat),
            lng = coalesce(sqlc.narg(lng)::float8, lng),
            budget = coalesce(sqlc.narg(budget)::int8, budget),
            enable = coalesce(sqlc.narg(enable)::bool, enable),
            updated_at = now()
        WHERE id = sqlc.narg(id)::varchar(64)
        RETURNING id, username, email, display_name, avatar_url, lat, lng, budget, created_at, updated_at)
SELECT u.id,
       u.username,
       u.email,
       u.display_name,
       u.avatar_url,
       u.lat,
       u.lng,
       u.budget,
       u.created_at,
       u.updated_at,
       count(r.*)                 AS review_count,
       coalesce(avg(r.rating), 0) as average_rating
FROM updated_user u
         LEFT JOIN reviews r ON u.id = r.user_id
GROUP BY u.id,
         u.username,
         u.email,
         u.display_name,
         u.avatar_url,
         u.lat,
         u.lng,
         u.budget,
         u.created_at,
         u.updated_at;