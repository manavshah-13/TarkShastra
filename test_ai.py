import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'ts14-backend'))

from app.services.ai_service import ai_service

# Test the AI service
test_text = "serum gives e pimples. what a bad product it is!"
result = ai_service.analyze_text(test_text)

print(f"Test text: {test_text}")
print(f"Category: {result.category}")
print(f"Priority: {result.priority}")
print(f"Confidence: {result.confidence}")
print(f"Recommended Action: {result.recommended_action}")
print(f"Explanation: {result.explanation}")
print(f"Estimated days: {result.estimated_resolution_days}")