from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.document import Document, DocumentExtraction
from app.schemas.extraction import ExtractionDataResponse, ExtractionDataUpdate
from app.services.extraction_service import ExtractionService

router = APIRouter(prefix="/api/extraction", tags=["extraction"])

@router.get("/{document_id}", response_model=ExtractionDataResponse)
def get_extraction_data(document_id: int, db: Session = Depends(get_db)):
    """
    문서 ID로 추출된 데이터를 조회합니다.
    """

    # 문서 존재 확인
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="문서를 찾을 수 없습니다.")

    # 추출된 데이터 조회
    extraction = db.query(DocumentExtraction).filter(
        DocumentExtraction.document_id == document_id
    ).first()

    if not extraction:
        # 문서 상태에 따라 다른 에러 메시지 반환
        if document.status == "failed":
            raise HTTPException(
                status_code=422,
                detail="데이터 추출에 실패했습니다. 문서를 다시 업로드하거나 /process 엔드포인트로 재처리를 시도해주세요."
            )
        elif document.status == "processing":
            raise HTTPException(
                status_code=202,
                detail="문서 처리 중입니다. 잠시 후 다시 시도해주세요."
            )
        else:
            raise HTTPException(
                status_code=404,
                detail="추출된 데이터가 없습니다. /process 엔드포인트로 추출을 시작해주세요."
            )

    return extraction

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
    OCR + LLM을 사용하여 문서에서 데이터를 추출합니다.
    """

    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="문서를 찾을 수 없습니다.")

    # 이미 추출된 데이터가 있는지 확인
    existing = db.query(DocumentExtraction).filter(
        DocumentExtraction.document_id == document_id
    ).first()

    if existing:
        return {
            "message": "이미 추출된 데이터가 있습니다.",
            "extraction_id": existing.id,
            "document_id": document_id
        }

    try:
        # ExtractionService를 사용하여 문서 처리
        extraction_service = ExtractionService()
        extraction = extraction_service.process_document(document_id, db)

        return {
            "message": "추출 프로세스가 완료되었습니다.",
            "document_id": document_id,
            "extraction_id": extraction.id
        }
    except ValueError as e:
        # 문서 상태를 실패로 변경
        document.status = "failed"
        db.commit()
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # 문서 상태를 실패로 변경
        document.status = "failed"
        db.commit()
        raise HTTPException(status_code=500, detail=f"추출 실패: {str(e)}")