from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import UserCreate, UserRead, UserUpdate
from app.crud import users as crud
from typing import Optional

router = APIRouter()

@router.get("/users", response_model=dict)
def list_users(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    items, total = crud.get_users(db, skip, limit, search)
    return {"data": [UserRead.model_validate(u) for u in items], "total": total}

@router.get("/users/{user_id}", response_model=UserRead)
def read_user(user_id: str, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/users", response_model=UserRead, status_code=201)
def create_user(data: UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db, data)

@router.put("/users/{user_id}", response_model=UserRead)
def update_user(user_id: str, data: UserUpdate, db: Session = Depends(get_db)):
    user = crud.update_user(db, user_id, data)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.delete("/users/{user_id}")
def delete_user(user_id: str, db: Session = Depends(get_db)):
    if not crud.delete_user(db, user_id):
        raise HTTPException(status_code=404, detail="User not found")
    return {"detail": "Deleted"}

@router.post("/users/login")
def login(data: dict, db: Session = Depends(get_db)):
    from app.models.user import User
    user = db.query(User).filter(User.email == data.get("email")).first()
    if not user or user.password != data.get("password"):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"user_id": user.user_id, "name": user.name, "email": user.email}
