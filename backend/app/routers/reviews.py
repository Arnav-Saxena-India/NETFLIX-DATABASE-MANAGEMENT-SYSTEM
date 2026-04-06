from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.review import ReviewCreate, ReviewRead, ReviewUpdate
from app.crud import reviews as crud
from typing import Optional

router = APIRouter()

@router.get("/reviews", response_model=dict)
def list_reviews(
    skip: int = 0,
    limit: int = 100,
    show_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    items, total = crud.get_reviews(db, skip, limit, show_id)
    return {"data": [ReviewRead.model_validate(r) for r in items], "total": total}

@router.get("/reviews/{review_id}", response_model=ReviewRead)
def read_review(review_id: str, db: Session = Depends(get_db)):
    review = crud.get_review(db, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review

@router.post("/reviews", response_model=ReviewRead, status_code=201)
def create_review(data: ReviewCreate, db: Session = Depends(get_db)):
    return crud.create_review(db, data)

@router.put("/reviews/{review_id}", response_model=ReviewRead)
def update_review(review_id: str, data: ReviewUpdate, db: Session = Depends(get_db)):
    review = crud.update_review(db, review_id, data)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review

@router.delete("/reviews/{review_id}")
def delete_review(review_id: str, db: Session = Depends(get_db)):
    if not crud.delete_review(db, review_id):
        raise HTTPException(status_code=404, detail="Review not found")
    return {"detail": "Deleted"}
