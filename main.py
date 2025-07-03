from contextlib import asynccontextmanager

from sqlmodel import Session
from fastapi import FastAPI, Depends

from model.database import create_db_and_tables, get_session
from sqlalchemy import text
import numpy as np

from utils.clustering.ssfcm import ssfcm


@asynccontextmanager
async def lifespan(_: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)

def get_user_dish_summary(session: Session, user_id: int):
    result = session.exec(text("""
WITH user_dish AS (
  (
    SELECT
      DISTINCT ON (d.id) d.id,
      CASE
        WHEN COALESCE(r.rating, 0) - (
          SELECT
            AVG(r2.rating)
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
      LEFT JOIN reviews r ON r.dish_id = d.id
      AND r.user_id = :user_id
    ORDER BY
      d.id,
      r.created_at DESC
  )
  UNION
  (
    SELECT
      ui.dish_id AS id,
      CASE
        WHEN COUNT(ui.user_id) > 1 THEN 1
        ELSE 0
      END AS alpha,
      NULL AS "createdAt"
    FROM
      user_interactions ui
    WHERE
      ui.user_id = :user_id
    GROUP BY
      ui.dish_id
  )
),
user_dish_alpha AS (
  SELECT
    id,
    SUM(alpha) AS alpha
  FROM
    user_dish
  GROUP BY
    id
)
SELECT
  d.id,
  d.name,
  d.price,
  d.cuisine_id,
  c.w AS cuisine_weight,
  coalesce(AVG(r.rating), 0) AS avg_rating,
  COUNT(r.id) AS total_review,
  uda.alpha
FROM
  dishes d
  LEFT JOIN v_cuisine c ON c.id = d.cuisine_id
  LEFT JOIN reviews r ON r.dish_id = d.id
  LEFT JOIN user_dish_alpha uda ON uda.id = d.id
GROUP BY
  d.id,
  d.name,
  d.price,
  d.cuisine_id,
  c.w,
  uda.alpha
    """).params(user_id=user_id))

    return [dict(row._mapping) for row in result]


@app.get("/api/recommend/{user_id}")
async def predict(user_id, session: Session = Depends(get_session)):
    result = get_user_dish_summary(session=session, user_id=user_id)
    # Convert to NumPy array for clustering
    data = np.array([
      [
        row.get("price", 0),
        row.get("cuisine_weight", 0),
        float(row.get("avg_rating", 0)),
        row.get("total_review", 0)
      ]
      for row in result
    ])

    # Define initial membership matrix u_bar
    u_bar = np.array([
      [0.6 if row.get("alpha", 0) > 0 else 0, 0]
      for row in result
    ])

    # Call soft subspace fuzzy c-means
    u, v = ssfcm(data, c=2, m=2, max_iter=1000, eps=1e-5, u_bar=u_bar)

    # Assign cluster score (membership degree) to each result item
    for i, row in enumerate(result):
      row["score"] = u[i][0]  # Score for first cluster (you can choose which one)

    # Filter results with score > 0.5
    filtered_result = [row for row in result if row.get("score", 0) > 0.5]
    # Sort by score in descending order
    response = {
        "user_id": user_id,
        "recommendations": filtered_result
    }
    return response