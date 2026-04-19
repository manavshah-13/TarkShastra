from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.core.database import get_db
from app.models.complaint import Complaint as ComplaintModel, ComplaintStatus, Priority
from app.schemas.complaint import (
    Complaint,
    ComplaintCreate,
    ComplaintUpdate,
    ComplaintStatusUpdate,
)
from app.services.ai_service import ai_service
from app.routers.auth import get_current_user
from app.models.user import User as UserModel, UserRole

router = APIRouter(prefix="/complaints", tags=["complaints"])


@router.post("/", response_model=Complaint)
async def create_complaint(
    complaint_in: ComplaintCreate, db: Session = Depends(get_db)
):
    # Trigger AI classification
    analysis = ai_service.analyze_text(complaint_in.description)

    db_complaint = ComplaintModel(
        **complaint_in.model_dump(),
        category=analysis.category,
        priority=analysis.priority,
        ai_confidence=analysis.confidence,
        recommended_action=analysis.recommended_action,
        recommendation_explanation=analysis.explanation,
        estimated_resolution_days=analysis.estimated_resolution_days,
    )
    db.add(db_complaint)
    db.commit()
    db.refresh(db_complaint)
    return db_complaint


@router.get("/", response_model=List[Complaint])
async def list_complaints(
    status: Optional[ComplaintStatus] = None,
    priority: Optional[Priority] = None,
    category: Optional[str] = None,
    assigned_to: Optional[int] = None,
    db: Session = Depends(get_db),
):
    query = db.query(ComplaintModel).filter(ComplaintModel.soft_deleted.is_(None))
    if status:
        query = query.filter(ComplaintModel.status == status)
    if priority:
        query = query.filter(ComplaintModel.priority == priority)
    if category:
        query = query.filter(ComplaintModel.category == category)
    if assigned_to:
        query = query.filter(ComplaintModel.assigned_to == assigned_to)

    return query.all()


@router.get("/{id}", response_model=Complaint)
async def get_complaint(id: int, db: Session = Depends(get_db)):
    complaint = db.query(ComplaintModel).filter(ComplaintModel.id == id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    # Workaround: Manually populate AI fields from database since SQLAlchemy mapper
    # doesn't recognize the columns after table recreation
    from sqlalchemy import text
    result = db.execute(text("SELECT recommended_action, recommendation_explanation, estimated_resolution_days FROM complaints WHERE id = :id"), {"id": id}).fetchone()
    if result:
        complaint.recommended_action = result[0]
        complaint.recommendation_explanation = result[1]
        complaint.estimated_resolution_days = result[2]

    return complaint


@router.patch("/{id}/status", response_model=Complaint)
async def update_status(
    id: int, status_update: ComplaintStatusUpdate, db: Session = Depends(get_db)
):
    complaint = db.query(ComplaintModel).filter(ComplaintModel.id == id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    complaint.status = status_update.status
    if status_update.status == ComplaintStatus.RESOLVED:
        complaint.resolved_at = datetime.utcnow()

    db.commit()
    db.refresh(complaint)
    return complaint


@router.patch("/{id}/assign", response_model=Complaint)
async def assign_complaint(
    id: int,
    assignment: ComplaintStatusUpdate,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role not in [UserRole.ADMIN, UserRole.MANAGER]:
        raise HTTPException(
            status_code=403, detail="Not authorized to assign complaints"
        )

    complaint = db.query(ComplaintModel).filter(ComplaintModel.id == id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    complaint.assigned_to = assignment.assigned_to
    db.commit()
    db.refresh(complaint)
    return complaint


@router.delete("/{id}")
async def delete_complaint(id: int, db: Session = Depends(get_db)):
    complaint = db.query(ComplaintModel).filter(ComplaintModel.id == id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    complaint.soft_deleted = datetime.utcnow()
    db.commit()
    return {"detail": "Complaint soft deleted"}


@router.get("/export")
async def export_complaints(db: Session = Depends(get_db)):
    # Placeholder for CSV/Excel export
    return {"detail": "Export functionality not yet implemented"}
