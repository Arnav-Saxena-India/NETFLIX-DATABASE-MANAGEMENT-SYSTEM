from sqlalchemy.orm import Session
from app.models.review import Review
from app.schemas.review import ReviewCreate, ReviewUpdate

def get_reviews(db: Session, skip: int = 0, limit: int = 100, show_id: str = None):
    q = db.query(Review)
    if show_id:
        q = q.filter(Review.show_id == show_id)
    total = q.count()
    return q.offset(skip).limit(limit).all(), total

def get_review(db: Session, review_id: str):
    return db.query(Review).filter(Review.review_id == review_id).first()

def create_review(db: Session, data: ReviewCreate):
    review = Review(**data.model_dump())
    db.add(review)
    db.commit()
    db.refresh(review)
    return review

def update_review(db: Session, review_id: str, data: ReviewUpdate):
    review = db.query(Review).filter(Review.review_id == review_id).first()
    if not review:
        return None
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(review, key, value)
    db.commit()
    db.refresh(review)
    return review

def delete_review(db: Session, review_id: str):
    review = db.query(Review).filter(Review.review_id == review_id).first()
    if not review:
        return False
    db.delete(review)
    db.commit()
    return True
