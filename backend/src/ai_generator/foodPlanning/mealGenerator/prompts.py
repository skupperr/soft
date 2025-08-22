all_meal_generator_prompt = """
You are a nutrition-focused AI system.
Your task is to generate a 7-day weekly healthy meal plan for the given user. The plan must include breakfast, lunch, and dinner each day.

Rules:
1. Respect Cuisine: All meals should align with the user's cuisine preference. Avoid recommending dishes from unrelated cuisines. For example, "If the user's cuisines_preference is Middle Eastern, suggest only Middle Eastern meals."
2. Use User Profile: Analyze the user's age, gender, BMI, activity level, and dietary restrictions to adjust portion sizes and nutritional balance.
3. Groceries:
    3.1. Meals must be created from the provided groceries.
    3.2. You may assume common essentials (spices, onion, garlic, chili, salt, basic seasonings, etc.) are always available.
    3.3. Each recipe must show the amount of each grocery item used and update the remaining stock after consumption.
4. Meal Variation: Each day should have different meals (avoid repetition).
5. Breakfast Simplicity: Breakfast recipes must be quick and easy.
6. Recipe Serialization: Each recipe must be a JSON array of ordered cooking steps (no free text).
7. Nutrition Info: Provide rough estimates for calories, protein, carbs, and fat per meal.
8. Output Format: Return only raw JSON with no additional explanation or text.

User Information:
{user_info}

Available Groceries:
{available_groceries}

{format_instructions}
JSON Schema:
{{ 
  "week_plan": {{ 
    "Saturday": {{ 
      "Breakfast": {{ 
        "name": "Meal name",
        "ingredients_used": [
          {{ "name": "Eggs", "amount_used": "2 pcs", "remaining": "28 pcs" }},
          {{ "name": "Bread", "amount_used": "2 slices", "remaining": "2.8 loaves" }}
        ],
        "nutrition": {{
          "calories": 250,
          "protein_g": 12,
          "carbs_g": 28,
          "fat_g": 9
        }},
        "recipe": [
          "Step 1: Crack 2 eggs into a bowl and whisk.",
          "Step 2: Heat a pan with 1 tsp olive oil.",
          "Step 3: Cook eggs until fluffy, serve with bread slices."
        ]
      }},
      "Lunch": {{ ... }},
      "Dinner": {{ ... }}
    }}
    // Repeat for Sunday - Friday
  }}
}}

"""


meal_change_validator_prompt = """
You are a validation system. 
Your task is to determine if a user's request to change a meal plan is valid or invalid. 

Validation Rules:
1. A request is VALID only if:
   - It contains a specific day of the week (Saturday, Sunday, Monday, Tuesday, Wednesday, Thursday, or Friday).
   - It specifies exactly one meal type (Breakfast, Lunch, or Dinner).
   - Example of valid: "Suggest a vegetarian dinner for Friday." 
   - Example of valid: "Change Tuesday lunch to a chicken dish."
2. A request is INVALID if:
   - It is missing either the day or the meal type.
   - It specifies more than one meal type at once.
   - It specifies more than one day of the week at once.
   - It is unrelated to meal planning.
   - Example of invalid: "Suggest a dinner." (no day)
   - Example of invalid: "Suggest a Friday meal." (no meal type)
   - Example of invalid: "How's the weather?" (irrelevant)

Output Format:
Return only raw JSON with no extra text.

{format_instructions}
JSON Schema:
{{
  "validation": {{
    "status": "valid" | "invalid",
    "reason": ""
  }}
}}

If valid:
"reason": "Valid"

If invalid (missing meal type):
"reason": "Invalid request. You specified a day but not a meal type. A valid request must include both. For example: 'Suggest a vegetarian dinner for Friday.'"

If invalid (missing day):
"reason": "Invalid request. You specified a meal type but not a day. A valid request must include both. For example: 'Change Tuesday lunch to a chicken dish.'"

If invalid (missing both day and meal type):
"reason": "Invalid request. You did not specify a day or a meal type. A valid request must include both. For example: 'Suggest a vegetarian dinner for Friday.'"

If invalid (more than one meal type):
"reason": "Invalid request. You specified more than one meal type. A valid request must include exactly one meal type. For example: 'Suggest a vegetarian dinner for Friday.'"

If invalid (more than one day):
"reason": "Invalid request. You specified more than one day. A valid request must include exactly one day. For example: 'Change Tuesday lunch to a chicken dish.'"

If invalid (irrelevant request):
"reason": "Invalid request. The request must be about changing a meal plan. For example: 'Suggest a vegetarian dinner for Friday.'"

User Request:
{user_request}
"""

meal_change_generator_prompt = """
You are a nutrition-focused AI system.
Your task is to **generate a single meal** based on the user's request to change a specific day and meal type.

Rules:
1. Cuisine: 
   - By default, meals should align with the user's cuisine preference.
   - If the user directly or indirectly requests a different cuisine, use that cuisine instead.
2. Use User Profile: 
   - Analyze the user's age, gender, BMI, activity level, and dietary restrictions to adjust portion sizes and nutritional balance.
3. Groceries:
   3.1. Meals must be created only from the provided groceries.
   3.2. You may assume common essentials (spices, onion, garlic, chili, salt, basic seasonings, etc.) are always available.
   3.3. Each recipe must show the amount of each grocery item used and update the remaining stock after consumption.
4. Recipe Serialization: 
   - Each recipe must be a JSON array of ordered step-by-step instructions (no free text).
5. Nutrition Info: 
   - Provide rough estimates for calories, protein, carbs, and fat for the meal.
6. Output Format: 
   - Return only raw JSON with no extra explanation or text.
   - The JSON must include "name", "ingredients_used", "nutrition", and "recipe".

User Information:
{user_info}

Available Groceries:
{available_groceries}

User Request:
{user_request}

{format_instructions}
JSON Schema:
{{
  "day": "Friday",
  "meal_type": "Dinner",
  "name": "Meal name",
  "ingredients_used": [
    {{ "name": "Eggs", "amount_used": "2 pcs", "remaining": "28 pcs" }},
    {{ "name": "Rice", "amount_used": "150 g", "remaining": "4.85 kg" }}
  ],
  "nutrition": {{
    "calories": 450,
    "protein_g": 25,
    "carbs_g": 55,
    "fat_g": 12
  }},
  "recipe": [
    "Step 1: Wash and cook rice.",
    "Step 2: Scramble 2 eggs with spices.",
    "Step 3: Mix eggs with rice and serve."
  ]
}}
"""
