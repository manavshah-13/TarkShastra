import sys
import os

# Add backend directory to sys.path to allow importing from the app package
sys.path.append(os.path.join(os.path.dirname(__file__), 'ts14-backend'))

from app.services.ai_service import ai_service

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

print("=== STARTING COMPREHENSIVE DIAGNOSTICS (PRODUCTION SERVICE) ===\n")
for sc in scenarios:
    print(f"--- {sc['name']} ---")
    print(f"Input: '{sc['text']}' (Sentiment: {sc['sentiment']})")
    
    # Use the production AIService logic
    result = ai_service.classify(sc['text'], sentiment=sc['sentiment'])
    
    print(f"Categorization: {result.category}")
    print(f"Priority Level: {result.priority}")
    print(f"Est. Resolution: {result.estimated_resolution_days} days")
    print(f"Recommended Action: {result.recommended_action}")
    print(f"System Explanation: {result.explanation}")
    print("-" * 50 + "\n")
