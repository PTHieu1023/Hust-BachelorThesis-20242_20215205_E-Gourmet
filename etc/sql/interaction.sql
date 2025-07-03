-- name: AddInteraction :exec
INSERT  INTO user_interactions(user_id, dish_id)
VALUES (@user_id, @dish_id);