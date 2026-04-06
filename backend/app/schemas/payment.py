from pydantic import BaseModel, ConfigDict
from datetime import date
from typing import Optional
from enum import Enum

class PaymentMode(str, Enum):
    UPI = "UPI"
    Card = "Card"
    NetBanking = "NetBanking"
    Wallet = "Wallet"

class PaymentBase(BaseModel):
    user_id: str
    plan_id: str
    amount: float
    mode: PaymentMode

class PaymentCreate(PaymentBase):
    payment_id: str
    date: Optional[date] = None

class PaymentRead(PaymentBase):
    payment_id: str
    date: date
    model_config = ConfigDict(from_attributes=True)
