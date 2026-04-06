from sqlalchemy import Column, String, DECIMAL, Date, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import date

class Payment(Base):
    __tablename__ = "payments"

    payment_id = Column(String(15), primary_key=True)
    user_id    = Column(String(10), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    plan_id    = Column(String(10), ForeignKey("subscription_plans.plan_id"), nullable=False)
    amount     = Column(DECIMAL(8, 2), nullable=False)
    mode       = Column(Enum("UPI", "Card", "NetBanking", "Wallet"), nullable=False)
    date       = Column(Date, nullable=False, default=date.today)

    user = relationship("User", back_populates="payments")
    plan = relationship("SubscriptionPlan")
