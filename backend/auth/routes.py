from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import SessionLocal
from auth.models import User
from auth.utils import hash_password, verify_password, create_token

router = APIRouter(prefix="/auth", tags=["Auth"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------- SIGNUP ----------
@router.post("/signup")
def signup(name: str, email: str, password: str, db: Session = Depends(get_db)):

    # Check if email exists
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(400, "Email already registered")

    new_user = User(
        name=name,
        email=email,
        password_hash=hash_password(password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "Signup successful",
        "user_id": str(new_user.user_id)
    }


# ---------- LOGIN ----------
@router.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(400, "Invalid email")

    if not verify_password(password, user.password_hash):
        raise HTTPException(400, "Invalid password")

    token = create_token(user.user_id)

    return {
        "name": user.name,
        "email": user.email,
        "message": "Login successful",
        "token": token,
        "user_id": str(user.user_id)
    }
