from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.complaint import ComplaintStatus, Priority

class ComplaintBase(BaseModel):
    title: str
    description: str

class ComplaintCreate(ComplaintBase):
    pass

class ComplaintStatusUpdate(BaseModel):
    status: Optional[ComplaintStatus] = None
    assigned_to: Optional[int] = None

class ComplaintUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[ComplaintStatus] = None
    priority: Optional[Priority] = None
    assigned_to: Optional[int] = None

class Complaint(ComplaintBase):
    id: int
    category: Optional[str] = None
    priority: Priority
    status: ComplaintStatus
    ai_confidence: Optional[float] = None
    created_at: datetime
    updated_at: datetime
    resolved_at: Optional[datetime] = None
    assigned_to: Optional[int] = None

    class Config:
        from_attributes = True

class ComplaintAnalyze(BaseModel):
    text: str

class ComplaintAnalysisResult(BaseModel):
    category: str
    priority: Priority
    confidence: float
    recommended_action: str
    explanation: str
    estimated_resolution_days: float

class SHAPExplanation(BaseModel):
    base_value: float
    values: List[float]
    feature_names: List[str]
