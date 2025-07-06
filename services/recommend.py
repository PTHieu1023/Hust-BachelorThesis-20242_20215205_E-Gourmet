import json

from sqlalchemy import text
from sqlmodel import Session
from datetime import datetime

from libs import sqlm
import logging

import numpy as np

from libs import ssfcm, data_processor

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_available_recommended_items(session, user_id: int):
    sql = sqlm.get_query("get_available_recommended_items")
    params = {"user_id": user_id}
    result = session.exec(text(sql).params(**params)).all()
    return [dict(row._mapping) for row in result] if result else []

def process_clustering(session, user_id: str):
    try:
        start = datetime.now()

        # Initialize the generating session
        log_id = _init_generating_session(session, user_id, start)

        # Get dish data for the user recommendation
        result = _get_user_dish_summary(session=session, user_id=user_id)
        data = np.array([
            [
                row.get("price", 0),
                row.get("cuisine_weight", 0),
                float(row.get("avg_rating", 0)),
                row.get("total_review", 0)
            ]
            for row in result
        ])
        # Normalize the data
        data, _ = data_processor.normalize_data(data)

        u_bar = np.array([
            [0.6 if row.get("alpha", 0) > 0 else 0, 0]
            for row in result
        ])
        u, v, it = ssfcm.clustering(data, c=2, m=2, max_iter=1000, eps=1e-5, u_init=u_bar)
        for i, row in enumerate(result):
            row["score"] = float(u[i][0])

        # Filter and sort the results based on the score
        recommend_items = [row for row in result if row.get("score", 0) > 0.5]
        recommend_items.sort(key=lambda x: x.get("score", 0), reverse=True)

        _save_recommendations(session, recommend_items, log_id)

        duration = (datetime.now() - start).microseconds / 1000
        session_result = {
            "session_id": log_id,
            "status": 1,
            "evaluation": json.dumps(ssfcm.evaluate_clustering(data, np.argmax(u, axis=1)), default=str),
            "process_duration": duration,
            "number_cluster": int(v.shape[0]),
            "memberships": u.tolist(),
            "centroids": v.tolist(),
            "iteration": int(it)
        }

        log_sql = sqlm.get_query("update_ssfcm_log")
        session.exec(text(log_sql).params(**session_result))
        result = get_available_recommended_items(session=session, user_id=user_id)
        session.commit()
        return result
    except Exception as e:
        session.rollback()
        logger.error(f"Error during clustering process: {e}")

def _init_generating_session(session, user_id: int, start: datetime = None):
    sql = sqlm.get_query("create_ssfcm_session")
    params = {"user_id": user_id, "status": 0, "created_at": start or datetime.now()}
    result = session.exec(text(sql).params(**params)).first()
    return result[0] if result else []

def _get_user_dish_summary(session: Session, user_id: int):
    sql = sqlm.get_query("get_user_dish_summary")
    params = {"user_id": user_id}
    result = session.exec(text(sql).params(**params)).all()
    return [dict(row._mapping) for row in result]

def _save_recommendations(session: Session, recommendations: list, log_id: int = None):
    try:
        logger.info("Starting to save recommendations for user")
        insert_query = sqlm.get_query("insert_user_recommendation")
        for item in recommendations:
            params = {
                "dish_id": item.get("id"),
                "user_id": item.get("user_id"),
                "score": item.get("score", 0),
                "log_id": log_id
            }
            session.exec(text(insert_query).params(**params))
        logger.info(f"Saved {len(recommendations)} recommendations session {log_id}")
        return True
    except Exception as e:
        session.rollback()
        logger.error(f"Error saving recommendations: {e}")
        return False