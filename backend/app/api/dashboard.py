from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, date
from typing import List

from app.core.database import get_db
from app.models.document import Document, Analysis, DocumentExtraction
from app.schemas.dashboard import DashboardStats, RecentAnalysisItem

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    """오늘의 통계 데이터를 반환합니다."""

    # 전체 문서 수
    total_documents = db.query(func.count(Document.id)).scalar()

    # 전체 분석 수
    total_analyses = db.query(func.count(Analysis.id)).scalar()

    # 오늘 날짜
    today = date.today()

    # 오늘 업로드된 문서 수
    today_uploads = db.query(func.count(Document.id)).filter(
        func.date(Document.upload_date) == today
    ).scalar()

    # 오늘 수행된 분석 수
    today_analyses = db.query(func.count(Analysis.id)).filter(
        func.date(Analysis.created_at) == today
    ).scalar()

    # 평균 점수
    avg_score = db.query(func.avg(Analysis.score)).scalar()

    return DashboardStats(
        total_documents=total_documents or 0,
        total_analyses=total_analyses or 0,
        today_uploads=today_uploads or 0,
        today_analyses=today_analyses or 0,
        avg_score=float(avg_score) if avg_score else None
    )

@router.get("/recent-analysis", response_model=List[RecentAnalysisItem])
def get_recent_analysis(limit: int = 10, db: Session = Depends(get_db)):
    """최근 분석 목록을 반환합니다."""

    recent_analyses = db.query(
        Analysis.id,
        Analysis.document_id,
        Document.filename,
        Analysis.analysis_type,
        Analysis.score,
        Analysis.created_at
    ).join(
        Document, Analysis.document_id == Document.id
    ).order_by(
        Analysis.created_at.desc()
    ).limit(limit).all()

    return [
        RecentAnalysisItem(
            id=analysis.id,
            document_id=analysis.document_id,
            filename=analysis.filename,
            analysis_type=analysis.analysis_type,
            score=analysis.score,
            created_at=analysis.created_at
        )
        for analysis in recent_analyses
    ]

@router.get("/completed-reports")
def get_completed_reports(db: Session = Depends(get_db)):
    """완료된 리포트 목록을 반환합니다."""

    completed_docs = db.query(Document).filter(
        Document.status == "completed"
    ).order_by(
        Document.upload_date.desc()
    ).all()

    result = []
    for doc in completed_docs:
        extraction = db.query(DocumentExtraction).filter(
            DocumentExtraction.document_id == doc.id
        ).first()

        result.append({
            "id": doc.id,
            "filename": doc.filename,
            "company_name": extraction.company_name if extraction else None,
            "industry": extraction.industry if extraction else None,
            "upload_date": doc.upload_date.isoformat() if doc.upload_date else None,
            "status": doc.status
        })

    return result