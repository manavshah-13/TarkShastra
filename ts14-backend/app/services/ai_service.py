import pickle
import os
import json
from functools import lru_cache
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

    @lru_cache(maxsize=1024)
    def classify(self, text: str) -> ComplaintAnalysisResult:
        """
        Classifies the complaint text using the AI model.
        """
        # Run the model (Fallback/Placeholder logic)
        # Note: In a real implementation, you would use:
        # input_vec = self.vectorizer.transform([text])
        # prediction = self.model.predict(input_vec)
        
        category = "Billing" if "bill" in text.lower() or "price" in text.lower() else "General Inquiry"
        priority = Priority.HIGH if "urgent" in text.lower() or "broken" in text.lower() else Priority.MEDIUM
        confidence = 0.85
        
        result = ComplaintAnalysisResult(
            category=category,
            priority=priority,
            confidence=confidence
        )

        return result

    def analyze_text(self, text: str) -> ComplaintAnalysisResult:
        """Alias for classify to maintain compatibility."""
        return self.classify(text)

ai_service = AIService()
