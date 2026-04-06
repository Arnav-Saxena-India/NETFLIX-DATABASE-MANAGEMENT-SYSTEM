from pydantic import BaseModel, ConfigDict
from typing import Optional, List

class GenreRead(BaseModel):
    genre_id: str
    genre_name: str
    model_config = ConfigDict(from_attributes=True)

class ShowBase(BaseModel):
    title: str
    release_year: int
    language: str
    duration: Optional[int] = None

class ShowCreate(ShowBase):
    show_id: str
    genre_ids: List[str] = []

class ShowUpdate(BaseModel):
    title: Optional[str] = None
    release_year: Optional[int] = None
    language: Optional[str] = None
    duration: Optional[int] = None
    genre_ids: Optional[List[str]] = None

class ShowRead(ShowBase):
    show_id: str
    genres: List[GenreRead] = []
    model_config = ConfigDict(from_attributes=True)
