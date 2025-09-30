from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
import random

from app.core.database import get_db
from app.models.document import Document, DocumentExtraction
from app.schemas.extraction import ExtractionDataResponse, ExtractionDataUpdate

router = APIRouter(prefix="/api/extraction", tags=["extraction"])

@router.get("/{document_id}", response_model=ExtractionDataResponse)
def get_extraction_data(document_id: int, db: Session = Depends(get_db)):
    """
    문서 ID로 추출된 데이터를 조회합니다.
    실제 OCR이 없으므로 목업 데이터를 반환합니다.
    """

    # 문서 존재 확인
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="문서를 찾을 수 없습니다.")

    # 이미 추출된 데이터가 있는지 확인
    extraction = db.query(DocumentExtraction).filter(
        DocumentExtraction.document_id == document_id
    ).first()

    if extraction:
        return extraction

    # 추출 데이터가 없으면 목업 데이터 생성
    mock_extraction = DocumentExtraction(
        document_id=document_id,
        company_name="ABC 주식회사",
        business_number="123-45-67890",
        ceo_name="홍길동",
        establishment_date="2020-03-15",
        industry="제조업",
        address="서울특별시 강남구 테헤란로 123",
        revenue=15000000000.0,  # 150억
        operating_profit=2500000000.0,  # 25억
        net_profit=1800000000.0,  # 18억
        total_assets=30000000000.0,  # 300억
        total_liabilities=18000000000.0,  # 180억
        equity=12000000000.0,  # 120억
        employee_count=150,
        main_products="자동차 부품, 전자 제품 부품",
        loan_purpose="신규 생산 라인 구축 및 운영 자금",
        loan_amount=3000000000.0,  # 30억
        extracted_at=datetime.utcnow(),
        extraction_method="mock"
    )

    db.add(mock_extraction)

    # 문서 상태 업데이트
    document.status = "processing"

    db.commit()
    db.refresh(mock_extraction)

    return mock_extraction

@router.put("/{document_id}", response_model=ExtractionDataResponse)
def update_extraction_data(
    document_id: int,
    update_data: ExtractionDataUpdate,
    db: Session = Depends(get_db)
):
    """
    추출된 데이터를 수정합니다.
    """

    # 추출 데이터 조회
    extraction = db.query(DocumentExtraction).filter(
        DocumentExtraction.document_id == document_id
    ).first()

    if not extraction:
        raise HTTPException(status_code=404, detail="추출 데이터를 찾을 수 없습니다.")

    # 업데이트할 필드만 변경
    update_dict = update_data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(extraction, field, value)

    db.commit()
    db.refresh(extraction)

    return extraction

@router.post("/{document_id}/process")
def trigger_extraction(document_id: int, db: Session = Depends(get_db)):
    """
    문서 추출 프로세스를 수동으로 트리거합니다.
    (실제 OCR 구현 시 사용)
    """

    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="문서를 찾을 수 없습니다.")

    # 이미 추출된 데이터가 있는지 확인
    existing = db.query(DocumentExtraction).filter(
        DocumentExtraction.document_id == document_id
    ).first()

    if existing:
        return {"message": "이미 추출된 데이터가 있습니다.", "extraction_id": existing.id}

    document.status = "processing"
    db.commit()

    return {"message": "추출 프로세스가 시작되었습니다.", "document_id": document_id}