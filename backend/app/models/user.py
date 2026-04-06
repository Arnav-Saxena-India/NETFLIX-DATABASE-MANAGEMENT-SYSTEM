from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    user_id    = Column(String(10), primary_key=True)
    name       = Column(String(100), nullable=False)
    email      = Column(String(150), unique=True, nullable=False)
    password   = Column(String(255), nullable=False)
    age        = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

    payments      = relationship("Payment", back_populates="user", cascade="all, delete-orphan")
    watch_history = relationship("WatchHistory", back_populates="user", cascade="all, delete-orphan")
    reviews       = relationship("Review", back_populates="user", cascade="all, delete-orphan")
