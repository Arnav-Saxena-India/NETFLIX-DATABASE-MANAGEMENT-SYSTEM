from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import users, shows, payments, subscription_plans, watch_history, reviews, genres, reports, recommend

app = FastAPI(title="Aperture OTT Management System", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router,              prefix="/api/v1", tags=["Users"])
app.include_router(shows.router,              prefix="/api/v1", tags=["Shows"])
app.include_router(genres.router,             prefix="/api/v1", tags=["Genres"])
app.include_router(subscription_plans.router, prefix="/api/v1", tags=["Subscription Plans"])
app.include_router(payments.router,           prefix="/api/v1", tags=["Payments"])
app.include_router(watch_history.router,      prefix="/api/v1", tags=["Watch History"])
app.include_router(reviews.router,            prefix="/api/v1", tags=["Reviews"])
app.include_router(reports.router,            prefix="/api/v1", tags=["Reports"])
app.include_router(recommend.router,          prefix="/api/v1", tags=["Recommendations"])

@app.on_event("startup")
def on_startup():
    try:
        from app.database import engine, Base
        import app.models
        Base.metadata.create_all(bind=engine)
    except Exception:
        pass

@app.get("/")
def root():
    return {"message": "Aperture OTT API v1.0.0", "docs": "/docs"}

@app.get("/api/v1/dashboard/stats")
def dashboard_stats():
    from app.database import SessionLocal
    from app.models.user import User
    from app.models.show import Show
    from app.models.payment import Payment
    from sqlalchemy import func
    db = SessionLocal()
    try:
        total_users = db.query(func.count(User.user_id)).scalar()
        total_shows = db.query(func.count(Show.show_id)).scalar()
        total_revenue = db.query(func.coalesce(func.sum(Payment.amount), 0)).scalar()
        active_subs = db.query(func.count(Payment.payment_id)).scalar()
        return {
            "total_users": total_users,
            "total_shows": total_shows,
            "total_revenue": float(total_revenue),
            "active_subscriptions": active_subs,
        }
    finally:
        db.close()
