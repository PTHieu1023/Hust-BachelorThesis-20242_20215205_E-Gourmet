-- name: SyncKCUser :one
INSERT INTO users (id, username, email, display_name)
VALUES ($1, $2, $3, $4)
ON CONFLICT (id) DO UPDATE
    SET username = EXCLUDED.username,
        email = EXCLUDED.email,
        display_name = EXCLUDED.display_name
RETURNING *;

-- name: GetUserByID :one
SELECT
    u.id,
    u.username,
    u.email,
    u.display_name,
    u.avatar_url
FROM users u
WHERE id = $1;

-- name: DeleteUser :exec
DELETE FROM users WHERE id = $1;
