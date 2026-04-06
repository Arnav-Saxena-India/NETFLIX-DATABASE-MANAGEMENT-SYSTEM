from sqlalchemy.orm import Session
from app.models.payment import Payment
from app.schemas.payment import PaymentCreate
from datetime import date

def get_payments(db: Session, skip: int = 0, limit: int = 100, user_id: str = None, date_from: str = None, date_to: str = None):
    q = db.query(Payment)
    if user_id:
        q = q.filter(Payment.user_id == user_id)
    if date_from:
        q = q.filter(Payment.date >= date_from)
    if date_to:
        q = q.filter(Payment.date <= date_to)
    total = q.count()
    return q.offset(skip).limit(limit).all(), total

def get_payment(db: Session, payment_id: str):
    return db.query(Payment).filter(Payment.payment_id == payment_id).first()

def create_payment(db: Session, data: PaymentCreate):
    pay_data = data.model_dump()
    if pay_data.get("date") is None:
        pay_data["date"] = date.today()
    payment = Payment(**pay_data)
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment

def delete_payment(db: Session, payment_id: str):
    payment = db.query(Payment).filter(Payment.payment_id == payment_id).first()
    if not payment:
        return False
    db.delete(payment)
    db.commit()
    return True
