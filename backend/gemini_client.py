import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Embedding model
EMBED_MODEL = "models/text-embedding-004"

# Chat model
LLM_MODEL = "models/gemini-1.5-flash"


def get_embeddings(texts: list[str]):
    """Return list of embedding vectors."""
    embeddings = []
    for t in texts:
        emb = genai.embed_content(
            model=EMBED_MODEL,
            content=t
        )["embedding"]
        embeddings.append(emb)
    return embeddings


def generate_answer(query: str, context: str):
    """Generate answer using Gemini with context."""
    prompt = f"""
    You are a RAG assistant. Use the following context to answer the question.

    Context:
    {context}

    Question:
    {query}

    Answer:
    """

    response = genai.GenerativeModel(LLM_MODEL).generate_content(prompt)
    return response.text
