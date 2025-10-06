from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
import os
import shutil
from datetime import datetime
from pathlib import Path
from pydantic import BaseModel
import google.generativeai as genai
import json

from app.core.database import get_db, SessionLocal
from app.models.document import Document, AdditionalInfo
from app.schemas.document import DocumentUploadResponse, ReportRequest, ReportResponse
from app.services.extraction_service import ExtractionService

router = APIRouter(prefix="/api/documents", tags=["documents"])

# 심사 의견 스키마
class ReviewOpinionRequest(BaseModel):
    review_opinion: str

class ReviewOpinionResponse(BaseModel):
    review_opinion: str | None

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# 허용된 파일 확장자
ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx", ".ppt", ".pptx", ".jpg", ".jpeg", ".png", ".gif"}
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB

# PDF와 이미지 파일은 자동으로 OCR 처리
OCR_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png", ".gif"}


def process_document_background(document_id: int):
    """백그라운드에서 문서를 처리합니다."""
    db = SessionLocal()
    try:
        extraction_service = ExtractionService()
        extraction_service.process_document(document_id, db)
        print(f"[Background] 문서 {document_id} 처리 완료")
    except Exception as e:
        print(f"[Background] 문서 {document_id} 처리 실패: {str(e)}")
    finally:
        db.close()

@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """파일을 업로드하고 데이터베이스에 저장합니다. PDF/이미지는 자동으로 OCR 처리됩니다."""

    try:
        # 파일 확장자 검증
        file_ext = Path(file.filename).suffix.lower()
        if file_ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"지원하지 않는 파일 형식입니다. 허용된 형식: {', '.join(ALLOWED_EXTENSIONS)}"
            )

        # 파일명 생성 (타임스탬프 포함, 안전한 파일명으로 변환)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_filename = "".join(c for c in file.filename if c.isalnum() or c in "._- ")
        filename = f"{timestamp}_{safe_filename}"
        filepath = os.path.join(UPLOAD_DIR, filename)

        # 파일 저장 (청크 단위로 읽어서 크기 제한 확인)
        file_size = 0
        with open(filepath, "wb") as buffer:
            while chunk := await file.read(8192):  # 8KB씩 읽기
                file_size += len(chunk)
                if file_size > MAX_FILE_SIZE:
                    buffer.close()
                    os.remove(filepath)  # 저장 중인 파일 삭제
                    raise HTTPException(
                        status_code=400,
                        detail=f"파일 크기가 제한을 초과했습니다. (최대: 50MB)"
                    )
                buffer.write(chunk)

        # 데이터베이스에 저장
        db_document = Document(
            filename=file.filename,
            filepath=filepath,
            file_size=file_size,
            upload_date=datetime.utcnow(),
            status="uploaded"
        )
        db.add(db_document)
        db.commit()
        db.refresh(db_document)

        # PDF 또는 이미지 파일인 경우 백그라운드에서 OCR 처리
        if file_ext in OCR_EXTENSIONS:
            background_tasks.add_task(process_document_background, db_document.id)
            print(f"[Upload] 문서 {db_document.id} OCR 처리 예약됨")

        return DocumentUploadResponse(
            id=db_document.id,
            filename=db_document.filename,
            filepath=db_document.filepath,
            file_size=db_document.file_size,
            upload_date=db_document.upload_date,
            status=db_document.status
        )

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        # 업로드 실패 시 파일 삭제
        if 'filepath' in locals() and os.path.exists(filepath):
            os.remove(filepath)
        raise HTTPException(status_code=500, detail=f"파일 업로드 실패: {str(e)}")
    finally:
        await file.close()

@router.put("/{document_id}/review-opinion", response_model=ReviewOpinionResponse)
def update_review_opinion(
    document_id: int,
    request: ReviewOpinionRequest,
    db: Session = Depends(get_db)
):
    """문서의 심사 의견을 업데이트합니다."""
    document = db.query(Document).filter(Document.id == document_id).first()

    if not document:
        raise HTTPException(status_code=404, detail="문서를 찾을 수 없습니다.")

    document.review_opinion = request.review_opinion
    db.commit()
    db.refresh(document)

    return ReviewOpinionResponse(review_opinion=document.review_opinion)

@router.get("/{document_id}/review-opinion", response_model=ReviewOpinionResponse)
def get_review_opinion(
    document_id: int,
    db: Session = Depends(get_db)
):
    """문서의 심사 의견을 조회합니다."""
    document = db.query(Document).filter(Document.id == document_id).first()

    if not document:
        raise HTTPException(status_code=404, detail="문서를 찾을 수 없습니다.")

    return ReviewOpinionResponse(review_opinion=document.review_opinion)

def generate_additional_information(additional_info_data: dict) -> str:
    """추가 정보를 기반으로 LLM이 인사이트를 생성합니다."""
    try:
        genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
        model = genai.GenerativeModel("gemini-2.0-flash")

        # 추가 정보 데이터를 텍스트로 변환
        field_data = additional_info_data.get("field_data", {})
        custom_fields = additional_info_data.get("custom_fields", {})
        collateral_data = additional_info_data.get("collateral_data", {})

        context = f"""
다음은 대출 심사 과정에서 수집된 추가 정보입니다:

【AI 제안 필드 데이터】
{json.dumps(field_data, ensure_ascii=False, indent=2)}

【사용자 입력 정보】
{json.dumps(custom_fields, ensure_ascii=False, indent=2)}

【담보 정보】
{json.dumps(collateral_data, ensure_ascii=False, indent=2)}

위 정보를 종합적으로 분석하여, 대출 심사에 도움이 되는 핵심 인사이트를 3-5개 문단으로 작성해주세요.
각 문단은 다음 관점을 포함해야 합니다:

1. 업계 특성 및 경쟁력 분석
2. 재무 안정성 및 성장 가능성
3. 경영진 역량 및 전략적 방향성
4. 담보 가치 및 회수 가능성 (담보가 있는 경우)
5. 종합적인 신용 평가 및 리스크 요인

전문적이고 명확한 한국어로 작성하되, 구체적인 수치와 근거를 포함해주세요.
"""

        response = model.generate_content(
            context,
            generation_config=genai.GenerationConfig(
                temperature=0.3,
            )
        )

        return response.text.strip()

    except Exception as e:
        print(f"[LLM] 추가 정보 생성 실패: {str(e)}")
        return "추가 정보를 생성할 수 없습니다."

@router.get("/{document_id}/report", response_model=ReportResponse)
def get_report(
    document_id: int,
    db: Session = Depends(get_db)
):
    """문서의 리포트 데이터를 조회합니다. 추가 정보가 있으면 LLM으로 인사이트를 생성합니다."""
    document = db.query(Document).filter(Document.id == document_id).first()

    if not document:
        raise HTTPException(status_code=404, detail="문서를 찾을 수 없습니다.")

    if not document.report_data:
        raise HTTPException(status_code=404, detail="리포트 데이터가 없습니다.")

    # 추가 정보가 있는 경우 LLM으로 인사이트 생성
    additional_info = db.query(AdditionalInfo).filter(
        AdditionalInfo.document_id == document_id
    ).first()

    report_data = document.report_data.copy()

    if additional_info and (additional_info.field_data or additional_info.custom_fields or additional_info.collateral_data):
        # LLM으로 추가 정보 생성
        additional_info_data = {
            "field_data": additional_info.field_data or {},
            "custom_fields": additional_info.custom_fields or {},
            "collateral_data": additional_info.collateral_data or {}
        }
        report_data["additional_information"] = generate_additional_information(additional_info_data)
    else:
        report_data["additional_information"] = None

    return ReportResponse(data=report_data)

@router.post("/{document_id}/report", response_model=ReportResponse)
def update_report(
    document_id: int,
    request: ReportRequest,
    db: Session = Depends(get_db)
):
    """문서의 리포트 데이터를 업데이트합니다."""
    document = db.query(Document).filter(Document.id == document_id).first()

    if not document:
        raise HTTPException(status_code=404, detail="문서를 찾을 수 없습니다.")

    document.report_data = request.data.model_dump()
    db.commit()
    db.refresh(document)

    return ReportResponse(data=document.report_data)