from sqlalchemy import Column, String, SmallInteger, Text, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base

class Review(Base):
    __tablename__ = "reviews"

    review_id = Column(String(15), primary_key=True)
    user_id   = Column(String(10), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    show_id   = Column(String(10), ForeignKey("shows.show_id", ondelete="CASCADE"), nullable=False)
    rating    = Column(SmallInteger)
    comment   = Column(Text)

    __table_args__ = (UniqueConstraint("user_id", "show_id", name="unique_user_show_review"),)

    user = relationship("User", back_populates="reviews")
    show = relationship("Show", back_populates="reviews")
