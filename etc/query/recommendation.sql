-- Query: get_user_dish_summary
WITH user_dish AS ((SELECT DISTINCT
    ON (d.id) d.id,
              CASE
                  WHEN COALESCE(r.rating, 0) - (SELECT AVG(r2.rating)
                                                FROM reviews r2
                                                WHERE r2.user_id = :user_id) >= 0 THEN 1
                  ELSE 0
                  END AS alpha,
              r.created_at
                    FROM dishes d
                             LEFT JOIN reviews r
                                       ON r.dish_id = d.id
                                           AND r.user_id = :user_id
                    ORDER BY d.id,
                             r.created_at DESC)
                   UNION
                   (SELECT ui.dish_id AS id,
                           CASE
                               WHEN COUNT(ui.user_id) > 1 THEN 1
                               ELSE 0
                               END    AS alpha,
                           NULL       AS "createdAt"
                    FROM user_interactions ui
                    WHERE ui.user_id = :user_id
                    GROUP BY ui.dish_id)),
     user_dish_alpha AS (SELECT id,
                                SUM(alpha) AS alpha
                         FROM user_dish
                         GROUP BY id)
SELECT d.id,
       d.name,
       d.price,
       d.cuisine_id,
       d.restaurant_id,
       c.w                        AS cuisine_weight,
       coalesce(AVG(r.rating), 0) AS avg_rating,
       COUNT(r.id)                AS total_review,
       uda.alpha
FROM dishes d
         LEFT JOIN v_cuisine c ON c.id = d.cuisine_id
         LEFT JOIN reviews r ON r.dish_id = d.id
         LEFT JOIN user_dish_alpha uda ON uda.id = d.id
GROUP BY d.id,
         d.name,
         d.price,
         d.cuisine_id,
         c.w,
         uda.alpha;

-- Query: get_available_recommended_items
SELECT fcm.status      as status,
       d.id            as "dishId",
       d.name          as "dishName",
       d.price         as "price",
       r.id            as "restaurantId",
       r.name          as "restaurantName",
       d.images::jsonb as images,
       coalesce(avg(rv.rating), 0)  AS rating,
       count(rv.id)    AS "reviewCount"
FROM ssfcm_logs fcm
LEFT JOIN user_recommendation ur on fcm.id = ur.log_id
LEFT JOIN dishes d ON ur.dish_id = d.id
LEFT JOIN restaurants r ON d.restaurant_id = r.id
LEFT JOIN reviews rv ON rv.dish_id = d.id
WHERE fcm.user_id = :user_id
  and fcm.created_at > now() - interval '1 minute'
group by fcm.id, fcm.status, d.id, d.name, d.price, r.id, r.name, d.images::jsonb;

-- Query: create_ssfcm_session
INSERT INTO ssfcm_logs (user_id, status, created_at)
VALUES (:user_id, :status, :created_at)
RETURNING id;

-- Query: update_ssfcm_log
UPDATE ssfcm_logs
SET evaluation       = :evaluation,
    process_duration = :process_duration,
    number_cluster   = :number_cluster,
    memberships      = :memberships,
    status           = :status,
    centroids        = :centroids,
    iteration        = :iteration
WHERE id = :session_id;

-- Query: insert_user_recommendation
INSERT INTO user_recommendation (user_id, dish_id, score, log_id)
VALUES (:user_id, :dish_id, :score, :log_id);

