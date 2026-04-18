import pandas as pd
from model import predict_complaint

scenarios = [
    {
        "name": "Scenario 1: High Priority (Urgent) Product Issue",
        "text": "This product broke immediately! I need a refund urgently.",
        "sentiment": "negative"
    },
    {
        "name": "Scenario 2: Low Priority (No Rush) Trade Inquiry",
        "text": "I need bulk order details. What is the wholesale price? No rush.",
        "sentiment": "positive"
    },
    {
        "name": "Scenario 3: Medium Priority Packaging Issue",
        "text": "The package arrived crushed. It has been 5 days.",
        "sentiment": "neutral"
    },
    {
        "name": "Scenario 4: Ambiguous/Empty (Graceful Fallback Test)",
        "text": "asdfghjkl",
        "sentiment": "neutral"
    }
]

print("=== STARTING COMPREHENSIVE DIAGNOSTICS ===\n")
for sc in scenarios:
    print(f"--- {sc['name']} ---")
    print(f"Input: '{sc['text']}' (Sentiment: {sc['sentiment']})")
    cat, pri, time, rec, expl = predict_complaint(sc['text'], sentiment=sc['sentiment'])
    print(f"Categorization: {cat}")
    print(f"Priority Level: {pri}")
    print(f"Est. Resolution: {time:.1f} days")
    print(f"Recommended Action: {rec}")
    print(f"System Explanation: {expl}")
    print("-" * 50 + "\n")
