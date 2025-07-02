-- name: CreateDish :one
WITH inserted_dish AS (
    INSERT
        INTO dishes (restaurant_id, name, description, price, cuisine_id)
            VALUES (sqlc.narg(restaurant_id):: int, sqlc.narg(name):: varchar(255), sqlc.narg(description)::text,
                    sqlc.narg(price)::bigint, sqlc.narg(cuisine_id):: smallint)
            RETURNING *)
SELECT d.id,
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
         LEFT JOIN cuisines c ON c.id = d.cuisine_id;


-- name: GetDishByID :one
SELECT d.id,
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

-- name: DeleteDish :exec
DELETE
FROM dishes
WHERE id = $1;

-- name: GetDishes :many
SELECT d.id,
       d.name,
       d.description,
       d.price,
       d.restaurant_id,
       r.name                      as restaurant,
       r.username                  as restaurant_name,
       r.address,
       r.lat,
       r.lng,
       d.cuisine_id,
       c.name                      as cuisine,
       d.created_at,
       d.updated_at,
       coalesce(avg(rv.rating), 0) as rating
FROM dishes d
         LEFT JOIN restaurants r ON r.id = d.restaurant_id
         LEFT JOIN cuisines c ON c.id = d.cuisine_id
         LEFT JOIN reviews rv on rv.dish_id = d.id
WHERE (sqlc.narg(restaurant_id)::int is null or d.restaurant_id = sqlc.narg(restaurant_id)::int)
  AND d.cuisine_id in (select id from get_cuisine_recursion_by_id(sqlc.narg(cuisine_id)::smallint))
  AND concat(d.name, r.name) like '%' || @search || '%'
GROUP BY d.id, d.name, d.description, d.price, d.restaurant_id, r.name, r.address,
         r.lat, r.lng, d.cuisine_id, c.name, r.username,
         d.created_at, d.updated_at
ORDER BY d.updated_at DESC
LIMIT $1 OFFSET $2;
