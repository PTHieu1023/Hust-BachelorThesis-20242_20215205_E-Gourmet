-- name: CreateRestaurant :one
INSERT INTO restaurants (name, description, avatar_url, username, email, phone, address, lat, lng, document)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
RETURNING *;

-- name: GetRestaurantByID :one
SELECT
    r.id,
    r.name,
    r.description,
    r.avatar_url,
    r.username,
    r.email,
    r.phone,
    r.address,
    r.lat,
    r.lng,
    r.created_at,
    r.updated_at
FROM restaurants r
WHERE id = $1;

-- name: UpdateRestaurant :exec
UPDATE restaurants
SET
    name = coalesce(sqlc.narg('name'), name),
    description = coalesce(sqlc.narg('description'), description),
    avatar_url = coalesce(sqlc.narg('avatar_url'), avatar_url),
    username = coalesce(sqlc.narg('username'), username),
    email = coalesce(sqlc.narg('email'), email),
    phone = coalesce(sqlc('phone'), phone),
    address = coalesce(sqlc.narg('address'), address),
    lat = coalesce(sqlc.narg('lat'), lat),
    lng = coalesce(sqlc.narg('lng'), lng),
    updated_at = now()
WHERE id = @restaurant_id
RETURNING *;

-- name: DeleteRestaurant :exec
DELETE FROM restaurants WHERE id = $1;

-- name: GetRestaurants :many
SELECT
    r.id,
    r.name,
    r.description,
    r.avatar_url,
    r.username,
    r.email,
    r.phone,
    r.address,
    r.lat,
    r.lng,
    r.created_at,
    r.updated_at,
    r.is_approved
FROM restaurants r
LIMIT $1 OFFSET $2;

-- name: ApproveRestaurantProfile :exec
UPDATE restaurants
SET is_approved = $1
WHERE id = $2
RETURNING *;
