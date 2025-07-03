-- name: GetCuisineRecursionById :many
WITH RECURSIVE cuisine_tree AS (
    SELECT
        c1.id,
        c1.name,
        c1.image_url,
        c1.parent_id,
        1::float AS level,
        0::float AS w
    FROM cuisines c1
    WHERE COALESCE($1, 0) = c1.id
    UNION ALL
    SELECT
        c.id,
        c."name",
        c.image_url,
        c.parent_id,
        ct.level * 0.01 AS level,
        ct.w + ct.level * 0.01 * ROW_NUMBER() OVER (PARTITION BY c.parent_id ORDER BY c.id) AS w
    FROM cuisines c
             INNER JOIN cuisine_tree ct ON c.parent_id = ct.id
)
SELECT * FROM cuisine_tree
order by level desc, w, id;


-- name: AddCuisine :one
INSERT INTO cuisines (name, parent_id, image_url)
VALUES ($1,$2,$3)
RETURNING *;

-- name: UpdateCuisine :one
UPDATE cuisines
SET name = $2,
    parent_id = $3,
    image_url = $4,
    updated_at = NOW()
WHERE id = $1
RETURNING *;

-- name: DeleteCuisine :exec
DELETE FROM cuisines
WHERE id = $1;
