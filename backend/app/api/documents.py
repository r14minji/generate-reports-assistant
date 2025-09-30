from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
import os
import shutil
from datetime import datetime

from app.core.database import get_db
from app.models.document import Document
from app.schemas.document import DocumentUploadResponse

router = APIRouter(prefix="/api/documents", tags=["documents"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """파일을 업로드하고 데이터베이스에 저장합니다."""

    try:
        # 파일명 생성 (타임스탬프 포함)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{file.filename}"
        filepath = os.path.join(UPLOAD_DIR, filename)

        # 파일 저장
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 파일 크기 확인
        file_size = os.path.getsize(filepath)

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

        return DocumentUploadResponse(
            id=db_document.id,
            filename=db_document.filename,
            filepath=db_document.filepath,
            file_size=db_document.file_size,
            upload_date=db_document.upload_date,
            status=db_document.status
        )

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"파일 업로드 실패: {str(e)}")
    finally:
        file.file.close()