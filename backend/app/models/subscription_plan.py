from sqlalchemy import Column, String, Integer, DECIMAL
from app.database import Base

class SubscriptionPlan(Base):
    __tablename__ = "subscription_plans"

    plan_id   = Column(String(10), primary_key=True)
    plan_name = Column(String(50), nullable=False)
    price     = Column(DECIMAL(8, 2), nullable=False)
    duration  = Column(Integer, nullable=False)
