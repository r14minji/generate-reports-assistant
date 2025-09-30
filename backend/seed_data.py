from app.core.database import SessionLocal, engine, Base
from app.models.document import Document, Analysis
from datetime import datetime, timedelta
import random

# 데이터베이스 테이블 생성
Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    # 기존 데이터 삭제 (선택사항)
    db.query(Analysis).delete()
    db.query(Document).delete()
    db.commit()

    # 목업 문서 데이터
    documents = [
        Document(
            filename="재무제표_2024.pdf",
            filepath="uploads/20240930_재무제표_2024.pdf",
            file_size=1024000,
            upload_date=datetime.utcnow() - timedelta(days=5),
            status="completed"
        ),
        Document(
            filename="사업계획서.docx",
            filepath="uploads/20240929_사업계획서.docx",
            file_size=512000,
            upload_date=datetime.utcnow() - timedelta(days=3),
            status="completed"
        ),
        Document(
            filename="대출신청서.pdf",
            filepath="uploads/20240930_대출신청서.pdf",
            file_size=256000,
            upload_date=datetime.utcnow() - timedelta(hours=5),
            status="processing"
        ),
        Document(
            filename="법인등기부등본.pdf",
            filepath="uploads/20240930_법인등기부등본.pdf",
            file_size=128000,
            upload_date=datetime.utcnow() - timedelta(hours=2),
            status="uploaded"
        ),
        Document(
            filename="감사보고서_2023.pdf",
            filepath="uploads/20240930_감사보고서_2023.pdf",
            file_size=2048000,
            upload_date=datetime.utcnow() - timedelta(hours=1),
            status="completed"
        ),
    ]

    for doc in documents:
        db.add(doc)

    db.commit()

    # 문서 ID를 가져오기 위해 refresh
    for doc in documents:
        db.refresh(doc)

    # 목업 분석 데이터
    analyses = [
        Analysis(
            document_id=documents[0].id,
            analysis_type="재무분석",
            result="양호",
            score=85.5,
            created_at=datetime.utcnow() - timedelta(days=4),
        ),
        Analysis(
            document_id=documents[0].id,
            analysis_type="신용평가",
            result="우수",
            score=92.0,
            created_at=datetime.utcnow() - timedelta(days=4),
        ),
        Analysis(
            document_id=documents[1].id,
            analysis_type="사업성평가",
            result="보통",
            score=75.3,
            created_at=datetime.utcnow() - timedelta(days=2),
        ),
        Analysis(
            document_id=documents[1].id,
            analysis_type="리스크분석",
            result="낮음",
            score=88.7,
            created_at=datetime.utcnow() - timedelta(days=2),
        ),
        Analysis(
            document_id=documents[4].id,
            analysis_type="재무분석",
            result="우수",
            score=90.2,
            created_at=datetime.utcnow() - timedelta(minutes=30),
        ),
        Analysis(
            document_id=documents[4].id,
            analysis_type="신용평가",
            result="양호",
            score=87.5,
            created_at=datetime.utcnow() - timedelta(minutes=20),
        ),
    ]

    for analysis in analyses:
        db.add(analysis)

    db.commit()

    print("✅ 목업 데이터가 성공적으로 추가되었습니다!")
    print(f"- 문서: {len(documents)}개")
    print(f"- 분석: {len(analyses)}개")

except Exception as e:
    print(f"❌ 오류 발생: {e}")
    db.rollback()
finally:
    db.close()