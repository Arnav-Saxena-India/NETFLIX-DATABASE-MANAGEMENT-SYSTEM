from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.subscription_plan import PlanCreate, PlanRead, PlanUpdate
from app.crud import subscription_plans as crud

router = APIRouter()

@router.get("/plans", response_model=list[PlanRead])
def list_plans(db: Session = Depends(get_db)):
    return crud.get_plans(db)

@router.get("/plans/{plan_id}", response_model=PlanRead)
def read_plan(plan_id: str, db: Session = Depends(get_db)):
    plan = crud.get_plan(db, plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    return plan

@router.post("/plans", response_model=PlanRead, status_code=201)
def create_plan(data: PlanCreate, db: Session = Depends(get_db)):
    return crud.create_plan(db, data)

@router.put("/plans/{plan_id}", response_model=PlanRead)
def update_plan(plan_id: str, data: PlanUpdate, db: Session = Depends(get_db)):
    plan = crud.update_plan(db, plan_id, data)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    return plan

@router.delete("/plans/{plan_id}")
def delete_plan(plan_id: str, db: Session = Depends(get_db)):
    if not crud.delete_plan(db, plan_id):
        raise HTTPException(status_code=404, detail="Plan not found")
    return {"detail": "Deleted"}
