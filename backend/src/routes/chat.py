from fastapi import Depends, HTTPException, Request, APIRouter, Body
from typing import List, Literal
from pydantic import BaseModel
import traceback
from ..utils import authenticate_and_get_user_details
from ..database.database import get_db
from ..database import food_planning_db
from ..database.redis_db import redis_db_services

router = APIRouter()

class Message(BaseModel):
    sender: Literal["user", "ai"]
    text: str

class ConversationRequest(BaseModel):
    conversation: List[Message]

class ConversationResponse(BaseModel):
    ai_reply: str


@router.post("/ai-chat-answer", response_model=ConversationResponse)
async def ai_chat_answer(req: ConversationRequest, request_obj: Request = None, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details["user_id"]

        user_meal_plan = await redis_db_services.get_meal_plan(user_id, cursor)
        user_grocery_list = await redis_db_services.get_groceries_by_user(user_id, cursor)
        user_food_planning_info = await redis_db_services.get_user_food_planning_info(user_id, cursor)
        user_health_alert = await redis_db_services.get_health_alert(user_id, cursor)

        # Pull recent conversation messages separately (not cached)
        conversation = req.conversation

        # Dummy AI reply
        ai_reply = f"AI response using cached context for {user_id}"

        return {"ai_reply": ai_reply}
    
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")
