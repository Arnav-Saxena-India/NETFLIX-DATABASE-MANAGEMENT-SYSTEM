from sqlalchemy.orm import Session
from app.models.genre import Genre
from app.schemas.genre import GenreCreate

def get_genres(db: Session):
    return db.query(Genre).all()

def get_genre(db: Session, genre_id: str):
    return db.query(Genre).filter(Genre.genre_id == genre_id).first()

def create_genre(db: Session, data: GenreCreate):
    genre = Genre(**data.model_dump())
    db.add(genre)
    db.commit()
    db.refresh(genre)
    return genre

def delete_genre(db: Session, genre_id: str):
    genre = db.query(Genre).filter(Genre.genre_id == genre_id).first()
    if not genre:
        return False
    db.delete(genre)
    db.commit()
    return True
