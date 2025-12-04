import os
from dotenv import load_dotenv
import chromadb

load_dotenv()

client = chromadb.CloudClient(
    api_key=os.getenv("CHROMA_API_KEY"),
    tenant=os.getenv("CHROMA_TENANT_ID"),
    database=os.getenv("CHROMA_DATABASE")
)

def get_user_collection(user_id: str):
    """
    Create or return a unique collection for each user.
    """
    name = f"rag_user_{user_id}"
    return client.get_or_create_collection(
        name=name,
        metadata={"hnsw:space": "cosine"}
    )
