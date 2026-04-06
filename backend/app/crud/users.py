from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate

def get_users(db: Session, skip: int = 0, limit: int = 100, search: str = None):
    q = db.query(User)
    if search:
        q = q.filter(User.name.ilike(f"%{search}%") | User.email.ilike(f"%{search}%"))
    return q.offset(skip).limit(limit).all(), q.count()

def get_user(db: Session, user_id: str):
    return db.query(User).filter(User.user_id == user_id).first()

def create_user(db: Session, data: UserCreate):
    user = User(**data.model_dump())
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def update_user(db: Session, user_id: str, data: UserUpdate):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return user

def delete_user(db: Session, user_id: str):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        return False
    db.delete(user)
    db.commit()
    return True
