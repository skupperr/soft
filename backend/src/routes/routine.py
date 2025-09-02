from fastapi import Depends, HTTPException, Request, APIRouter, Body
from typing import List
from pydantic import BaseModel
import traceback
from ..utils import authenticate_and_get_user_details
from ..database.database import get_db
from ..database import routine_db
import time, json
from ..database.redis_db import redis_db_services

router = APIRouter()

    
class RoutineInput(BaseModel):
    routine_name: str
    selectedDays: List[str]
    startTime: str
    endTime: str
    color: str
    description: str | None = None


@router.post('/add_routine')
async def add_routine(
    input: RoutineInput,
    request_obj: Request = None,
    db_dep=Depends(get_db)
):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details.get("user_id")
        
        print("Received routine input:", input)

        # Store routine
        routine_id = await routine_db.store_weekly_routine(cursor, conn, user_id, input.dict())

        # Store selected days
        await routine_db.store_routine_days(cursor, conn, routine_id, input.selectedDays, user_id)

        return {"status": "success", "routine_id": routine_id}

    except Exception as e:
        print("Error in storing routine:", str(e))
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")
    
@router.get('/get_routines')
async def get_routines(request_obj: Request = None, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details.get("user_id")

        routines = await redis_db_services.get_user_routines(user_id, cursor)
        

        return {"status": "success", "routines": routines}

    except Exception as e:
        print("Error retrieving routines:", str(e))
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")