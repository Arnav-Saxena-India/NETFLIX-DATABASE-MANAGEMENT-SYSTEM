from sqlalchemy.orm import Session
from app.models.watch_history import WatchHistory
from app.schemas.watch_history import WatchHistoryCreate, WatchHistoryUpdate
from datetime import time

def get_histories(db: Session, skip: int = 0, limit: int = 100, user_id: str = None, show_id: str = None):
    q = db.query(WatchHistory)
    if user_id:
        q = q.filter(WatchHistory.user_id == user_id)
    if show_id:
        q = q.filter(WatchHistory.show_id == show_id)
    total = q.count()
    return q.offset(skip).limit(limit).all(), total

def get_history(db: Session, history_id: str):
    return db.query(WatchHistory).filter(WatchHistory.history_id == history_id).first()

def create_history(db: Session, data: WatchHistoryCreate):
    wh_data = data.model_dump()
    if wh_data.get("last_access_time"):
        parts = wh_data["last_access_time"].split(":")
        wh_data["last_access_time"] = time(int(parts[0]), int(parts[1]), int(parts[2]) if len(parts) > 2 else 0)
    else:
        wh_data["last_access_time"] = None
    wh = WatchHistory(**wh_data)
    db.add(wh)
    db.commit()
    db.refresh(wh)
    return wh

def update_history(db: Session, history_id: str, data: WatchHistoryUpdate):
    wh = db.query(WatchHistory).filter(WatchHistory.history_id == history_id).first()
    if not wh:
        return None
    update_data = data.model_dump(exclude_unset=True)
    if "last_access_time" in update_data and update_data["last_access_time"]:
        parts = update_data["last_access_time"].split(":")
        update_data["last_access_time"] = time(int(parts[0]), int(parts[1]), int(parts[2]) if len(parts) > 2 else 0)
    for key, value in update_data.items():
        setattr(wh, key, value)
    db.commit()
    db.refresh(wh)
    return wh

def delete_history(db: Session, history_id: str):
    wh = db.query(WatchHistory).filter(WatchHistory.history_id == history_id).first()
    if not wh:
        return False
    db.delete(wh)
    db.commit()
    return True
