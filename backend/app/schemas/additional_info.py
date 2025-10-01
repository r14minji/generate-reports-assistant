from pydantic import BaseModel
from typing import Optional, Dict, Any, Literal
from datetime import datetime


class CustomFields(BaseModel):
    special_considerations: Optional[str] = None
    management_evaluation: Optional[str] = None
    other_notes: Optional[str] = None


class CollateralData(BaseModel):
    type: Literal["담보", "신용", "기타"]
    appraisal_value: Optional[str] = None
    auction_rate: Optional[str] = None
    senior_lien: Optional[str] = None
    co_lien_share: Optional[str] = None
    our_allocation: Optional[str] = None
    recovery_expected: Optional[str] = None
    recovery_amount: Optional[str] = None
    loss_amount: Optional[str] = None
    loss_opinion: Optional[str] = None


class AdditionalInfoBase(BaseModel):
    document_id: int
    field_data: Optional[Dict[str, Any]] = None
    custom_fields: Optional[CustomFields] = None
    collateral_data: Optional[CollateralData] = None


class AdditionalInfoCreate(AdditionalInfoBase):
    pass


class AdditionalInfoUpdate(BaseModel):
    field_data: Optional[Dict[str, Any]] = None
    custom_fields: Optional[CustomFields] = None
    collateral_data: Optional[CollateralData] = None


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
