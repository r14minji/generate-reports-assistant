from sqlalchemy import Column, Integer, String, DateTime, Float, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    filepath = Column(String, nullable=False)
    file_size = Column(Integer)
    upload_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="uploaded")  # uploaded, processing, completed, failed
    review_opinion = Column(Text, nullable=True)  # 심사 의견

    # Relationship
    extraction = relationship("DocumentExtraction", back_populates="document", uselist=False)
    analyses = relationship("Analysis", back_populates="document")

class DocumentExtraction(Base):
    __tablename__ = "document_extractions"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False, unique=True)

    # 회사 정보
    company_name = Column(String)
    business_number = Column(String)
    ceo_name = Column(String)
    establishment_date = Column(String)
    industry = Column(String)
    address = Column(String)

    # 재무 정보
    revenue = Column(Float)
    operating_profit = Column(Float)
    net_profit = Column(Float)
    total_assets = Column(Float)
    total_liabilities = Column(Float)
    equity = Column(Float)

    # 기타 정보
    employee_count = Column(Integer)
    main_products = Column(Text)
    loan_purpose = Column(Text)
    loan_amount = Column(Float)

    # 메타데이터
    extracted_at = Column(DateTime, default=datetime.utcnow)
    extraction_method = Column(String, default="manual")  # manual, ocr, api

    # Relationship
    document = relationship("Document", back_populates="extraction")

class AdditionalInfo(Base):
    __tablename__ = "additional_info"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False, unique=True)

    # AI 제안 필드 데이터 (JSON)
    field_data = Column(JSON, nullable=True)

    # 사용자 커스텀 필드 (JSON)
    custom_fields = Column(JSON, nullable=True)

    # 담보 정보 (JSON)
    collateral_data = Column(JSON, nullable=True)

    # 메타데이터
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship
    document = relationship("Document", backref="additional_info")

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    analysis_type = Column(String, nullable=False)
    result = Column(String)
    score = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship
    document = relationship("Document", back_populates="analyses")