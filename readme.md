# 📚 DocMind — AI-Powered Document Intelligence & RAG Chatbot
*A next-gen AI assistant that understands your documents and answers with precision using Gemini, ChromaDB, FastAPI & LangGraph.*

---

<p align="center">
  <img width="500" src="https://dummyimage.com/1200x350/000/fff&text=DocMind+AI">
</p>

<p align="center">
  <b>Upload Documents</b> • <b>Semantic Search</b> • <b>Context-Aware Answers</b> • <b>Chat History</b> • <b>User-Scoped Vector DB</b>
</p>

---

## 🚀 Overview

**DocMind** is a complete **RAG (Retrieval-Augmented Generation)** system that lets users:

- Upload PDFs, TXT, DOCX  
- Automatically extract and chunk text  
- Embed content using **Google Gemini**  
- Store embeddings in **Chroma Cloud Vector DB**  
- Ask natural language questions  
- Receive **contextually accurate answers** grounded in their documents  
- Maintain chat histories, rename, delete chats  
- Have **user-specific document isolation**  

DocMind is perfect for:

📘 Students • 🧑‍💼 Professionals • 📄 Researchers • 🧠 Knowledge workers

---

# ⭐ Features

### 🔐 Authentication
- Signup, login  
- JWT-based sessions  
- Per-user data isolation  

### 📂 Document Upload
- Supports PDF, TXT, DOCX  
- Text extraction (PyPDF, PyMuPDF)  
- Automatic chunking  
- Embeddings stored in Chroma Cloud  
- File viewer + document list panel  
- Delete document  

### 🧠 RAG Pipeline (LangGraph)
- Embedding-based retrieval  
- Filters by user + document filename  
- Builds accurate context window  
- Passes context to Gemini 2.5 Flash  
- Zero hallucination prompting  

### 💬 Chat System (ChatGPT-like)
- Create chat  
- Rename chat  
- Delete chat  
- Persistent chat history  
- Chat with a specific document  
- Chat with all documents  

### 🎨 Frontend
- React  
- Tailwind CDN  
- Modern chat UI  
- Sidebar for chats + documents  
- File upload  

### ☁️ Backend
- FastAPI  
- PostgreSQL  
- SQLAlchemy ORM  
- Chroma Cloud  
- Gemini API  

---

# 🧬 Architecture


                           ┌────────────────────────┐
                           │        Frontend        │
                           │  React + Tailwind UI   │
                           └───────────┬────────────┘
                                       │ REST API
                                       ▼
 ┌─────────────────────────────────────────────────────────────────┐
 │                           FastAPI Backend                       │
 │                                                                 │
 │  ┌───────────────┐   ┌───────────┐   ┌──────────────────────┐  │
 │  │ Auth Service   │   │ RAG Graph │   │ Document Processor   │  │
 │  └───────────────┘   └───────────┘   └──────────────────────┘  │
 │          │                     │                   │            │
 │  PostgreSQL (Users, Chats, Messages)              │            │
 │                                                   ▼            │
 │                                    Chroma Cloud Vector DB      │
 │                                    (Embeddings + Chunks)       │
 └─────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
                               Gemini AI Model
                               (Answer Generation)
