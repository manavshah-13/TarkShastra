import pickle
import os
import json
from functools import lru_cache
from app.core.config import settings
from app.schemas.complaint import ComplaintAnalysisResult, Priority

import joblib
import os
import json
import re
import numpy as np
import pandas as pd
from collections import Counter
from functools import lru_cache
from app.core.config import settings
from app.schemas.complaint import ComplaintAnalysisResult, Priority

class AIService:
    def __init__(self):
        self.cat_model = None
        self.pri_model = None
        self.res_model = None
        self.knn_model = None
        self.rec_prep = None
        self.sentiment_map = {'negative': 0, 'neutral': 1, 'positive': 2}
        
        self.load_models()

    def load_models(self):
        try:
            m_dir = settings.MODELS_DIR
            self.cat_model = joblib.load(os.path.join(m_dir, 'category_model.joblib'))
            self.pri_model = joblib.load(os.path.join(m_dir, 'priority_model.joblib'))
            self.res_model = joblib.load(os.path.join(m_dir, 'resolution_model.joblib'))
            self.knn_model = joblib.load(os.path.join(m_dir, 'knn_model.joblib'))
            self.rec_prep = joblib.load(os.path.join(m_dir, 'rec_prep.joblib'))
            print(f"Successfully loaded all AI models from {m_dir}")
        except Exception as e:
            print(f"Error loading models: {e}")

    @lru_cache(maxsize=1024)
    def classify(self, text: str, sentiment: str = 'neutral') -> ComplaintAnalysisResult:
        """
        Classifies the complaint text using the loaded AI models and generates recommendations.
        """
        if not self.cat_model:
            # Fallback
            return ComplaintAnalysisResult(
                category="General",
                priority=Priority.MEDIUM,
                confidence=0.5,
                recommended_action="Manual Review",
                explanation="AI model not initialized.",
                estimated_resolution_days=3.0
            )

        # Prepare temporary dataframe for prediction
        temp_df = pd.DataFrame([{
            'text': text,
            'text_clean': text.lower().strip(),  # Keep full text for inference
            'sentiment': sentiment,
            'sentiment_num': self.sentiment_map.get(sentiment.lower(), 1),
            'text_len': len(text),
            'exclamation_count': text.count('!'),
            'urgent_words': int(bool(re.search(r'\b(urgent|asap|immediately|critical)\b', text, re.I))),
            'has_days': int(bool(re.search(r'\b\d+\s*day', text, re.I))),
            'has_weeks': int(bool(re.search(r'\b\d+\s*week', text, re.I)))
        }])

        # 1. Category Prediction
        category = self.cat_model.predict(temp_df)[0]
        
        # 2. Priority Prediction
        priority_raw = self.pri_model.predict(temp_df)[0]
        # Map model output to Priority enum if necessary
        priority = Priority.HIGH if priority_raw in ['P0', 'P1', 'High'] else Priority.MEDIUM
        
        # 3. Resolution Time Prediction (Log scale expected from model.py)
        res_log = self.res_model.predict(temp_df)[0]
        resolution_days = float(np.expm1(res_log))
        
        # 4. Explainable Recommendation using KNN
        tfidf_vec = self.rec_prep.transform(temp_df)
        distances, indices = self.knn_model.kneighbors(tfidf_vec)
        
        try:
            # Read the CSV to get historical resolution actions
            csv_path = settings.DATA_FILE_PATH
            live_df = pd.read_csv(csv_path)
            neighbors_resolutions = live_df['resolution_action'].iloc[indices[0]].values
            
            common_results = Counter(neighbors_resolutions).most_common(1)
            if not common_results:
                recommended_action = "Manual Review"
                explanation = "Historical consensus could not be established."
                confidence = 0.5
            else:
                most_common_res, count = common_results[0]
                confidence = float(count / 5.0)
                if count < 3:
                    recommended_action = 'Escalate to supervisor'
                    explanation = f"We suggested 'Escalate to supervisor' because no clear consensus (<3 cases) was found among past similar cases."
                else:
                    recommended_action = most_common_res
                    explanation = f"We suggested '{most_common_res}' because {confidence*100:.0f}% ({count} out of 5) of similar past cases used it."
        except Exception as e:
            print(f"Error in recommendation logic: {e}")
            recommended_action = "Manual Review"
            explanation = "Failed to retrieve historical consensus."
            confidence = 0.5

        return ComplaintAnalysisResult(
            category=category,
            priority=priority,
            confidence=confidence,
            recommended_action=recommended_action,
            explanation=explanation,
            estimated_resolution_days=round(resolution_days, 1)
        )

    def analyze_text(self, text: str) -> ComplaintAnalysisResult:
        """Alias for classify to maintain compatibility."""
        return self.classify(text)

ai_service = AIService()
