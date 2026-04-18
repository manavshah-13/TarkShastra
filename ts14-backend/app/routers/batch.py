from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.batch_job import BatchJob, JobStatus
from datetime import datetime
import uuid

router = APIRouter(prefix="/complaints/batch", tags=["batch operations"])

@router.post("/")
async def upload_batch(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
    
    job = BatchJob(
        filename=file.filename,
        status=JobStatus.PENDING
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    
    # In a real app, we would trigger a background task here (e.g., Celery)
    return {"job_id": job.id, "status": job.status}

@router.get("/{job_id}/status")
async def get_job_status(job_id: int, db: Session = Depends(get_db)):
    job = db.query(BatchJob).filter(BatchJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.get("/{job_id}/results")
async def get_job_results(job_id: int, db: Session = Depends(get_db)):
    job = db.query(BatchJob).filter(BatchJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"results": "...", "errors": job.errors}
