from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.core.database import get_db
from app.models.complaint import Complaint as ComplaintModel, ComplaintStatus, Priority
from app.schemas.complaint import Complaint

router = APIRouter(prefix="/sla", tags=["sla"])

class MassReassignRequest(BaseModel):
    complaint_ids: List[int]
    assigned_to: int

class PriorityUpdateRequest(BaseModel):
    complaint_ids: List[int]
    priority: str

@router.get("/critical")
async def get_critical_sla(db: Session = Depends(get_db)):
    critical = db.query(ComplaintModel).filter(
        ComplaintModel.status != ComplaintStatus.RESOLVED,
        ComplaintModel.priority.in_([Priority.URGENT, Priority.HIGH])
    ).all()
    return {"complaints": critical}

@router.post("/mass-reassign")
async def mass_reassign(request: MassReassignRequest, db: Session = Depends(get_db)):
    updated = 0
    for cid in request.complaint_ids:
        complaint = db.query(ComplaintModel).filter(ComplaintModel.id == cid).first()
        if complaint:
            complaint.assigned_to = request.assigned_to
            updated += 1
    db.commit()
    return {"success": True, "updated_count": updated}

@router.post("/force-escalate")
async def force_escalate(request: PriorityUpdateRequest, db: Session = Depends(get_db)):
    escalated = 0
    for cid in request.complaint_ids:
        complaint = db.query(ComplaintModel).filter(ComplaintModel.id == cid).first()
        if complaint:
            if request.priority == "urgent":
                complaint.priority = Priority.URGENT
            elif request.priority == "high":
                complaint.priority = Priority.HIGH
            escalated += 1
    db.commit()
    return {"success": True, "escalated_count": escalated}

@router.get("/compliance-pack")
async def download_compliance_pack(db: Session = Depends(get_db)):
    import io
    import csv
    import base64
    
    complaints = db.query(ComplaintModel).filter(
        ComplaintModel.status != ComplaintStatus.RESOLVED
    ).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Title", "Category", "Priority", "Status", "Assigned To", "Created At", "SLA Status", "Time Remaining"])
    
    for c in complaints:
        created = c.created_at or datetime.now()
        deadline_hours = 4 if c.priority == Priority.URGENT else 24
        sla_status = "AT RISK" if (datetime.now() - created).total_seconds() > deadline_hours * 3600 else "OK"
        
        writer.writerow([
            c.id,
            c.title,
            c.category or "",
            c.priority.value if c.priority else "",
            c.status.value if c.status else "",
            "Unassigned" if not c.assigned_to else c.assigned_to,
            created.strftime("%Y-%m-%d %H:%M") if c.created_at else "",
            sla_status,
            f"{deadline_hours}h"
        ])
    
    content = output.getvalue()
    return {
        "content": base64.b64encode(content.encode()).decode('utf-8'),
        "filename": f"compliance_pack_{datetime.now().strftime('%Y%m%d_%H%M')}.csv",
        "count": len(complaints)
    }

@router.get("/agents")
async def get_agents(db: Session = Depends(get_db)):
    from app.models.user import User, UserRole
    agents = db.query(User).filter(User.role.in_([UserRole.USER, UserRole.MANAGER])).all()
    return [{"id": u.id, "username": u.username} for u in agents]