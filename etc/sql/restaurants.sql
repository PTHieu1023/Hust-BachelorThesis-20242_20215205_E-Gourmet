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

-- name: UpdateRestaurant :one
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
    is_approved = coalesce(sqlc.narg('is_approved'), is_approved),
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

-- name: AddRestaurantManager :exec
INSERT INTO restaurant_manager (restaurant_id, user_id, is_owner)
VALUES (@restaurant_id::int, @user_id::varchar(64), @is_owner::bool);

-- name: GetRestaurantManagers :many
SELECT
    u.id,
    u.username,
    u.display_name,
    u.email,
    u.avatar_url,
    rm.restaurant_id,
    rm.is_owner
FROM restaurant_manager rm
JOIN users u ON rm.user_id = u.id
WHERE rm.restaurant_id = $1;

-- name: RemoveRestaurantManager :exec
DELETE FROM restaurant_manager
WHERE restaurant_id = $1 AND user_id = $2;

-- name: GetManagingRestaurantByUser :many
SELECT r.*, rm.is_owner
FROM restaurant_manager rm
JOIN restaurants r ON rm.restaurant_id = r.id
WHERE rm.user_id = $1;
