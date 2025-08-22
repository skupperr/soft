from .chain import *
from .info_pre_processing_for_llm import InfoPreProcessing

def all_meal_generator(user_records, available_groceries_of_user):
    pre = InfoPreProcessing()
    user_info_json = pre.format_user_records_for_llm_json(user_records)
    groceries_json = pre.format_groceries_for_llm_json(available_groceries_of_user)


    result = meal_plan_chain.invoke({
        "user_info": user_info_json,
        "available_groceries": groceries_json,
        "format_instructions": parser.get_format_instructions()
    })

    print("Meal generation completed!")

    return result.dict()

def change_meal_plan_query_validator(query):
    
    result = meal_change_validator_chain.invoke({
        "user_request": query,
        "format_instructions": meal_change_validator_parser.get_format_instructions()
    })

    return result

def change_meal_plan(user_records, available_groceries_of_user, query):

    pre = InfoPreProcessing()
    user_info_json = pre.format_user_records_for_llm_json(user_records)
    groceries_json = pre.format_groceries_for_llm_json(available_groceries_of_user)

    result = meal_change_chain.invoke({
        "user_info": user_info_json,
        "available_groceries": groceries_json,
        "user_request": query,
        "format_instructions": meal_change_parser.get_format_instructions()
    })

    return result