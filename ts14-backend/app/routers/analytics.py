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

@router.get("/team")
async def get_team_stats(db: Session = Depends(get_db)):
    # Mock data for the workforce node
    return {
        "members": [
            { "id": 1, "name": "Alex Rivera", "role": "Ops Lead", "load": 85, "performance": 94, "caseCount": 12, "complexity": 7.2, "color": "#3B82F6", "online": True },
            { "id": 2, "name": "Sarah Jenkins", "role": "Specialist", "load": 92, "performance": 88, "caseCount": 15, "complexity": 6.8, "color": "#8B5CF6", "online": True },
            { "id": 3, "name": "Marcus Thompson", "role": "Sr Auditor", "load": 45, "performance": 98, "caseCount": 8, "complexity": 8.5, "color": "#F59E0B", "online": False },
            { "id": 4, "name": "Elena Rodriguez", "role": "Agent T2", "load": 68, "performance": 91, "caseCount": 4, "complexity": 5.9, "color": "#10B981", "online": True },
            { "id": 5, "name": "David Chen", "role": "Agent T1", "load": 74, "performance": 85, "caseCount": 3, "complexity": 4.2, "color": "#EC4899", "online": True },
            { "id": 6, "name": "Sophie Miller", "role": "Comp Lead", "load": 32, "performance": 99, "caseCount": 2, "complexity": 9.1, "color": "#06B6D4", "online": False },
        ],
        "stats": {
            "slaCompliance": 87,
            "crisisAlerts": [
                { "id": 1, "type": "unassigned", "title": "Unassigned Critical Breach", "description": "CMP-892 (Priority P0) has been unassigned for 45 minutes.", "severity": "critical" },
                { "id": 2, "type": "overload", "title": "Agent Overload Alert", "description": "Sarah Jenkins is at 95% capacity with 3 P0 cases.", "severity": "warning" }
            ]
        }
    }