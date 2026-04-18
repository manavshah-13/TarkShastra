from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.complaint import Complaint as ComplaintModel, ComplaintStatus
from sqlalchemy import func

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/dashboard")
async def get_dashboard_stats(db: Session = Depends(get_db)):
    total_complaints = db.query(ComplaintModel).count()
    status_counts = db.query(ComplaintModel.status, func.count(ComplaintModel.id)).group_by(ComplaintModel.status).all()
    category_counts = db.query(ComplaintModel.category, func.count(ComplaintModel.id)).group_by(ComplaintModel.category).all()
    
    return {
        "total": total_complaints,
        "status_distribution": {status: count for status, count in status_counts},
        "category_distribution": {cat: count for cat, count in category_counts},
        "sla_compliance_rate": 0.92, # Placeholder
        "ai_accuracy": 0.88 # Placeholder
    }

@router.get("/trends")
async def get_trends(db: Session = Depends(get_db)):
    # Simple day-wise counts
    trends = db.query(func.date(ComplaintModel.created_at), func.count(ComplaintModel.id)).group_by(func.date(ComplaintModel.created_at)).all()
    return {"trends": {str(date): count for date, count in trends}}
