from sqlalchemy.dialects.postgresql import UUID
import uuid
from db import Base
from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
class User(Base):
    __tablename__ = "user_details"

    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)


def gen_uuid():
    return str(uuid.uuid4())

class Chat(Base):
    __tablename__ = "chats"

    chat_id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, nullable=False)
    title = Column(String, default="New Chat")
    created_at = Column(DateTime, default=datetime.utcnow)

    messages = relationship("Message", back_populates="chat", cascade="all, delete")


class Message(Base):
    __tablename__ = "messages"

    message_id = Column(String, primary_key=True, default=gen_uuid)
    chat_id = Column(String, ForeignKey("chats.chat_id"))
    user_id = Column(String, nullable=False)
    role = Column(String)   # 'user' or 'assistant'
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    chat = relationship("Chat", back_populates="messages")
