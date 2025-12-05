from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import io
from embedder import embed_text
from loader import extract_text, chunk_text
from graph import app_graph
from db import Base, engine, SessionLocal
from auth.models import  Chat, Message
from auth.routes import router as auth_router
from chroma_client import get_user_collection

# ------------------ FASTAPI SETUP ------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

@app.on_event("startup")
def create_tables_if_not_exist():
    Base.metadata.create_all(bind=engine)



# ------------------ UPLOAD DOCUMENT ------------------
@app.post("/upload")
async def upload(user_id: str, file: UploadFile = File(...)):
    try:
        data = await file.read()
        file_stream = io.BytesIO(data)

        # extract text
        text = extract_text(file_stream, file.filename)

        # chunk text
        chunks = chunk_text(text)

        # user-specific collection
        collection = get_user_collection(user_id)

        for i, chunk in enumerate(chunks):
            emb = embed_text(chunk)

            collection.add(
                ids=[f"{user_id}_{file.filename}_{i}"],
                documents=[chunk],
                embeddings=[emb],
                metadatas=[{
                    "user_id": user_id,
                    "filename": file.filename,
                    "chunk": i
                }]
            )

        return {"status": "ok", "chunks": len(chunks)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



# ------------------ CHAT HISTORY MODELS ------------------

class NewChatRequest(BaseModel):
    user_id: str

class AskInChat(BaseModel):
    user_id: str
    chat_id: str
    question: str



# ------------------ CREATE NEW CHAT ------------------
@app.post("/chat/new")
def new_chat(req: NewChatRequest):
    db = SessionLocal()
    chat = Chat(user_id=req.user_id)

    db.add(chat)
    db.commit()
    db.refresh(chat)

    return {
        "chat_id": chat.chat_id,
        "title": chat.title,
        "created_at": chat.created_at
    }

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "DocMind API is running"}


# ------------------ LIST ALL CHATS ------------------
@app.get("/chat/list")
def list_chats(user_id: str):
    db = SessionLocal()

    chats = (
        db.query(Chat)
        .filter(Chat.user_id == user_id)
        .order_by(Chat.created_at.desc())
        .all()
    )

    return [
        {
            "chat_id": c.chat_id,
            "title": c.title,
            "created_at": c.created_at
        }
        for c in chats
    ]



# ------------------ GET MESSAGES OF A CHAT ------------------
@app.get("/chat/{chat_id}")
def get_chat_messages(chat_id: str):
    db = SessionLocal()

    msgs = (
        db.query(Message)
        .filter(Message.chat_id == chat_id)
        .order_by(Message.created_at)
        .all()
    )

    return [
        {
            "role": m.role,
            "content": m.content,
            "timestamp": m.created_at
        }
        for m in msgs
    ]



# ------------------ ASK QUESTION INSIDE CHAT ------------------
@app.post("/chat/ask")
def ask_question(req: AskInChat):
    db = SessionLocal()

    # -------- save user question --------
    user_msg = Message(
        chat_id=req.chat_id,
        user_id=req.user_id,
        role="user",
        content=req.question
    )
    db.add(user_msg)
    db.commit()


    # -------- run RAG pipeline --------
    result = app_graph.invoke({
        "user_id": req.user_id,
        "question": req.question
    })

    answer = result["answer"]


    # -------- save assistant response --------
    ai_msg = Message(
        chat_id=req.chat_id,
        user_id=req.user_id,
        role="assistant",
        content=answer
    )
    db.add(ai_msg)
    db.commit()


    # -------- return response --------
    return {
        "answer": answer,
        "context": result["context"]
    }



# ------------------ LIST DOCUMENTS ------------------
@app.get("/documents")
async def list_documents(user_id: str):
    try:
        collection = get_user_collection(user_id)
        results = collection.get()  # includes ids, documents, metadatas

        docs = set()
        for meta in results["metadatas"]:
            if "filename" in meta:
                docs.add(meta["filename"])

        return {"documents": list(docs)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



# ------------------ DELETE DOCUMENT ------------------
@app.delete("/documents/delete")
async def delete_document(user_id: str, filename: str):
    try:
        collection = get_user_collection(user_id)
        results = collection.get()

        ids_to_delete = []

        for doc_id, meta in zip(results["ids"], results["metadatas"]):
            if meta.get("filename") == filename:
                ids_to_delete.append(doc_id)

        if not ids_to_delete:
            return {"status": "not_found", "filename": filename}

        collection.delete(ids_to_delete)

        return {
            "status": "deleted",
            "filename": filename,
            "deleted_chunks": len(ids_to_delete)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/chat/delete")
def delete_chat(user_id: str, chat_id: str):
    db = SessionLocal()

    # Find chat belonging to this user
    chat = db.query(Chat).filter(
        Chat.chat_id == chat_id,
        Chat.user_id == user_id
    ).first()

    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    # Delete the chat (messages are auto-deleted)
    db.delete(chat)
    db.commit()

    return {"status": "deleted", "chat_id": chat_id}

class RenameChatRequest(BaseModel):
    user_id: str
    chat_id: str
    new_title: str


@app.put("/chat/rename")
def rename_chat(req: RenameChatRequest):
    db = SessionLocal()

    # Find chat for this user
    chat = db.query(Chat).filter(
        Chat.chat_id == req.chat_id,
        Chat.user_id == req.user_id
    ).first()

    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    # Update title
    chat.title = req.new_title
    db.commit()
    db.refresh(chat)

    return {
        "status": "renamed",
        "chat_id": chat.chat_id,
        "new_title": chat.title
    }