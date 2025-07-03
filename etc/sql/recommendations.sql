-- name: GetTopRatedDishes :many
SELECT
    d.id,
    d.name,
    d.description,
    d.price,
    d.restaurant_id,
    r.name as restaurant_name,
    r.username as restaurant_username,
    d.cuisine_id,
    c.name as cuisine_name,
    COALESCE(AVG(rev.rating), 0) as average_rating,
    COUNT(rev.id) as review_count
FROM dishes d
JOIN restaurants r ON d.restaurant_id = r.id
LEFT JOIN cuisines c ON d.cuisine_id = c.id
LEFT JOIN reviews rev ON d.id = rev.dish_id
WHERE r.is_approved = true
GROUP BY d.id, d.name, d.description, d.price, d.restaurant_id, r.name, r.username, d.cuisine_id, c.name
HAVING COUNT(rev.id) > 0
ORDER BY average_rating DESC, review_count DESC
LIMIT $1;