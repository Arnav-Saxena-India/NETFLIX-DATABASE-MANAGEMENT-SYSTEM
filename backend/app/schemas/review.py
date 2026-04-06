from pydantic import BaseModel, Field, ConfigDict
from typing import Optional

class ReviewBase(BaseModel):
    user_id: str
    show_id: str
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None

class ReviewCreate(ReviewBase):
    review_id: str

class ReviewUpdate(BaseModel):
    rating: Optional[int] = Field(None, ge=1, le=5)
    comment: Optional[str] = None

class ReviewRead(ReviewBase):
    review_id: str
    model_config = ConfigDict(from_attributes=True)
