from sqlalchemy import Column, String, Integer, Time, SmallInteger, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class WatchHistory(Base):
    __tablename__ = "watch_history"

    history_id         = Column(String(15), primary_key=True)
    user_id            = Column(String(10), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    show_id            = Column(String(10), ForeignKey("shows.show_id", ondelete="CASCADE"), nullable=False)
    last_access_time   = Column(Time)
    completion_percent = Column(SmallInteger)
    season             = Column(Integer)
    episode            = Column(Integer)
    duration_watched   = Column(Integer)
    device             = Column(Enum("Mobile", "Laptop", "TV", "Tablet"), nullable=False)

    user = relationship("User", back_populates="watch_history")
    show = relationship("Show", back_populates="watch_history")
