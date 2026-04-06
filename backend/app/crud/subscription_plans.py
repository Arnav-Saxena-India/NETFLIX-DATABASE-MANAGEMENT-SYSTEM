from sqlalchemy.orm import Session
from app.models.subscription_plan import SubscriptionPlan
from app.schemas.subscription_plan import PlanCreate, PlanUpdate

def get_plans(db: Session):
    return db.query(SubscriptionPlan).all()

def get_plan(db: Session, plan_id: str):
    return db.query(SubscriptionPlan).filter(SubscriptionPlan.plan_id == plan_id).first()

def create_plan(db: Session, data: PlanCreate):
    plan = SubscriptionPlan(**data.model_dump())
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan

def update_plan(db: Session, plan_id: str, data: PlanUpdate):
    plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.plan_id == plan_id).first()
    if not plan:
        return None
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(plan, key, value)
    db.commit()
    db.refresh(plan)
    return plan

def delete_plan(db: Session, plan_id: str):
    plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.plan_id == plan_id).first()
    if not plan:
        return False
    db.delete(plan)
    db.commit()
    return True
