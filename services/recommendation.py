from sqlalchemy import text
from sqlmodel import Session, select, delete
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_user_dish_summary(session: Session, user_id: int):
    result = session.exec(text("""
                               WITH user_dish AS ((SELECT DISTINCT
                                                   ON (d.id) d.id,
                                                       CASE
                                                       WHEN COALESCE (r.rating, 0) - (
                                                       SELECT
                                                       AVG (r2.rating)
                                                       FROM
                                                       reviews r2
                                                       WHERE
                                                       r2.user_id = :user_id
                                                       ) >= 0 THEN 1
                                                       ELSE 0
                                                       END AS alpha,
                                                       r.created_at
                                                   FROM
                                                       dishes d
                                                       LEFT JOIN reviews r
                                                   ON r.dish_id = d.id
                                                       AND r.user_id = :user_id
                                                   ORDER BY
                                                       d.id,
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
                                        uda.alpha
                               """).params(user_id=user_id))

    return [dict(row._mapping) for row in result]


def save_recommendations(session: Session, user_id: str, recommendations: list):
    try:
        # Delete existing recommendations
        delete_query = """
            DELETE FROM user_recommendation 
            WHERE user_id = :user_id
        """
        session.exec(text(delete_query).params(user_id=user_id))

        # Add new recommendations
        now = datetime.now()
        for item in recommendations:
            insert_query = """
                INSERT INTO user_recommendation (user_id, dish_id, score, created_at)
                VALUES (:user_id, :dish_id, :score, :created_at)
            """
            session.exec(
                text(insert_query),
                {
                    "user_id": user_id,
                    "dish_id": item["id"],
                    "score": float(item["score"]),
                    "created_at": now,
                },
            )

        session.commit()
        logger.info(f"Saved {len(recommendations)} recommendations for user {user_id}")
        return True
    except Exception as e:
        session.rollback()
        logger.error(f"Error saving recommendations: {e}")
        return False