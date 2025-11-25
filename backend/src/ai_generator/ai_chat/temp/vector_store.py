# vector_store.py
from langchain_chroma import Chroma  # Updated import

def get_vector_collection():
    from .embedding_services import GeminiEmbeddings
    gemini_embeddings = GeminiEmbeddings()
    
    return Chroma(
        collection_name="user_vectors",
        embedding_function=gemini_embeddings,
        persist_directory="./chroma_store"
    )

# Initialize the collection lazily
vector_collection = None

def get_vector_store():
    global vector_collection
    if vector_collection is None:
        vector_collection = get_vector_collection()
    return vector_collection