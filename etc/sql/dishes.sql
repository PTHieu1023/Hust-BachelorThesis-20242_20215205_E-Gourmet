-- name: CreateDish :one
WITH inserted_dish AS (
    INSERT INTO dishes (restaurant_id, name, description, price, cuisine_id)
    VALUES
        ($1, $2, $3, $4, $5)
    RETURNING *
)
SELECT
    d.id,
    d.name,
    d.description,
    d.price,
    d.restaurant_id,
    r.name AS restaurant,
    r.address,
    r.lat,
    r.lng,
    d.cuisine_id,
    c.name AS cuisine,
    d.created_at,
    d.updated_at
FROM inserted_dish d
LEFT JOIN restaurants r ON r.id = d.restaurant_id
LEFT JOIN cuisines    c ON c.id = d.cuisine_id;


-- name: GetDishByID :one
SELECT
    d.id,
    d.name,
    d.description,
    d.price,
    d.restaurant_id,
    r.name as restaurant,
    r.address,
    r.lat,
    r.lng,
    d.cuisine_id,
    c.name as cuisine,
    d.created_at,
    d.updated_at
FROM dishes d
LEFT JOIN restaurants r ON r.id = d.restaurant_id
LEFT JOIN cuisines c ON c.id = d.cuisine_id
WHERE d.id = $1;

-- -- name: UpdateDish :one
-- WITH inserted_dish AS (
--     UPDATE dishes
--     SET name = coalesce($1, name),
--         description = coalesce($2, description),
--         price = coalesce($3, price),
--         cuisine_id = coalesce($4, cuisine_id),
--         updated_at = now()
--     WHERE id = $5
--     RETURNING *
-- )
-- SELECT
--     d.id,
--     d.name,
--     d.description,
--     d.price,
--     d.restaurant_id,
--     r.name AS restaurant,
--     r.address,
--     r.lat,
--     r.lng,
--     d.cuisine_id,
--     c.name AS cuisine,
--     d.created_at,
--     d.updated_at
-- FROM inserted_dish d
-- LEFT JOIN restaurants r ON r.id = d.restaurant_id
-- LEFT JOIN cuisines    c ON c.id = d.cuisine_id;


-- name: DeleteFood :exec
DELETE FROM dishes WHERE id = $1;

-- name: ListFoodsByRestaurant :many
SELECT
    d.id,
    d.name,
    d.description,
    d.price,
    d.restaurant_id,
    r.name as restaurant,
    r.address,
    r.lat,
    r.lng,
    d.cuisine_id,
    c.name as cuisine,
    d.created_at,
    d.updated_at
FROM dishes d
LEFT JOIN restaurants r ON r.id = d.restaurant_id
LEFT JOIN cuisines c ON c.id = d.cuisine_id
WHERE d.restaurant_id = $1
ORDER BY d.updated_at DESC
LIMIT $2 OFFSET $3;
