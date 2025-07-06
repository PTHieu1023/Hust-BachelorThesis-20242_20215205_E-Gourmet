from fastapi import APIRouter, BackgroundTasks
from fastapi.params import Depends

from config import database
from services import recommend
router = APIRouter()

@router.get("/api/recommend/{user_id}")
async def predict(user_id, session=Depends(database.get_session)):
    recommended_items = recommend.get_available_recommended_items(session, user_id)
    if recommended_items and len(recommended_items) > 0:
        return recommended_items if recommended_items[0].get("status") == 1 else {"message": "Generating recommendations, please wait."}
    return recommend.process_clustering(session, user_id)