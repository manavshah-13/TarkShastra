from datetime import datetime, timedelta
from app.models.complaint import Complaint, Priority

def calculate_sla_deadline(complaint: Complaint) -> datetime:
    """
    Calculates SLA deadline based on priority.
    """
    if complaint.priority == Priority.URGENT:
        return complaint.created_at + timedelta(hours=4)
    elif complaint.priority == Priority.HIGH:
        return complaint.created_at + timedelta(hours=24)
    elif complaint.priority == Priority.MEDIUM:
        return complaint.created_at + timedelta(days=3)
    else: # LOW
        return complaint.created_at + timedelta(days=7)

def check_sla_compliance(complaint: Complaint) -> bool:
    if not complaint.resolved_at:
        return datetime.utcnow() <= calculate_sla_deadline(complaint)
    return complaint.resolved_at <= calculate_sla_deadline(complaint)
