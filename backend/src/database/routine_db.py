from fastapi import HTTPException
import json
from datetime import timedelta, datetime

# ✅ Store weekly routine
async def store_weekly_routine(cursor, conn, user_id, routine_data):
    query = """
        INSERT INTO weekly_routines (user_id, routine_name, start_time, end_time, color, description)
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    await cursor.execute(query, (
        user_id,
        routine_data["routine_name"],
        routine_data["startTime"],
        routine_data["endTime"],
        routine_data["color"],
        routine_data["description"]
    ))
    await conn.commit()
    return cursor.lastrowid   # return routine_id


# ✅ Store routine days
async def store_routine_days(cursor, conn, routine_id, selected_days):
    query = "INSERT INTO routine_days (routine_id, day_of_week) VALUES (%s, %s)"
    for day in selected_days:
        await cursor.execute(query, (routine_id, day))
    await conn.commit()



async def get_user_routines(cursor, user_id):
    query = """
            SELECT r.routine_id, r.routine_name, r.start_time, r.end_time, r.color, r.description,
                   GROUP_CONCAT(d.day_of_week) as days
            FROM weekly_routines r
            LEFT JOIN routine_days d ON r.routine_id = d.routine_id
            WHERE r.user_id = %s
            GROUP BY r.routine_id
    """
    await cursor.execute(query, (user_id,))
    rows = await cursor.fetchall()
    
    routines = []
    for row in rows:
        def format_time(value):
            if value is None:
                return None
            if isinstance(value, timedelta):
                # Convert timedelta to HH:MM format
                total_seconds = value.seconds
                hours = total_seconds // 3600
                minutes = (total_seconds % 3600) // 60
                return f"{hours:02}:{minutes:02}"
            return str(value)

        routines.append({
            "routine_id": row["routine_id"],
            "routine_name": row["routine_name"],
            "start_time": format_time(row["start_time"]),
            "end_time": format_time(row["end_time"]),
            "color": row["color"],
            "description": row["description"],
            "days": row["days"].split(",") if row["days"] else []
        })
    return routines

