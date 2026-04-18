from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Float, Text
from sqlalchemy.orm import relationship
import enum
from datetime import datetime
from app.core.database import Base

class ComplaintStatus(str, enum.Enum):
    NEW = "new"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"

class Priority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String, index=True) # AI Predicted
    priority = Column(Enum(Priority), default=Priority.MEDIUM)
    status = Column(Enum(ComplaintStatus), default=ComplaintStatus.NEW)
    ai_confidence = Column(Float)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
    
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)
    assigned_to_user = relationship("User", back_populates="complaints", foreign_keys=[assigned_to])
    
    soft_deleted = Column(DateTime, nullable=True)
