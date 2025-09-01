# ai_answer.py
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from dotenv import load_dotenv

load_dotenv()



def build_rag_chain():
    """
    Modern LangChain approach using RunnableSequence (prompt | llm | parser)
    """
    prompt = PromptTemplate(
        input_variables=["question", "context"],
        template="""You are a helpful AI assistant.
Use the provided context to answer the user's question concisely and clearly.

Context:
{context}

Question:
{question}

Answer:"""
    )

    # LLM
    llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash-001")
    
    # Output parser
    output_parser = StrOutputParser()
    
    # Create the chain using the new RunnableSequence approach
    chain = prompt | llm | output_parser

    print(prompt)
    
    return chain