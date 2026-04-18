import pandas as pd
import numpy as np
import re
import joblib
from sklearn.metrics import mean_absolute_error, r2_score

print("Loading data and models...")
inference_df = pd.read_csv('inference.csv')

cat_model = joblib.load('category_model.joblib')
priority_model = joblib.load('priority_model.joblib')
reg_model = joblib.load('resolution_model.joblib')

sentiment_map = {'negative': 0, 'neutral': 1, 'positive': 2}
URGENT_PATTERN = r'\b(?:urgent|asap|immediately|critical|emergency|quick|fast|resolve soon|deadline)\b'
CATEGORY_PATTERN = r'\b(packaging|product|trade)\b'

def prepare_inference_data(df):
    temp = pd.DataFrame()
    temp['text'] = df['user_complaint_text'].astype(str)
    
    # 1. Cleaned text for category
    temp['text_clean'] = temp['text'].str.lower().replace(CATEGORY_PATTERN, '', regex=True).str.strip()
    
    # 2. Features for priority & regression
    # Infer sentiment dynamically to trigger High/Low/Medium priority classifications
    def guess_sentiment(t):
        t = t.lower()
        if any(w in t for w in ['broken', 'defective', 'poor', 'stopped', 'malfunctioning']):
            return sentiment_map['negative']  # Routes to High Priority
        elif any(w in t for w in ['bulk', 'query', 'pricing']):
            return sentiment_map['positive']  # Routes to Low Priority
        return sentiment_map['neutral']       # Routes to Medium Priority
        
    temp['sentiment_num'] = temp['text'].apply(guess_sentiment)
    
    temp['text_len'] = temp['text'].str.len()
    temp['exclamation_count'] = temp['text'].str.count('!')
    temp['urgent_words'] = temp['text'].str.contains(URGENT_PATTERN, case=False, regex=True).astype(int)
    temp['has_days'] = temp['text'].str.contains(r'\b\d+\s*day', case=False).astype(int)
    temp['has_weeks'] = temp['text'].str.contains(r'\b\d+\s*week', case=False).astype(int)
    
    return temp

print("Preparing features...")
X_infer = prepare_inference_data(inference_df)

print("Predicting...\n")
inference_df['predicted_category'] = cat_model.predict(X_infer)
inference_df['predicted_priority'] = priority_model.predict(X_infer)

resolution_log = reg_model.predict(X_infer)
inference_df['predicted_resolution'] = np.expm1(resolution_log)

print(inference_df[['user_complaint_text', 'predicted_category', 'predicted_priority', 'predicted_resolution', 'actual_resolution_time']].head(15))

# Calculate MAE since actuals are provided
mae = mean_absolute_error(inference_df['actual_resolution_time'], inference_df['predicted_resolution'])
print(f"\nMean Absolute Error on inference dataset: {mae:.2f} days")
