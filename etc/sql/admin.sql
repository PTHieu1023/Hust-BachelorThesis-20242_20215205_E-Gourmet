-- name: GetRestaurantsAdmin :many
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
    r.is_approved,
    u.id as owner_id,
    u.username as owner_username,
    u.display_name as owner_name,
    u.email as owner_email
FROM restaurants r
LEFT JOIN restaurant_manager rm ON r.id = rm.restaurant_id AND rm.is_owner = true
LEFT JOIN users u ON rm.user_id = u.id
ORDER BY r.created_at DESC
LIMIT $1 OFFSET $2;

-- name: ApproveRestaurant :one
UPDATE restaurants
SET is_approved = @is_approved::boolean,
    updated_at = now()
WHERE id = @restaurant_id::int
RETURNING id, name, is_approved;

-- name: GetAllUsers :many
SELECT
    u.id,
    u.username,
    u.email,
    u.display_name,
    u.avatar_url,
    u.created_at,
    u.updated_at,
    u.status
FROM users u
ORDER BY u.created_at DESC
LIMIT $1 OFFSET $2;

-- name: SetUserStatus :exec
UPDATE users
SET status = @status::varchar,
    updated_at = now()
WHERE id = @user_id::varchar;
