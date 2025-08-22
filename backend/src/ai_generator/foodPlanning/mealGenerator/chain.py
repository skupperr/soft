from langchain.output_parsers import PydanticOutputParser
from langchain.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from .schema import WeeklyMealPlan, MealChangeValidator, OneTimeMeal
from .prompts import all_meal_generator_prompt, meal_change_validator_prompt, meal_change_generator_prompt
from dotenv import load_dotenv

load_dotenv()

# Initialize Gemini
model = ChatGoogleGenerativeAI(model="gemini-2.0-flash-001")


# Parser
parser = PydanticOutputParser(pydantic_object=WeeklyMealPlan)
# Prompt
prompt_template = ChatPromptTemplate.from_template(all_meal_generator_prompt)
# Chain
meal_plan_chain = prompt_template | model | parser


### Changing Meal validation
meal_change_validator_parser = PydanticOutputParser(pydantic_object=MealChangeValidator)
meal_change_validator_prompt_temp = ChatPromptTemplate.from_template(meal_change_validator_prompt)
meal_change_validator_chain = meal_change_validator_prompt_temp | model | meal_change_validator_parser


### Changing Meal
meal_change_parser = PydanticOutputParser(pydantic_object=OneTimeMeal)
meal_change_prompt_temp = ChatPromptTemplate.from_template(meal_change_generator_prompt)
meal_change_chain = meal_change_prompt_temp | model | meal_change_parser