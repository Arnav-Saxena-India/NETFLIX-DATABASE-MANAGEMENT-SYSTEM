from pydantic import BaseModel, EmailStr, Field, ConfigDict
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    name: str
    email: EmailStr
    age: int = Field(..., ge=13, le=120)

class UserCreate(UserBase):
    user_id: str
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    age: Optional[int] = Field(None, ge=13, le=120)

class UserRead(UserBase):
    user_id: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
