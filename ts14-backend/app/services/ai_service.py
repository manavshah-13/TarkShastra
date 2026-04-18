import pickle
import os
from app.core.config import settings
from app.schemas.complaint import ComplaintAnalysisResult, Priority

class AIService:
    def __init__(self):
        self.model = None
        self.vectorizer = None
        self.load_model()

    def load_model(self):
        if os.path.exists(settings.AI_MODEL_PATH):
            try:
                with open(settings.AI_MODEL_PATH, "rb") as f:
                    data = pickle.load(f)
                    self.model = data.get("model")
                    self.vectorizer = data.get("vectorizer")
            except Exception as e:
                print(f"Error loading model: {e}")
        else:
            print(f"Model file not found at {settings.AI_MODEL_PATH}")

    def analyze_text(self, text: str) -> ComplaintAnalysisResult:
        if self.model and self.vectorizer:
            # Placeholder for actual inference logic
            # input_vec = self.vectorizer.transform([text])
            # prediction = self.model.predict(input_vec)
            # confidence = max(self.model.predict_proba(input_vec)[0])
            pass
        
        # Fallback / Placeholder logic
        category = "Billing" if "bill" in text.lower() or "price" in text.lower() else "General Inquiry"
        priority = Priority.HIGH if "urgent" in text.lower() or "broken" in text.lower() else Priority.MEDIUM
        confidence = 0.85
        
        return ComplaintAnalysisResult(
            category=category,
            priority=priority,
            confidence=confidence
        )

ai_service = AIService()
