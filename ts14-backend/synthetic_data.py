import json
import random

def generate_synthetic_complaints(n=20):
    categories = ["Billing", "Connectivity", "Technical Support", "Product Defect", "General Inquiry"]
    descriptions = [
        "My internet has been down for 2 days.",
        "I was overcharged for last month's subscription.",
        "The software crashes every time I open it.",
        "I need a refund for the faulty item.",
        "Where can I find the user manual?",
        "High latency during peak hours.",
        "Double payment deducted from my credit card.",
        "Feature X is not working as expected."
    ]
    
    complaints = []
    for _ in range(n):
        complaints.append({
            "title": f"Complaint #{random.randint(1000, 9999)}",
            "description": random.choice(descriptions),
            "category": random.choice(categories),
            "priority": random.choice(["low", "medium", "high", "urgent"]),
            "status": "new"
        })
    
    with open("synthetic_data.json", "w") as f:
        json.dump(complaints, f, indent=2)
    
    print(f"Generated {n} synthetic complaints in synthetic_data.json")

if __name__ == "__main__":
    generate_synthetic_complaints()
