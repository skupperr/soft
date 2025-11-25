# embedding_services.py
import json
import google.generativeai as genai
from langchain.embeddings.base import Embeddings
from dotenv import load_dotenv

load_dotenv()

embedding_model = "models/embedding-001"

class GeminiEmbeddings(Embeddings):
    """LangChain wrapper for Gemini embeddings."""
    
    def embed_documents(self, texts):
        embeddings = []
        for t in texts:
            resp = genai.embed_content(model=embedding_model, content=t)
            embedding = resp["embedding"]
            # Ensure it's a flat list of floats
            if isinstance(embedding, list) and len(embedding) > 0:
                if isinstance(embedding[0], list):
                    # If nested, flatten it
                    embedding = embedding[0]
            embeddings.append(embedding)
        return embeddings

    def embed_query(self, text):
        resp = genai.embed_content(model=embedding_model, content=text)
        embedding = resp["embedding"]
        # Ensure it's a flat list of floats
        if isinstance(embedding, list) and len(embedding) > 0:
            if isinstance(embedding[0], list):
                # If nested, flatten it
                embedding = embedding[0]
        return embedding

from langchain.schema import Document

async def update_user_vectors(user_id: str, data_dict: dict):
    # Import here to avoid circular import and get the vector store properly
    from ..ai_chat.vector_store import get_vector_store
    
    texts, metadatas, ids = [], [], []

    for key, value in data_dict.items():
        if value:  # Only process non-empty values
            text = f"{key}: {json.dumps(value) if isinstance(value, (dict, list)) else str(value)}"
            texts.append(text)
            ids.append(f"{user_id}_{key}")
            metadatas.append({"user_id": user_id, "type": key})

    if texts:  # Only add if we have texts to add
        vector_store = get_vector_store()
        
        # Delete existing documents for this user's structured data first
        try:
            # Get existing IDs to delete
            existing_ids = [f"{user_id}_{key}" for key in data_dict.keys()]
            vector_store.delete(ids=existing_ids)
        except Exception as e:
            print(f"Note: Could not delete existing vectors (might not exist): {e}")
        
        # Add new texts
        vector_store.add_texts(
            texts=texts,
            metadatas=metadatas,
            ids=ids
        )
        print(f"✅ Updated {len(texts)} structured data vectors for user {user_id}")