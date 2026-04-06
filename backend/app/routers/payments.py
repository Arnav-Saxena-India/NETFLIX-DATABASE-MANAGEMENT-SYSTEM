from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.payment import PaymentCreate, PaymentRead
from app.crud import payments as crud
from typing import Optional

router = APIRouter()

@router.get("/payments", response_model=dict)
def list_payments(
    skip: int = 0,
    limit: int = 100,
    user_id: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    db: Session = Depends(get_db)
):
    items, total = crud.get_payments(db, skip, limit, user_id, date_from, date_to)
    return {"data": [PaymentRead.model_validate(p) for p in items], "total": total}

@router.get("/payments/{payment_id}", response_model=PaymentRead)
def read_payment(payment_id: str, db: Session = Depends(get_db)):
    payment = crud.get_payment(db, payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment

@router.post("/payments", response_model=PaymentRead, status_code=201)
def create_payment(data: PaymentCreate, db: Session = Depends(get_db)):
    return crud.create_payment(db, data)

@router.delete("/payments/{payment_id}")
def delete_payment(payment_id: str, db: Session = Depends(get_db)):
    if not crud.delete_payment(db, payment_id):
        raise HTTPException(status_code=404, detail="Payment not found")
    return {"detail": "Deleted"}
