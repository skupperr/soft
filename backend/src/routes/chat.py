from fastapi import Depends, HTTPException, Request, APIRouter, Body
from typing import List, Literal
from pydantic import BaseModel
import traceback
import json
from ..ai_generator.ai_chat.ai_answer import build_rag_chain
from ..utils import authenticate_and_get_user_details
from ..database.database import get_db
from ..database import food_planning_db
from ..database.redis_db import redis_db_services

from ..ai_generator.ai_chat.vector_reranker import VectorReranker

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

        domains = [
            {"name": "user_meal_plan", "desc": user_meal_plan},
            {"name": "user_grocery_list", "desc": user_grocery_list},
            {"name": "user_food_planning_info", "desc": user_food_planning_info},
            {"name": "user_health_alert", "desc": user_health_alert}
        ]

        # query = req.conversation[-1].get("content", "")
        query = str(req.conversation[-1])
        vector_ranker = VectorReranker()
        relevant_domains = vector_ranker.rerank(query, domains)

        top_domains = relevant_domains[:2]


        retrieved_context = []
        for td in top_domains:
            for d in domains:
                if d["name"] == td["name"]:
                    retrieved_context.append({
                        "name": d["name"],
                        "desc": d["desc"]
                    })

        # Convert to string (pretty formatted for LLM)
        retrieved_context = "\n\n".join(
            f"{d['name']}:\n{json.dumps(d['desc'], indent=2)}"
            for d in retrieved_context
        )

        # structured_context = (
        #     f"Meal Plan: {user_meal_plan}\n"
        #     f"Groceries: {user_grocery_list}\n"
        #     f"Food Records: {user_food_planning_info}\n"
        #     f"Health Alerts: {user_health_alert}"
        # )
        
        # vector_store = get_vector_store()
        
        # retriever = vector_store.as_retriever(
        #     search_kwargs={"k": 2, "filter": {"user_id": user_id}}
        # )
        
        # query = req.conversation[-1]
        # retrieved_docs = retriever.invoke(query)  # Updated method call
        # retrieved_context = "\n".join([doc.page_content for doc in retrieved_docs])
        
        # print(retrieved_context)

        # Take the last 20 messages (10 user + 10 ai)
        messages = req.conversation[-20:]

        # Format into a string for context
        conversation_context = "\n".join(
            f"{msg.sender}: {msg.text}" for msg in messages
        )

        chain = build_rag_chain()

        combined_context = retrieved_context
        ai_reply = chain.invoke({"question": query, "context": combined_context, "conversation_context": conversation_context})
        
        return {"ai_reply": ai_reply}
        
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")
