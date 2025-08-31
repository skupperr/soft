from fastapi_cache.decorator import cache
from ...database import db

def user_key_builder(func, namespace, request, response, *args, **kwargs):
    actual_args = kwargs.get('args', ())
    
    if actual_args and len(actual_args) > 0:
        user_id = actual_args[0]
        func_name = func.__name__  # distinguish between meal_plan, groceries, etc.
        print(func_name)
        key = f"{namespace}:{func_name}:{user_id}"
        print(f"[CACHE KEY] {key}")
        return key
    else:
        raise ValueError(f"user_id is required for caching. args: {args}, kwargs: {kwargs}")

    
    
@cache(expire=300, key_builder=user_key_builder)
async def get_meal_plan(user_id: str, cursor):
    print(f"[CACHE MISS] Fetching from DB for user: {user_id}")
    # Only hits MySQL if not cached
    meal_plan = await db.get_meal_plan(cursor, user_id)

    return meal_plan


@cache(expire=300, key_builder=user_key_builder)
async def get_user_food_planning_info(user_id: str, cursor):
    print(f"[CACHE MISS] Fetching from DB for user: {user_id}")
    user_food_plan_info = await db.get_user_food_planning_info(cursor, user_id)

    return user_food_plan_info


@cache(expire=300, key_builder=user_key_builder)
async def get_groceries_by_user(user_id: str, cursor):
    print(f"[CACHE MISS] Fetching from DB for user: {user_id}")
    user_groceries = await db.get_groceries_by_user(cursor, user_id)

    return user_groceries


@cache(expire=300, key_builder=user_key_builder)
async def get_health_alert(user_id: str, cursor):
    print(f"[CACHE MISS] Fetching from DB for user: {user_id}")
    health_alerts = await db.get_health_alert(cursor, user_id)

    return health_alerts

