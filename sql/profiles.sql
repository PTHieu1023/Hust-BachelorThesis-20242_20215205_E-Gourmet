-- name: CreateProfile :one
INSERT INTO profiles (
    profile_type, tag_name, name, email, phone_number, avatar_url, biography,
    detail_address, local_address, lat, lng, enable
) VALUES (
             $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
         ) RETURNING *;

-- name: GetProfileByID :one
SELECT * FROM profiles WHERE id = $1;

-- name: UpdateProfile :exec
UPDATE profiles
SET name = $2, email = $3, phone_number = $4, avatar_url = $5, biography = $6,
    detail_address = $7, local_address = $8, lat = $9, lng = $10, updated_at = now(), enable = $11
WHERE id = $1;

-- name: DeleteProfile :exec
DELETE FROM profiles WHERE id = $1;

-- name: ListProfiles :many
SELECT * FROM profiles ORDER BY created_at DESC LIMIT $1 OFFSET $2;
