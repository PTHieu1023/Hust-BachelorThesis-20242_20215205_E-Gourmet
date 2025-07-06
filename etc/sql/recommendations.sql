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

-- name: GetUserRecommendations :many
SELECT
    ur.id,
    ur.user_id,
    ur.dish_id,
    ur.score,
    ur.created_at,
    d.name as dish_name,
    d.description as dish_description,
    d.price,
    r.name as restaurant_name,
    r.username as restaurant_username,
    c.name as cuisine_name
FROM user_recommendation ur
JOIN dishes d ON ur.dish_id = d.id
JOIN restaurants r ON d.restaurant_id = r.id
LEFT JOIN cuisines c ON d.cuisine_id = c.id
WHERE ur.user_id = $1
ORDER BY ur.created_at DESC, ur.score DESC;

-- name: GetLatestUserRecommendation :one
SELECT
    COALESCE(MAX(created_at), '1970-01-01'::timestamp) as latest_created_at
FROM user_recommendation
WHERE user_id = $1;

-- name: DeleteOldUserRecommendations :exec
DELETE FROM user_recommendation
WHERE user_id = $1;