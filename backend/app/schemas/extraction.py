from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ExtractionDataResponse(BaseModel):
    id: int
    document_id: int

    # 회사 정보
    company_name: Optional[str] = None
    business_number: Optional[str] = None
    ceo_name: Optional[str] = None
    establishment_date: Optional[str] = None
    industry: Optional[str] = None
    address: Optional[str] = None

    # 재무 정보
    revenue: Optional[float] = None
    operating_profit: Optional[float] = None
    net_profit: Optional[float] = None
    total_assets: Optional[float] = None
    total_liabilities: Optional[float] = None
    equity: Optional[float] = None

    # 기타 정보
    employee_count: Optional[int] = None
    main_products: Optional[str] = None
    loan_purpose: Optional[str] = None
    loan_amount: Optional[float] = None

    # 메타데이터
    extracted_at: datetime
    extraction_method: str

    class Config:
        from_attributes = True