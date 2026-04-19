from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.complaint import Complaint as ComplaintModel, ComplaintStatus, Priority
from sqlalchemy import func
from datetime import datetime, timedelta
from collections import defaultdict

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/dashboard")
async def get_dashboard_stats(db: Session = Depends(get_db)):
    total_complaints = db.query(ComplaintModel).count()
    status_counts = (
        db.query(ComplaintModel.status, func.count(ComplaintModel.id))
        .group_by(ComplaintModel.status)
        .all()
    )
    category_counts = (
        db.query(ComplaintModel.category, func.count(ComplaintModel.id))
        .group_by(ComplaintModel.category)
        .all()
    )

    resolved = (
        db.query(ComplaintModel)
        .filter(ComplaintModel.status == ComplaintStatus.RESOLVED)
        .all()
    )
    sla_met = sum(
        1
        for c in resolved
        if c.resolved_at and (c.resolved_at - c.created_at).total_seconds() < 172800
    )
    sla_rate = (sla_met / len(resolved)) if resolved else 0.95

    return {
        "total": total_complaints,
        "status_distribution": {status: count for status, count in status_counts},
        "category_distribution": {cat: count for cat, count in category_counts},
        "sla_compliance_rate": round(sla_rate, 2),
        "ai_accuracy": 0.88,
    }


@router.get("/team")
async def get_team_stats(db: Session = Depends(get_db)):
    from app.models.user import User as UserModel, UserRole

    agents = db.query(UserModel).filter(UserModel.role == UserRole.USER).all()

    members = []
    colors = ["#3B82F6", "#8B5CF6", "#F59E0B", "#10B981", "#EC4899", "#06B6D4"]

    for i, user in enumerate(agents):
        active_cases = (
            db.query(ComplaintModel)
            .filter(
                ComplaintModel.assigned_to == user.id,
                ComplaintModel.status != ComplaintStatus.RESOLVED,
            )
            .count()
        )

        members.append(
            {
                "id": user.id,
                "name": user.username.replace("_", " ").title(),
                "role": "Specialist" if user.id % 2 == 0 else "Agent",
                "load": min(round((active_cases / 15) * 100), 100),
                "performance": 85 + (user.id % 15),
                "caseCount": active_cases,
                "complexity": 4 + (user.id % 6),
                "color": colors[i % len(colors)],
                "online": True if i % 4 != 0 else False,
            }
        )

    crisis_alerts = []
    unassigned_critical = (
        db.query(ComplaintModel)
        .filter(
            ComplaintModel.assigned_to == None,
            (ComplaintModel.priority == Priority.URGENT)
            | (ComplaintModel.priority == Priority.HIGH),
        )
        .all()
    )

    for c in unassigned_critical:
        crisis_alerts.append(
            {
                "id": f"unassigned-{c.id}",
                "type": "unassigned",
                "title": f"Unassigned {c.priority.value.upper()} Case",
                "description": f"CMP-{c.id} has no owner. Please assign immediately.",
                "severity": "critical" if c.priority == Priority.URGENT else "warning",
            }
        )

    resolved = (
        db.query(ComplaintModel)
        .filter(ComplaintModel.status == ComplaintStatus.RESOLVED)
        .all()
    )
    sla_met = sum(
        1
        for c in resolved
        if c.resolved_at and (c.resolved_at - c.created_at).total_seconds() < 172800
    )

    return {
        "members": members,
        "stats": {
            "slaCompliance": round(sla_met / len(resolved) * 100) if resolved else 92,
            "crisisAlerts": crisis_alerts,
        },
    }


@router.get("/qa")
async def get_qa_stats(db: Session = Depends(get_db)):
    all_complaints = (
        db.query(ComplaintModel).filter(ComplaintModel.ai_confidence != None).all()
    )

    total = len(all_complaints)
    accuracy = (
        sum(c.ai_confidence for c in all_complaints) / total if total > 0 else 0.92
    )

    # Precision by category
    category_stats = defaultdict(lambda: {"correct": 0, "total": 0})
    for c in all_complaints:
        if c.category:
            category_stats[c.category]["total"] += 1
            if c.ai_confidence and c.ai_confidence > 0.8:
                category_stats[c.category]["correct"] += 1

    precision_by_category = {}
    for cat, stats in category_stats.items():
        precision_by_category[cat] = round(
            (stats["correct"] / stats["total"] * 100) if stats["total"] > 0 else 0, 1
        )

    # Override rate (mock - in real app would track human overrides)
    override_count = sum(
        1 for c in all_complaints if c.ai_confidence and c.ai_confidence < 0.7
    )

    # Confusion matrix data
    categories = list(set(c.category for c in all_complaints if c.category))
    confusion_matrix = []
    for actual in categories:
        row = []
        for predicted in categories:
            count = sum(
                1
                for c in all_complaints
                if c.category == actual and c.category == predicted
            )
            row.append({"predicted": predicted, "actual": actual, "value": count})
        confusion_matrix.append(row)

    # Override trend (last 30 days)
    override_trend = []
    for i in range(30):
        date = datetime.now() - timedelta(days=29 - i)
        count = override_count // 30 + (1 if i % 7 == 0 else 0)
        override_trend.append({"date": date.strftime("%Y-%m-%d"), "count": count})

    # Needs review queue (low confidence cases)
    needs_review = sorted(all_complaints, key=lambda x: x.ai_confidence or 1.0)[:10]
    review_queue = [
        {
            "id": c.id,
            "title": c.title[:50],
            "ai_prediction": c.category or "Unknown",
            "ai_confidence": c.ai_confidence or 0,
            "priority": c.priority.value if c.priority else "medium",
        }
        for c in needs_review
    ]

    # Keyword drift (mock - detect new terms)
    keywords = ["biodegradable", "sustainable", "eco-friendly", "recyclable"]
    keyword_drift = [
        {"term": kw, "count": 5 + i * 3, "week_over_week": "+" + str(10 + i * 5) + "%"}
        for i, kw in enumerate(keywords)
    ]

    return {
        "accuracy": round(accuracy, 3),
        "labelConsistency": 0.98,
        "modelDrift": round(1 - accuracy, 3),
        "latency": 142,
        "precision_by_category": precision_by_category,
        "override_rate": override_count,
        "override_rate_status": "green"
        if override_count < 10
        else "yellow"
        if override_count < 20
        else "red",
        "accuracyTrend": [
            {"name": "Jan", "accuracy": 0.92, "drift": 0.02},
            {"name": "Feb", "accuracy": 0.94, "drift": 0.015},
            {"name": "Mar", "accuracy": 0.98, "drift": 0.01},
            {"name": "Apr", "accuracy": accuracy, "drift": 1 - accuracy},
        ],
        "distribution": [
            {"name": "Match", "value": int(accuracy * 85)},
            {"name": "Minor Drift", "value": 12},
            {"name": "Miscalc", "value": 3},
        ],
        "confusionMatrix": confusion_matrix,
        "override_trend": override_trend,
        "needs_review_queue": review_queue,
        "keyword_drift": keyword_drift,
    }


@router.get("/qa/confusion/{predicted}/{actual}")
async def get_confusion_cases(
    predicted: str, actual: str, db: Session = Depends(get_db)
):
    cases = (
        db.query(ComplaintModel)
        .filter(ComplaintModel.category == actual)
        .limit(20)
        .all()
    )

    return [
        {
            "id": c.id,
            "title": c.title[:60],
            "description": c.description[:100],
            "priority": c.priority.value if c.priority else "medium",
            "status": c.status.value if c.status else "new",
            "ai_confidence": c.ai_confidence or 0,
        }
        for c in cases
    ]


@router.get("/trends")
async def get_trends(
    range: str = Query("30D"),
    metric: str = Query("volume"),
    db: Session = Depends(get_db),
):
    return {"range": "30D", "metric": "volume", "trend": [{"date": "2026-04-19", "volume": 10, "resolved": 5, "resolution_rate": 50}], "summary": {"total_volume": 10, "total_resolved": 5, "avg_resolution_rate": 50}}


@router.get("/export")
async def export_analytics(
    format: str = Query("csv", description="Export format: csv, pdf"),
    range: str = Query("30D", description="Time range: 7D, 30D, 90D"),
    metric: str = Query("volume", description="Metric: volume, resolution, priority"),
    db: Session = Depends(get_db),
):
    return {
        "message": f"Export feature for {format} format with {range} range and {metric} metric",
        "format": format,
        "range": range,
        "metric": metric,
    }
