import pickle
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
import os

def train_dummy_model():
    # Sample data
    data = [
        ("Internet is not working", "Connectivity"),
        ("Billing issue with my account", "Billing"),
        ("The product is broken", "Product Defect"),
        ("How do I reset my password?", "Technical Support"),
        ("Urgent: Refund requested", "Billing"),
        ("Slow service delivery", "General Inquiry")
    ]
    df = pd.DataFrame(data, columns=["text", "category"])
    
    vectorizer = TfidfVectorizer()
    X = vectorizer.fit_transform(df["text"])
    y = df["category"]
    
    model = RandomForestClassifier()
    model.fit(X, y)
    
    model_data = {
        "model": model,
        "vectorizer": vectorizer
    }
    
    with open("models.pkl", "wb") as f:
        pickle.dump(model_data, f)
    
    print("Dummy model trained and saved to models.pkl")

if __name__ == "__main__":
    train_dummy_model()
