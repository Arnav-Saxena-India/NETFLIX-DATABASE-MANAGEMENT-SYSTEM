from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.show import ShowCreate, ShowRead, ShowUpdate
from app.crud import shows as crud
from typing import Optional

router = APIRouter()

@router.get("/shows", response_model=dict)
def list_shows(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    language: Optional[str] = None,
    genre_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    items, total = crud.get_shows(db, skip, limit, search, language, genre_id)
    return {"data": [ShowRead.model_validate(s) for s in items], "total": total}

@router.get("/shows/{show_id}", response_model=ShowRead)
def read_show(show_id: str, db: Session = Depends(get_db)):
    show = crud.get_show(db, show_id)
    if not show:
        raise HTTPException(status_code=404, detail="Show not found")
    return show

@router.post("/shows", response_model=ShowRead, status_code=201)
def create_show(data: ShowCreate, db: Session = Depends(get_db)):
    return crud.create_show(db, data)

@router.put("/shows/{show_id}", response_model=ShowRead)
def update_show(show_id: str, data: ShowUpdate, db: Session = Depends(get_db)):
    show = crud.update_show(db, show_id, data)
    if not show:
        raise HTTPException(status_code=404, detail="Show not found")
    return show

@router.delete("/shows/{show_id}")
def delete_show(show_id: str, db: Session = Depends(get_db)):
    if not crud.delete_show(db, show_id):
        raise HTTPException(status_code=404, detail="Show not found")
    return {"detail": "Deleted"}
