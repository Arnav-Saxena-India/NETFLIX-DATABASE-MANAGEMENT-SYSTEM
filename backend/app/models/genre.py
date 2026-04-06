from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from app.database import Base

class Genre(Base):
    __tablename__ = "genres"

    genre_id   = Column(String(10), primary_key=True)
    genre_name = Column(String(50), unique=True, nullable=False)

    shows = relationship("Show", secondary="show_genres", back_populates="genres")
