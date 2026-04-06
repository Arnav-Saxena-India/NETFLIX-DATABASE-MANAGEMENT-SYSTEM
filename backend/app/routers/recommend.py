from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.watch_history import WatchHistory
from app.models.show import Show, ShowGenre
from app.models.genre import Genre

router = APIRouter()

@router.get("/recommendations/{user_id}")
def get_recommendations(user_id: str, db: Session = Depends(get_db)):
    watched = db.query(WatchHistory).filter(WatchHistory.user_id == user_id).all()
    if not watched:
        return []

    watched_show_ids = list(set(w.show_id for w in watched))
    genre_counts = {}
    for sid in watched_show_ids:
        sg_rows = db.query(ShowGenre).filter(ShowGenre.show_id == sid).all()
        for sg in sg_rows:
            genre_counts[sg.genre_id] = genre_counts.get(sg.genre_id, 0) + 1

    total_weight = sum(genre_counts.values()) or 1

    unwatched = db.query(Show).filter(~Show.show_id.in_(watched_show_ids)).all()
    scored = []
    for show in unwatched:
        sg_rows = db.query(ShowGenre).filter(ShowGenre.show_id == show.show_id).all()
        score = sum(genre_counts.get(sg.genre_id, 0) for sg in sg_rows)
        match_pct = min(99, round((score / total_weight) * 100))
        if match_pct > 0:
            genres = [db.query(Genre).filter(Genre.genre_id == sg.genre_id).first().genre_name for sg in sg_rows]
            scored.append({
                "show_id": show.show_id,
                "title": show.title,
                "release_year": show.release_year,
                "language": show.language,
                "duration": show.duration,
                "genres": genres,
                "match_percent": match_pct,
            })

    scored.sort(key=lambda x: x["match_percent"], reverse=True)
    return scored[:5]
