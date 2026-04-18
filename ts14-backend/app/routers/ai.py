from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.ai_service import ai_service
from app.utils.explainability import get_shap_explanation
from app.schemas.complaint import ComplaintAnalyze, ComplaintAnalysisResult, SHAPExplanation
from app.models.complaint import Complaint as ComplaintModel

router = APIRouter(prefix="/ai", tags=["AI Features"])

@router.get("/complaints/{id}/explain", response_model=SHAPExplanation)
async def get_explanation(id: int, db: Session = Depends(get_db)):
    complaint = db.query(ComplaintModel).filter(ComplaintModel.id == id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    # In real world, we pass the text to SHAP utility
    explanation = get_shap_explanation(ai_service.cat_model, ai_service.rec_prep, complaint.description)
    return explanation

@router.post("/analyze-text", response_model=ComplaintAnalysisResult)
async def analyze_text(payload: ComplaintAnalyze):
    return ai_service.analyze_text(payload.text)
