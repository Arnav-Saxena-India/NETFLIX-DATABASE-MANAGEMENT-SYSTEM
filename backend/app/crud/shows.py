from sqlalchemy.orm import Session
from app.models.show import Show, ShowGenre
from app.models.genre import Genre
from app.schemas.show import ShowCreate, ShowUpdate

def get_shows(db: Session, skip: int = 0, limit: int = 100, search: str = None, language: str = None, genre_id: str = None):
    q = db.query(Show)
    if search:
        q = q.filter(Show.title.ilike(f"%{search}%"))
    if language:
        q = q.filter(Show.language == language)
    if genre_id:
        q = q.join(ShowGenre).filter(ShowGenre.genre_id == genre_id)
    total = q.count()
    shows = q.offset(skip).limit(limit).all()
    return shows, total

def get_show(db: Session, show_id: str):
    return db.query(Show).filter(Show.show_id == show_id).first()

def create_show(db: Session, data: ShowCreate):
    show = Show(
        show_id=data.show_id,
        title=data.title,
        release_year=data.release_year,
        language=data.language,
        duration=data.duration,
    )
    db.add(show)
    db.flush()
    for gid in data.genre_ids:
        db.add(ShowGenre(show_id=data.show_id, genre_id=gid))
    db.commit()
    db.refresh(show)
    return show

def update_show(db: Session, show_id: str, data: ShowUpdate):
    show = db.query(Show).filter(Show.show_id == show_id).first()
    if not show:
        return None
    update_data = data.model_dump(exclude_unset=True)
    genre_ids = update_data.pop("genre_ids", None)
    for key, value in update_data.items():
        setattr(show, key, value)
    if genre_ids is not None:
        db.query(ShowGenre).filter(ShowGenre.show_id == show_id).delete()
        for gid in genre_ids:
            db.add(ShowGenre(show_id=show_id, genre_id=gid))
    db.commit()
    db.refresh(show)
    return show

def delete_show(db: Session, show_id: str):
    show = db.query(Show).filter(Show.show_id == show_id).first()
    if not show:
        return False
    db.delete(show)
    db.commit()
    return True
