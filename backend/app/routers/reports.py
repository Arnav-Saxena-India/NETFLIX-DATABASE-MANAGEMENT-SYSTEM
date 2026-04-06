from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.payment import Payment
from app.models.subscription_plan import SubscriptionPlan
from app.models.user import User
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/reports/revenue-by-plan")
def revenue_by_plan(db: Session = Depends(get_db)):
    results = (
        db.query(
            SubscriptionPlan.plan_name,
            func.count(Payment.payment_id).label("subscribers"),
            func.coalesce(func.sum(Payment.amount), 0).label("revenue")
        )
        .join(SubscriptionPlan, Payment.plan_id == SubscriptionPlan.plan_id)
        .group_by(SubscriptionPlan.plan_name)
        .all()
    )
    return [{"name": r.plan_name, "subscribers": r.subscribers, "revenue": float(r.revenue)} for r in results]

@router.get("/reports/plan-distribution")
def plan_distribution(db: Session = Depends(get_db)):
    results = (
        db.query(
            SubscriptionPlan.plan_name,
            func.count(Payment.payment_id).label("value")
        )
        .join(SubscriptionPlan, Payment.plan_id == SubscriptionPlan.plan_id)
        .group_by(SubscriptionPlan.plan_name)
        .all()
    )
    return [{"name": r.plan_name, "value": r.value} for r in results]

@router.get("/reports/expiry-alerts")
def expiry_alerts(db: Session = Depends(get_db)):
    today = datetime.utcnow().date()
    payments = db.query(Payment).all()
    alerts = []
    for pay in payments:
        plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.plan_id == pay.plan_id).first()
        user = db.query(User).filter(User.user_id == pay.user_id).first()
        if not plan or not user:
            continue
        expiry = pay.date + timedelta(days=plan.duration)
        days_left = (expiry - today).days
        if -30 <= days_left <= 7:
            alerts.append({
                "name": user.name,
                "plan": plan.plan_name,
                "expiry": expiry.isoformat(),
                "days_left": days_left,
                "expired": days_left < 0,
            })
    return alerts

@router.get("/reports/bill")
def generate_bill(user_id: str, plan_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == user_id).first()
    plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.plan_id == plan_id).first()
    if not user or not plan:
        return {"error": "User or Plan not found"}
    base_price = float(plan.price)
    is_annual = plan.duration >= 365
    discount_rate = 0.15 if is_annual else 0.0
    discount_amount = round(base_price * discount_rate, 2)
    taxable = round(base_price - discount_amount, 2)
    gst = round(taxable * 0.18, 2)
    grand_total = round(taxable + gst, 2)
    today = datetime.utcnow().date()
    validity_end = today + timedelta(days=plan.duration)
    return {
        "user_name": user.name,
        "user_email": user.email,
        "plan_name": plan.plan_name,
        "base_price": base_price,
        "discount_rate": discount_rate * 100,
        "discount_amount": discount_amount,
        "taxable_amount": taxable,
        "gst_rate": 18,
        "gst_amount": gst,
        "grand_total": grand_total,
        "validity_from": today.isoformat(),
        "validity_to": validity_end.isoformat(),
    }
