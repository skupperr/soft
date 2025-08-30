from fastapi import Depends, HTTPException, Request, APIRouter, Body
from typing import List, Literal
from pydantic import BaseModel
import traceback
from ..utils import authenticate_and_get_user_details
from ..database.database import get_db
from ..database import db

router = APIRouter()

class Message(BaseModel):
    sender: Literal["user", "ai"]
    text: str

class ConversationRequest(BaseModel):
    conversation: List[Message]

class ConversationResponse(BaseModel):
    ai_reply: str


@router.post("/ai-chat-answer", response_model=ConversationResponse)
async def ai_chat_answer(req: ConversationRequest):

    conversation = req.conversation

    for i in conversation:
        print(i)

    # Here you would integrate your actual AI model / OpenAI call / LLM
    # For example, call OpenAI API with conversation messages
    # For demo, we just echo the last user message
    last_user_msg = next((m.text for m in reversed(conversation) if m.sender == "user"), "")
    ai_reply = f"This is a response to: {last_user_msg}"

    print(ai_reply)

    return {"ai_reply": ai_reply}