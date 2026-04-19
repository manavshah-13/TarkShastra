import pandas as pd
import numpy as np
import re
import joblib
from sklearn.metrics import mean_absolute_error, r2_score
from collections import Counter

print("Loading data and models...")
inference_df = pd.read_csv('inference.csv')

cat_model = joblib.load('category_model.joblib')
priority_model = joblib.load('priority_model.joblib')
reg_model = joblib.load('resolution_model.joblib')
knn_model = joblib.load('knn_model.joblib')
rec_prep = joblib.load('rec_prep.joblib')

sentiment_map = {'negative': 0, 'neutral': 1, 'positive': 2}
URGENT_PATTERN = r'\b(?:urgent|asap|immediately|critical|emergency|quick|fast|resolve soon|deadline)\b'
CATEGORY_PATTERN = r'\b(packaging|product|trade)\b'

def prepare_inference_data(df):
    temp = pd.DataFrame()
    temp['text'] = df['user_complaint_text'].astype(str)
    
    # 1. Cleaned text for category (keep full text for inference)
    temp['text_clean'] = temp['text'].str.lower().str.strip()
    
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

# Test the specific case mentioned by user
test_text = "serum gives e pimples. what a bad product it is!"
test_df = prepare_inference_data(pd.DataFrame({'user_complaint_text': [test_text]}))
test_category = cat_model.predict(test_df)[0]
test_priority = priority_model.predict(test_df)[0]
test_resolution = np.expm1(reg_model.predict(test_df)[0])

# Test recommendation logic
tfidf_vec = rec_prep.transform(test_df)
distances, indices = knn_model.kneighbors(tfidf_vec)

live_df = pd.read_csv('TS-PS14.csv')
neighbors_resolutions = live_df['resolution_action'].iloc[indices[0]].values
most_common_res, count = Counter(neighbors_resolutions).most_common(1)[0]

if count < 3:
    recommended_action = 'Escalate to supervisor'
    explanation = "We suggested 'Escalate to supervisor' because no clear consensus (<3 cases) was found among past similar cases."
else:
    confidence = (count / 5.0) * 100
    recommended_action = most_common_res
    explanation = f"We suggested '{most_common_res}' because {confidence:.0f}% ({count} out of 5) of similar past cases used it."

print(f"\nUser test case: '{test_text}'")
print(f"Predicted category: {test_category}")
print(f"Predicted priority: {test_priority}")
print(f"Predicted resolution time: {test_resolution:.1f} days")
print(f"Recommended Action: {recommended_action}")
print(f"Explanation: {explanation}")
print(f"Neighbor actions: {neighbors_resolutions}")

print("\n" + "="*50)
print("First 15 inference results:")
print(inference_df[['user_complaint_text', 'predicted_category', 'predicted_priority', 'predicted_resolution', 'actual_resolution_time']].head(15))

# Calculate MAE since actuals are provided
mae = mean_absolute_error(inference_df['actual_resolution_time'], inference_df['predicted_resolution'])
print(f"\nMean Absolute Error on inference dataset: {mae:.2f} days")
