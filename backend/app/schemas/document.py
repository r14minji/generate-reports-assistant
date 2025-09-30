from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DocumentUploadResponse(BaseModel):
    id: int
    filename: str
    filepath: str
    file_size: int
    upload_date: datetime
    status: str

    class Config:
        from_attributes = True