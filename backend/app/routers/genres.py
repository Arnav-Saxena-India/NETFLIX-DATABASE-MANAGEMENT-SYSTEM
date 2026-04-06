from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.genre import GenreCreate, GenreRead
from app.crud import genres as crud

router = APIRouter()

@router.get("/genres", response_model=list[GenreRead])
def list_genres(db: Session = Depends(get_db)):
    return crud.get_genres(db)

@router.get("/genres/{genre_id}", response_model=GenreRead)
def read_genre(genre_id: str, db: Session = Depends(get_db)):
    genre = crud.get_genre(db, genre_id)
    if not genre:
        raise HTTPException(status_code=404, detail="Genre not found")
    return genre

@router.post("/genres", response_model=GenreRead, status_code=201)
def create_genre(data: GenreCreate, db: Session = Depends(get_db)):
    return crud.create_genre(db, data)

@router.delete("/genres/{genre_id}")
def delete_genre(genre_id: str, db: Session = Depends(get_db)):
    if not crud.delete_genre(db, genre_id):
        raise HTTPException(status_code=404, detail="Genre not found")
    return {"detail": "Deleted"}
