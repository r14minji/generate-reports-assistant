from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.document import Document, DocumentExtraction

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

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