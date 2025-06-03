-- name: GetAllCuisine
SELECT
    c.id,
    c.name,
    coalesce(c.parent_id, 0) as parent_id,
    c.branch_order,
    c.weight,
    c.image_url
FROM cuisines c
order by parent_id, branch_order

-- name: AddCuisine
WITH RECURSIVE cuisine_tree AS (
    SELECT
        id,
        coalesce(parent_id, 0) as parent_id,
        1 AS level,
        branch_order,
        weight
    FROM cuisines
    WHERE parent_id  is null
    UNION ALL
    SELECT
        c.id,
        c.parent_id,
        ct.level + 1 as level,
        c.branch_order,
        c.weight
    FROM cuisines c
    INNER JOIN cuisine_tree ct ON c.parent_id = ct.id
),
parent_cuisine as(
    select
        ct.id,
        ct."level",
        coalesce(max(c.branch_order), 0) + 1 as next_order,
        ct.weight
    from cuisine_tree ct
    left join cuisines c on c.parent_id = ct.id
    where ct.id = 1
    group by ct.id, ct."level", ct.weight
)
INSERT INTO
    cuisines (name, parent_id, branch_order, weight, image_url
)
SELECT
    :name,
    :parent_id,
    pc.next_order,
    pc.weight + pc.next_order * POWER(0.01, pc.level + 1),
    :image_url
FROM parent_cuisine pc
RETURNING *
