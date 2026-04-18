from sqlalchemy import Column, Integer, String, DateTime, JSON, Enum
import enum
from datetime import datetime
from app.core.database import Base

class JobStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class BatchJob(Base):
    __tablename__ = "batch_jobs"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    status = Column(Enum(JobStatus), default=JobStatus.PENDING)
    total_records = Column(Integer, default=0)
    processed_records = Column(Integer, default=0)
    errors = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
