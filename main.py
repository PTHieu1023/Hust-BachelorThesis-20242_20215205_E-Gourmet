from contextlib import asynccontextmanager

from sqlmodel import Session
from fastapi import FastAPI, Depends

from db.database import get_session
import numpy as np
import logging

from services import recommendation as rcm_service
from utils.clustering.data_processor import normalize_data
from utils.clustering.ssfcm import ssfcm, evaluate_clustering

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(_: FastAPI):
    yield


app = FastAPI(lifespan=lifespan)



@app.get("/api/recommend/{user_id}")
async def predict(user_id, session: Session = Depends(get_session)):
    result = rcm_service.get_user_dish_summary(session=session, user_id=user_id)
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

    normalized_data, _ = normalize_data(data)
    
    # Define initial membership matrix u_bar
    u_bar = np.array([
      [0.6 if row.get("alpha", 0) > 0 else 0, 0]
      for row in result
    ])

    # Call soft subspace fuzzy c-means
    u, v = ssfcm(normalized_data, c=2, m=2, max_iter=1000, eps=1e-5, u_bar=u_bar)

    # Assign cluster score (membership degree) to each result item
    for i, row in enumerate(result):
      row["score"] = float(u[i][0])

    # Filter results with score > 0.5
    filtered_result = [row for row in result if row.get("score", 0) > 0.5]
    
    # Sort by score in descending order
    filtered_result.sort(key=lambda x: x.get("score", 0), reverse=True)
    
    # Evaluate clustering quality
    labels = np.argmax(u, axis=1)
    evaluation_metrics = evaluate_clustering(normalized_data, labels)
    
    rcm_service.save_recommendations(session, user_id, filtered_result)
    
    response = {
        "user_id": user_id,
        "recommendations": filtered_result,
        "evaluation": evaluation_metrics,
        "cluster_centers": v.tolist() if hasattr(v, "tolist") else None,
        "total_items": len(result),
        "recommended_items": len(filtered_result)
    }
    return response