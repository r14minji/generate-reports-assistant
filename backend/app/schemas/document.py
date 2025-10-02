from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any, List

class DocumentUploadResponse(BaseModel):
    id: int
    filename: str
    filepath: str
    file_size: int
    upload_date: datetime
    status: str

    class Config:
        from_attributes = True

# 리포트 데이터 스키마
class CompanyInfo(BaseModel):
    name: str
    industry: str
    established_year: str
    main_business: str
    main_clients: str

class FinancialRatios(BaseModel):
    debt_ratio: str
    current_ratio: str
    operating_margin: str

class Revenue(BaseModel):
    current_year: str
    next_year: str
    year_after_next: str

class Financial(BaseModel):
    ratios: FinancialRatios
    revenue: Revenue

class Risk(BaseModel):
    high: List[str]
    medium: List[str]
    positive: List[str]

class LoanConditions(BaseModel):
    approval_limit: str
    interest_rate: str
    repayment_period: str
    collateral: str

class Loan(BaseModel):
    conditions: LoanConditions
    approval_requirements: List[str]

class ReportData(BaseModel):
    summary: str
    company: CompanyInfo
    financial: Financial
    risk: Risk
    loan: Loan

class ReportRequest(BaseModel):
    data: ReportData

class ReportResponse(BaseModel):
    data: ReportData