from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import time
from enum import Enum

class DeviceType(str, Enum):
    Mobile = "Mobile"
    Laptop = "Laptop"
    TV = "TV"
    Tablet = "Tablet"

class WatchHistoryBase(BaseModel):
    user_id: str
    show_id: str
    last_access_time: Optional[str] = None
    completion_percent: int = Field(..., ge=0, le=100)
    season: Optional[int] = None
    episode: Optional[int] = None
    duration_watched: Optional[int] = None
    device: DeviceType

class WatchHistoryCreate(WatchHistoryBase):
    history_id: str

class WatchHistoryUpdate(BaseModel):
    last_access_time: Optional[str] = None
    completion_percent: Optional[int] = Field(None, ge=0, le=100)
    season: Optional[int] = None
    episode: Optional[int] = None
    duration_watched: Optional[int] = None
    device: Optional[DeviceType] = None

class WatchHistoryRead(WatchHistoryBase):
    history_id: str
    model_config = ConfigDict(from_attributes=True)
