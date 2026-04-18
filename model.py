
import pandas as pd
import numpy as np
import re
import joblib
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression, Ridge
from sklearn.ensemble import RandomForestRegressor
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import FunctionTransformer, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report, r2_score, mean_absolute_error


df = pd.read_csv(r'C:\Users\MANAV\Desktop\TarkShastra\Tarkshastra\TS-PS14.csv')


df['text'] = df['text'].fillna('').astype(str)
df['sentiment'] = df['sentiment'].fillna('neutral').astype(str).str.lower()


sentiment_map = {'negative': 0, 'neutral': 1, 'positive': 2}
df['sentiment_num'] = df['sentiment'].map(sentiment_map).fillna(1)

def remove_category_keywords(text, category):
    """Remove the category word from the complaint text to prevent leakage."""
    if not isinstance(text, str):
        return ''
    if not isinstance(category, str):
        return text.lower().strip()
    
    pattern = r'\b' + re.escape(category.lower()) + r'\b'
    return re.sub(pattern, '', text.lower()).strip()

df['text_clean'] = df.apply(lambda row: remove_category_keywords(row['text'], row['category']), axis=1)


df['text_len'] = df['text'].str.len()
df['exclamation_count'] = df['text'].str.count('!')
df['urgent_words'] = df['text'].str.contains(
    r'\b(?:urgent|asap|immediately|critical|emergency|quick|fast|resolve soon|deadline)\b', 
    case=False, regex=True
).astype(int)


df['has_days'] = df['text'].str.contains(r'\b\d+\s*day', case=False).astype(int)
df['has_weeks'] = df['text'].str.contains(r'\b\d+\s*week', case=False).astype(int)


text_col = 'text_clean'          
priority_text_col = 'text'       
numeric_features = ['text_len', 'exclamation_count', 'urgent_words', 'sentiment_num', 
                    'has_days', 'has_weeks']


def get_text_column(data, col_name):
    return data[col_name]


X = df.copy()
y_cat = df['category']
y_pri = df['priority']
y_reg = df['resolution_time']

X_train, X_test, y_cat_train, y_cat_test, y_pri_train, y_pri_test, y_reg_train, y_reg_test = train_test_split(
    X, y_cat, y_pri, y_reg, test_size=0.2, random_state=42, stratify=y_pri
)


cat_preprocessor = ColumnTransformer([
    ('tfidf', TfidfVectorizer(max_features=5000, ngram_range=(1,2)), 
     text_col)
])

cat_model = Pipeline([
    ('prep', cat_preprocessor),
    ('clf', LogisticRegression(C=1.0, solver='lbfgs', max_iter=1000))
])

cat_model.fit(X_train, y_cat_train)
y_cat_pred = cat_model.predict(X_test)

print("=== Category Classifier (no leakage) ===")
print(f"Accuracy: {accuracy_score(y_cat_test, y_cat_pred):.4f}")
print(classification_report(y_cat_test, y_cat_pred))

def get_priority_text(X):
    return X[priority_text_col]

priority_preprocessor = ColumnTransformer([
    ('tfidf', TfidfVectorizer(max_features=5000, ngram_range=(1,2)), 
     priority_text_col),
    ('numeric', 'passthrough', numeric_features)
])

priority_model = Pipeline([
    ('prep', priority_preprocessor),
    ('clf', LogisticRegression(class_weight='balanced', C=1.0, solver='lbfgs', max_iter=1000))
])

priority_model.fit(X_train, y_pri_train)
y_pri_pred = priority_model.predict(X_test)

print("=== Priority Classifier ===")
print(f"Accuracy: {accuracy_score(y_pri_test, y_pri_pred):.4f}")
print(classification_report(y_pri_test, y_pri_pred))


param_grid = {
    'clf__C': [0.5, 1.0, 2.0],
    'prep__tfidf__max_features': [3000, 5000]
}

reg_preprocessor = ColumnTransformer([
    ('tfidf', TfidfVectorizer(max_features=3000, ngram_range=(1,1)), 
     priority_text_col),
    ('numeric', StandardScaler(), numeric_features)
])


y_reg_train_log = np.log1p(y_reg_train)
y_reg_test_log = np.log1p(y_reg_test)

reg_model = Pipeline([
    ('prep', reg_preprocessor),
    ('reg', RandomForestRegressor(n_estimators=100, max_depth=15, random_state=42, n_jobs=-1))
])

reg_model.fit(X_train, y_reg_train_log)
y_pred_log = reg_model.predict(X_test)
y_pred = np.expm1(y_pred_log)

print("=== Resolution Time Regressor ===")
print(f"R² score: {r2_score(y_reg_test, y_pred):.4f}")
print(f"MAE: {mean_absolute_error(y_reg_test, y_pred):.2f} days")




joblib.dump(cat_model, 'category_model.joblib')
joblib.dump(priority_model, 'priority_model.joblib')
joblib.dump(reg_model, 'resolution_model.joblib')
print("Models saved successfully.")


def predict_complaint(complaint_text, sentiment='neutral'):
    """Return category, priority, and expected resolution time."""
    import pandas as pd
    temp_df = pd.DataFrame([{
        'text': complaint_text,
        'text_clean': re.sub(r'\b(packaging|product|trade)\b', '', complaint_text.lower()),
        'sentiment': sentiment,
        'sentiment_num': sentiment_map[sentiment],
        'text_len': len(complaint_text),
        'exclamation_count': complaint_text.count('!'),
        'urgent_words': int(bool(re.search(r'\b(urgent|asap|immediately|critical)\b', complaint_text, re.I))),
        'has_days': int(bool(re.search(r'\b\d+\s*day', complaint_text, re.I))),
        'has_weeks': int(bool(re.search(r'\b\d+\s*week', complaint_text, re.I)))
    }])
    category = cat_model.predict(temp_df)[0]
    priority = priority_model.predict(temp_df)[0]
    resolution_log = reg_model.predict(temp_df)[0]
    resolution = np.expm1(resolution_log)
    return category, priority, resolution


test_text = "This product broke immediately! I need a refund urgently."
cat, pri, time = predict_complaint(test_text, sentiment='negative')
print(f"\nTest complaint: {test_text}")
print(f"Predicted category: {cat}, priority: {pri}, resolution time: {time:.1f} days")