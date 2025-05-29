from contextlib import asynccontextmanager

from sqlmodel import Session
from fastapi import FastAPI, Depends

from model.database import create_db_and_tables, get_session
from sqlalchemy import text
from model.model import Dish, Cuisine, Review, User, UserInteraction, UserRecommendation


@asynccontextmanager
async def lifespan(_: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)

def get_user_dish_summary(session: Session, user_id: int):
    result = session.exec(text("""
        WITH user_dish AS (
            (
                SELECT DISTINCT ON (d.id)
                    d.id,
                    CASE 
                        WHEN COALESCE(r.rating, 0) - (
                            SELECT AVG(r2.rating)
                            FROM "Review" r2
                            WHERE r2."userId" = :user_id
                        ) >= 0 THEN 1 ELSE 0 
                    END AS alpha,
                    r."createdAt"
                FROM "Dish" d
                LEFT JOIN "Review" r ON r."dishId" = d.id AND r."userId" = :user_id
                ORDER BY d.id, r."createdAt" DESC
            )
            UNION
            (
                SELECT 
                    ui."dishId" AS id,
                    CASE 
                        WHEN COUNT(ui."userId") > 1 THEN 1 ELSE 0 
                    END AS alpha,
                    NULL AS "createdAt"
                FROM "UserInteraction" ui
                WHERE ui."userId" = :user_id
                GROUP BY ui."dishId"
            )
        ),

        user_dish_alpha AS (
            SELECT id, SUM(alpha) AS alpha
            FROM user_dish
            GROUP BY id
        )

        SELECT 
            d.id,
            d.name,
            d.price,
            d."cuisineId",
            c.weight AS cuisine_weight,
            AVG(r.rating) AS avg_rating,
            COUNT(r.id) AS total_review,
            uda.alpha
        FROM "Dish" d 
        LEFT JOIN "Cuisine" c ON c.id = d."cuisineId"
        LEFT JOIN "Review" r ON r."dishId" = d.id
        LEFT JOIN user_dish_alpha uda ON uda.id = d.id 
        GROUP BY d.id, d.name, d.price, d."cuisineId", c.weight, uda.alpha
    """).params(user_id=user_id))

    return [dict(row._mapping) for row in result]


@app.get("/api/recommend")
async def predict(session: Session = Depends(get_session)):
    result = get_user_dish_summary(session=session, user_id=21)

    return {"result": result}