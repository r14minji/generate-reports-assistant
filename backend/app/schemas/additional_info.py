from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime


class CustomFields(BaseModel):
    special_considerations: Optional[str] = None
    management_evaluation: Optional[str] = None
    other_notes: Optional[str] = None


class AdditionalInfoBase(BaseModel):
    document_id: int
    field_data: Optional[Dict[str, Any]] = None
    custom_fields: Optional[CustomFields] = None


class AdditionalInfoCreate(AdditionalInfoBase):
    pass


class AdditionalInfoUpdate(BaseModel):
    field_data: Optional[Dict[str, Any]] = None
    custom_fields: Optional[CustomFields] = None


class AdditionalInfoResponse(AdditionalInfoBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SuggestedField(BaseModel):
    id: str
    label: str
    description: str
    type: str  # "text", "number", "textarea", "date"
    required: bool
    placeholder: Optional[str] = None


class IndustryInsight(BaseModel):
    title: str
    content: str
    type: str  # "positive", "negative", "neutral"


class AdditionalInfoSuggestion(BaseModel):
    document_id: int
    industry: str
    ai_reason: str
    industry_outlook: Optional[str] = None
    insights: Optional[list[IndustryInsight]] = None
    suggested_fields: list[SuggestedField]
