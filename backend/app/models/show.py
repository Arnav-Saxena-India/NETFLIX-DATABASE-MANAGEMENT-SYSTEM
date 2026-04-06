from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class ShowGenre(Base):
    __tablename__ = "show_genres"

    show_id  = Column(String(10), ForeignKey("shows.show_id", ondelete="CASCADE"), primary_key=True)
    genre_id = Column(String(10), ForeignKey("genres.genre_id", ondelete="CASCADE"), primary_key=True)

class Show(Base):
    __tablename__ = "shows"

    show_id      = Column(String(10), primary_key=True)
    title        = Column(String(200), nullable=False)
    release_year = Column(Integer, nullable=False)
    language     = Column(String(50), nullable=False)
    duration     = Column(Integer)

    genres        = relationship("Genre", secondary="show_genres", back_populates="shows")
    watch_history = relationship("WatchHistory", back_populates="show", cascade="all, delete-orphan")
    reviews       = relationship("Review", back_populates="show", cascade="all, delete-orphan")
