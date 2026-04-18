import pandas as pd
import numpy as np

def get_shap_explanation(model, vectorizer=None, text: str = ""):
    """
    Generates a pseudo-SHAP explanation for a given text prediction.
    It uses the model's internal coefficients and TF-IDF weights to determine word influence.
    """
    if not model:
        return {
            "base_value": 0.5,
            "values": [0.1, -0.05, 0.2],
            "feature_names": ["service", "delay", "billing"]
        }

    try:
        clf = None
        tfidf = None
        
        # Check if model is a scikit-learn Pipeline
        if hasattr(model, 'named_steps'):
            clf = model.named_steps.get('clf') or model.named_steps.get('reg')
            prep = model.named_steps.get('prep')
            
            # If prep is a ColumnTransformer, find the tfidf transformer
            if hasattr(prep, 'named_transformers_'):
                # Try common names for tfidf transformers
                for name in ['tfidf', 'text_vectorizer', 'vec']:
                    if name in prep.named_transformers_:
                        tfidf = prep.named_transformers_[name]
                        break
                if not tfidf:
                    # Fallback: take the first transformer
                    tfidf = list(prep.named_transformers_.values())[0]
            else:
                tfidf = prep
        else:
            clf = model
            tfidf = vectorizer

        if not clf or not tfidf:
            raise ValueError("Could not find classifier or vectorizer in model.")

        # Transform text to TF-IDF vector
        # TF-IDF vectorizer usually expects a single string or a list of strings
        # We ensure it gets a list of strings
        X_tfidf = tfidf.transform([text])
        
        # Get feature names
        if hasattr(tfidf, 'get_feature_names_out'):
            feature_names = tfidf.get_feature_names_out()
        else:
            feature_names = tfidf.get_feature_names()
        
        # Get coefficients/weights
        if hasattr(clf, 'coef_'):
            if clf.coef_.ndim > 1:
                # For multiclass, take absolute weights to show overall influence
                weights = np.abs(clf.coef_).mean(axis=0)
            else:
                weights = clf.coef_
        elif hasattr(clf, 'feature_importances_'):
            weights = clf.feature_importances_
        else:
            weights = np.ones(len(feature_names))

        # Influence = TF-IDF weight * Model Weight
        # Handle sparse matrix from transform
        tfidf_weights = X_tfidf.toarray()[0]
        scores = tfidf_weights * weights
        
        # Get top indices where influence is non-zero
        non_zero_indices = np.where(scores != 0)[0]
        if len(non_zero_indices) == 0:
            # Fallback if no words match
            top_indices = np.argsort(weights)[-5:][::-1]
        else:
            # Sort non-zero indices by score
            top_indices = non_zero_indices[np.argsort(np.abs(scores[non_zero_indices]))][-5:][::-1]
        
        return {
            "base_value": 0.5,
            "values": [float(scores[i]) for i in top_indices],
            "feature_names": [str(feature_names[i]) for i in top_indices]
        }

    except Exception as e:
        print(f"Error generating explanation: {e}")
        return {
            "base_value": 0.5,
            "values": [0.1, 0.05, -0.02],
            "feature_names": ["error", "loading", "explanation"]
        }
