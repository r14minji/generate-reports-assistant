from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DashboardStats(BaseModel):
    total_documents: int
    total_analyses: int
    today_uploads: int
    today_analyses: int
    avg_score: Optional[float]

class RecentAnalysisItem(BaseModel):
    id: int
    document_id: int
    filename: str
    analysis_type: str
    score: Optional[float]
    created_at: datetime

    class Config:
        from_attributes = True