-- name: GetDishesByRestaurant :many
SELECT d.id,
       d.name,
       d.description,
       d.price,
       d.restaurant_id,
       r.name                      as restaurant,
       r.username                  as restaurant_username,
       r.address,
       r.lat,
       r.lng,
       d.cuisine_id,
       c.name                      as cuisine,
       d.created_at,
       d.updated_at,
       coalesce(avg(rv.rating), 0) as rating,
       mc.id as category_id,
       mc.name as category_name
FROM dishes d
         LEFT JOIN restaurants r ON r.id = d.restaurant_id
         LEFT JOIN cuisines c ON c.id = d.cuisine_id
         LEFT JOIN reviews rv on rv.dish_id = d.id
         LEFT JOIN menu_categories mc on d.category_id = mc.id
WHERE d.restaurant_id = $1
GROUP BY d.id, d.name, d.description, d.price, d.restaurant_id, r.name, r.address,
         r.lat, r.lng, d.cuisine_id, c.name, r.username,
         d.created_at, d.updated_at, mc.id, mc.name
ORDER BY d.category_id, d.name;

-- name: UpdateDish :one
UPDATE dishes
SET name = coalesce(sqlc.narg('name'), name),
    description = coalesce(sqlc.narg('description'), description),
    price = coalesce(sqlc.narg('price'), price),
    cuisine_id = coalesce(sqlc.narg('cuisine_id'), cuisine_id),
    category_id = sqlc.narg('category_id'),
    updated_at = now()
WHERE id = @dish_id
RETURNING id, name, description, price, restaurant_id, cuisine_id, category_id, created_at, updated_at;

-- name: GetMenuCategoriesByRestaurantId :many
SELECT mc.id, mc.name, mc.restaurant_id, mc.created_at, mc.updated_at
FROM menu_categories mc
WHERE mc.restaurant_id = $1
ORDER BY mc.name;

-- name: GetMenuCategoryById :one
SELECT mc.id, mc.name, mc.restaurant_id, mc.created_at, mc.updated_at
FROM menu_categories mc
WHERE mc.id = $1;

-- name: CreateMenuCategory :one
INSERT INTO menu_categories (name, restaurant_id)
VALUES (sqlc.narg('name'), sqlc.narg('restaurant_id'))
RETURNING id, name, restaurant_id, created_at, updated_at;

-- name: DeleteMenuCategoryById :exec
DELETE FROM menu_categories
WHERE id = $1;
