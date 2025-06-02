-- name: CreateRestaurant :one
INSERT INTO restaurants (name, description, avatar_url, username, email, phone, address, lat, lng, document)
VALUES (:name, :description, :avatar_url, :username, :email, :phone, :address, :lat, :lng, :document)
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
WHERE id = :restaurant_id;

-- name: UpdateRestaurant :exec
UPDATE restaurants
SET
    name = coalesce(:name, name),
    description = coalesce(:description, description),
    avatar_url = coalesce(:avatar_url, avatar_url),
    username = coalesce(:username, username),
    email = coalesce(:email, email),
    phone = coalesce(:phone, phone),
    address = coalesce(:address, address),
    lat = coalesce(:lat, lat),
    lng = coalesce(:lng, lng),
    updated_at = now()
WHERE id = :restaurant_ids
RETURNING *;

-- name: DeleteRestaurant :exec
DELETE FROM restaurants WHERE id = :restaurant_id;

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
LIMIT :limit OFFSET :offset;

-- name: ApproveRestaurantProfile :exec
UPDATE restaurants
SET is_approved = :is_approved
WHERE id = :restaurant_id
RETURNING *;
