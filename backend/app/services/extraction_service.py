from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from datetime import datetime

from app.services.ocr_service import OCRService
from app.services.structured_data_service import StructuredDataService
from app.models.document import Document, DocumentExtraction


class ExtractionService:
    """문서에서 데이터를 추출하고 DB에 저장하는 서비스"""

    def __init__(self):
        self.ocr_service = OCRService()
        self.structured_data_service = StructuredDataService()

    def process_document(self, document_id: int, db: Session) -> DocumentExtraction:
        """
        문서를 처리하여 데이터를 추출하고 DB에 저장합니다.

        Args:
            document_id: 처리할 문서 ID
            db: 데이터베이스 세션

        Returns:
            DocumentExtraction: 추출된 데이터

        Raises:
            ValueError: 문서를 찾을 수 없거나 이미 처리된 경우
            Exception: 처리 중 오류 발생
        """

        # 문서 조회
        document = db.query(Document).filter(Document.id == document_id).first()
        if not document:
            raise ValueError(f"문서를 찾을 수 없습니다 (ID: {document_id})")

        # 이미 추출된 데이터가 있는지 확인
        existing = db.query(DocumentExtraction).filter(
            DocumentExtraction.document_id == document_id
        ).first()

        if existing:
            raise ValueError("이미 추출된 데이터가 있습니다.")

        try:
            # 문서 상태 업데이트
            document.status = "processing"
            db.commit()

            # 1단계: OCR로 텍스트 추출
            print(f"[ExtractionService] 문서 {document_id} OCR 처리 시작...")
            extracted_text = self.ocr_service.extract_text_from_file(document.filepath)

            if not extracted_text:
                raise ValueError("문서에서 텍스트를 추출할 수 없습니다.")

            print(f"[ExtractionService] OCR 완료. 추출된 텍스트 길이: {len(extracted_text)} 문자")

            # 2단계: 구조화된 데이터 추출
            print(f"[ExtractionService] 구조화된 데이터 추출 시작...")
            structured_data = self.structured_data_service.extract_document_data(
                document_text=extracted_text,
                document_type="기업 대출 신청서"
            )

            print(f"[ExtractionService] 구조화된 데이터 추출 완료")

            # 3단계: DB에 저장
            extraction = DocumentExtraction(
                document_id=document_id,
                company_name=structured_data.get("company_name"),
                business_number=structured_data.get("business_number"),
                ceo_name=structured_data.get("ceo_name"),
                establishment_date=structured_data.get("establishment_date"),
                industry=structured_data.get("industry"),
                address=structured_data.get("address"),
                revenue=structured_data.get("revenue"),
                operating_profit=structured_data.get("operating_profit"),
                net_profit=structured_data.get("net_profit"),
                total_assets=structured_data.get("total_assets"),
                total_liabilities=structured_data.get("total_liabilities"),
                equity=structured_data.get("equity"),
                employee_count=structured_data.get("employee_count"),
                main_products=structured_data.get("main_products"),
                loan_purpose=structured_data.get("loan_purpose"),
                loan_amount=structured_data.get("loan_amount"),
                extracted_at=datetime.utcnow(),
                extraction_method="ocr+structured_extraction"
            )

            db.add(extraction)

            # 문서 상태를 완료로 업데이트
            document.status = "completed"

            db.commit()
            db.refresh(extraction)

            print(f"[ExtractionService] 문서 {document_id} 처리 완료")

            return extraction

        except Exception as e:
            # 오류 발생 시 문서 상태를 실패로 업데이트
            document.status = "failed"
            db.commit()

            print(f"[ExtractionService] 오류 발생: {str(e)}")
            raise Exception(f"문서 처리 실패: {str(e)}")

    def reprocess_document(self, document_id: int, db: Session) -> DocumentExtraction:
        """
        이미 처리된 문서를 다시 처리합니다.

        Args:
            document_id: 재처리할 문서 ID
            db: 데이터베이스 세션

        Returns:
            DocumentExtraction: 재추출된 데이터
        """

        # 기존 추출 데이터 삭제
        existing = db.query(DocumentExtraction).filter(
            DocumentExtraction.document_id == document_id
        ).first()

        if existing:
            db.delete(existing)
            db.commit()

        # 다시 처리
        return self.process_document(document_id, db)
