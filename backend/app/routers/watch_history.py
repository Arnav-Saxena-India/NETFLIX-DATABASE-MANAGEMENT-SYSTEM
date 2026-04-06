from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.watch_history import WatchHistoryCreate, WatchHistoryRead, WatchHistoryUpdate
from app.crud import watch_history as crud
from typing import Optional

router = APIRouter()

@router.get("/watch-history", response_model=dict)
def list_history(
    skip: int = 0,
    limit: int = 100,
    user_id: Optional[str] = None,
    show_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    items, total = crud.get_histories(db, skip, limit, user_id, show_id)
    results = []
    for h in items:
        d = {
            "history_id": h.history_id,
            "user_id": h.user_id,
            "show_id": h.show_id,
            "last_access_time": h.last_access_time.strftime("%H:%M:%S") if h.last_access_time else None,
            "completion_percent": h.completion_percent,
            "season": h.season,
            "episode": h.episode,
            "duration_watched": h.duration_watched,
            "device": h.device.value if hasattr(h.device, "value") else h.device,
        }
        results.append(d)
    return {"data": results, "total": total}

@router.get("/watch-history/{history_id}")
def read_history(history_id: str, db: Session = Depends(get_db)):
    h = crud.get_history(db, history_id)
    if not h:
        raise HTTPException(status_code=404, detail="Watch history not found")
    return {
        "history_id": h.history_id,
        "user_id": h.user_id,
        "show_id": h.show_id,
        "last_access_time": h.last_access_time.strftime("%H:%M:%S") if h.last_access_time else None,
        "completion_percent": h.completion_percent,
        "season": h.season,
        "episode": h.episode,
        "duration_watched": h.duration_watched,
        "device": h.device.value if hasattr(h.device, "value") else h.device,
    }

@router.post("/watch-history", status_code=201)
def create_history(data: WatchHistoryCreate, db: Session = Depends(get_db)):
    h = crud.create_history(db, data)
    return {"history_id": h.history_id}

@router.put("/watch-history/{history_id}")
def update_history(history_id: str, data: WatchHistoryUpdate, db: Session = Depends(get_db)):
    h = crud.update_history(db, history_id, data)
    if not h:
        raise HTTPException(status_code=404, detail="Watch history not found")
    return {"detail": "Updated"}

@router.delete("/watch-history/{history_id}")
def delete_history(history_id: str, db: Session = Depends(get_db)):
    if not crud.delete_history(db, history_id):
        raise HTTPException(status_code=404, detail="Watch history not found")
    return {"detail": "Deleted"}
