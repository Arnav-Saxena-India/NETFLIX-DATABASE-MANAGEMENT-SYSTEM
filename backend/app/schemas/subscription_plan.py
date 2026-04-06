from pydantic import BaseModel, ConfigDict
from typing import Optional

class PlanBase(BaseModel):
    plan_name: str
    price: float
    duration: int

class PlanCreate(PlanBase):
    plan_id: str

class PlanUpdate(BaseModel):
    plan_name: Optional[str] = None
    price: Optional[float] = None
    duration: Optional[int] = None

class PlanRead(PlanBase):
    plan_id: str
    model_config = ConfigDict(from_attributes=True)
