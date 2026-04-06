from pydantic import BaseModel, ConfigDict

class GenreBase(BaseModel):
    genre_name: str

class GenreCreate(GenreBase):
    genre_id: str

class GenreRead(GenreBase):
    genre_id: str
    model_config = ConfigDict(from_attributes=True)
