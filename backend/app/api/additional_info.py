from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import os
import google.generativeai as genai
import json

from app.core.database import get_db
from app.models.document import Document, DocumentExtraction, AdditionalInfo
from app.schemas.additional_info import (
    AdditionalInfoCreate,
    AdditionalInfoUpdate,
    AdditionalInfoResponse,
    AdditionalInfoSuggestion,
    SuggestedField,
    IndustryInsight,
)

router = APIRouter(prefix="/api/additional-info", tags=["additional-info"])


@router.get("/{document_id}/suggestions", response_model=AdditionalInfoSuggestion)
def get_suggested_fields(document_id: int, db: Session = Depends(get_db)):
    """
    문서 ID를 기반으로 AI가 제안하는 추가 정보 필드를 반환합니다.
    추출된 산업 정보를 기반으로 LLM이 필요한 필드를 제안합니다.
    """
    # 문서 존재 확인
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="문서를 찾을 수 없습니다.")

    # 추출된 데이터에서 산업 정보 가져오기
    extraction = (
        db.query(DocumentExtraction)
        .filter(DocumentExtraction.document_id == document_id)
        .first()
    )

    if not extraction:
        raise HTTPException(status_code=404, detail="추출된 데이터를 찾을 수 없습니다.")

    industry = extraction.industry or "일반 산업"

    # LLM을 사용하여 산업별 맞춤 필드 제안
    try:
        genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
        model = genai.GenerativeModel("gemini-2.0-flash")

        prompt = f"""
당신은 대출 심사 전문가입니다. 다음 산업에 대한 대출 심사를 위해 필요한 추가 정보를 제안해주세요.

산업: {industry}

다음 형식의 JSON으로 응답해주세요:

{{
  "ai_reason": "이 산업에서 추가 정보가 필요한 이유 (1-2문장)",
  "industry_outlook": "현재 산업 동향 및 전망 분석 (3-4문장)",
  "insights": [
    {{"title": "인사이트 제목", "content": "인사이트 내용 (2-3문장)", "type": "positive/negative/neutral"}},
    {{"title": "인사이트 제목", "content": "인사이트 내용 (2-3문장)", "type": "positive/negative/neutral"}},
    {{"title": "인사이트 제목", "content": "인사이트 내용 (2-3문장)", "type": "positive/negative/neutral"}},
    {{"title": "인사이트 제목", "content": "인사이트 내용 (2-3문장)", "type": "positive/negative/neutral"}}
  ],
  "suggested_fields": [
    {{
      "id": "field_id_1",
      "label": "필드명",
      "description": "필드 설명",
      "type": "text/number/textarea/date",
      "required": true/false,
      "placeholder": "입력 예시"
    }},
    // 산업에 맞는 5-7개의 필드 제안
  ]
}}

insights는 최소 3개, 최대 5개로 제안하고, type은 positive(기회), negative(위험), neutral(참고)로 구분해주세요.
suggested_fields는 해당 산업의 대출 심사에 실제로 필요한 정보를 제안해주세요.
반드시 유효한 JSON 형식으로만 응답하세요.
"""

        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                temperature=0.3,
            )
        )

        result = response.text.strip()

        # JSON 코드 블록 제거
        if result.startswith("```json"):
            result = result[7:]
        elif result.startswith("```"):
            result = result[3:]
        if result.endswith("```"):
            result = result[:-3]
        result = result.strip()

        llm_response = json.loads(result)

        # LLM 응답을 Pydantic 모델로 변환
        suggested_fields = [
            SuggestedField(**field) for field in llm_response.get("suggested_fields", [])
        ]

        insights = [
            IndustryInsight(**insight) for insight in llm_response.get("insights", [])
        ]

        return AdditionalInfoSuggestion(
            document_id=document_id,
            industry=industry,
            ai_reason=llm_response.get("ai_reason", f"{industry}의 경우, 추가 정보 수집이 필요합니다."),
            industry_outlook=llm_response.get("industry_outlook", ""),
            insights=insights,
            suggested_fields=suggested_fields,
        )

    except Exception as e:
        print(f"[LLM] 추가 정보 제안 생성 실패: {str(e)}")
        # 에러 발생 시 기본 필드 반환
        suggested_fields = [
            SuggestedField(
                id="major_clients",
                label="주요 거래처 목록",
                description="상위 5개 거래처와 매출 비중",
                type="textarea",
                required=True,
                placeholder="예: A사 (45%), B사 (30%), ...",
            ),
            SuggestedField(
                id="business_scale",
                label="사업 규모",
                description="연간 매출 및 생산 규모",
                type="textarea",
                required=True,
                placeholder="예: 연매출 50억원, 생산량 10만개",
            ),
        ]

        return AdditionalInfoSuggestion(
            document_id=document_id,
            industry=industry,
            ai_reason=f"{industry}의 경우, 사업 규모, 주요 거래처 등의 정보가 신용 평가에 중요합니다.",
            industry_outlook="",
            insights=[],
            suggested_fields=suggested_fields,
        )


@router.post("/{document_id}", response_model=AdditionalInfoResponse)
def save_additional_info(
    document_id: int,
    data: AdditionalInfoCreate,
    db: Session = Depends(get_db),
):
    """
    추가 정보를 저장합니다.
    """
    # 문서 존재 확인
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="문서를 찾을 수 없습니다.")

    # 이미 저장된 추가 정보가 있는지 확인
    existing = (
        db.query(AdditionalInfo)
        .filter(AdditionalInfo.document_id == document_id)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="이미 추가 정보가 저장되어 있습니다. PUT 요청을 사용하여 수정하세요.",
        )

    # custom_fields를 dict로 변환
    custom_fields_dict = None
    if data.custom_fields:
        custom_fields_dict = data.custom_fields.model_dump(exclude_none=True)

    # collateral_data를 dict로 변환
    collateral_data_dict = None
    if data.collateral_data:
        collateral_data_dict = data.collateral_data.model_dump(exclude_none=True)

    # 추가 정보 생성
    additional_info = AdditionalInfo(
        document_id=document_id,
        field_data=data.field_data,
        custom_fields=custom_fields_dict,
        collateral_data=collateral_data_dict,
    )

    db.add(additional_info)
    db.commit()
    db.refresh(additional_info)

    return additional_info


@router.get("/{document_id}", response_model=AdditionalInfoResponse)
def get_additional_info(document_id: int, db: Session = Depends(get_db)):
    """
    저장된 추가 정보를 조회합니다.
    추가 정보가 없으면 404를 반환합니다 (사용자가 Skip한 경우).
    """
    # 문서 존재 확인
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="문서를 찾을 수 없습니다.")

    # 추가 정보 조회
    additional_info = (
        db.query(AdditionalInfo)
        .filter(AdditionalInfo.document_id == document_id)
        .first()
    )

    if not additional_info:
        raise HTTPException(status_code=404, detail="추가 정보를 찾을 수 없습니다.")

    return additional_info


def get_additional_info_optional(
    document_id: int, db: Session
) -> AdditionalInfo | None:
    """
    추가 정보를 선택적으로 조회합니다 (Analysis/Report 생성 시 사용).
    추가 정보가 없어도 None을 반환하며 에러를 발생시키지 않습니다.

    사용 예시:
    additional_info = get_additional_info_optional(document_id, db)
    if additional_info:
        # 추가 정보를 활용한 분석
        ...
    else:
        # 기본 정보만으로 분석
        ...
    """
    return (
        db.query(AdditionalInfo)
        .filter(AdditionalInfo.document_id == document_id)
        .first()
    )


@router.put("/{document_id}", response_model=AdditionalInfoResponse)
def update_additional_info(
    document_id: int,
    data: AdditionalInfoUpdate,
    db: Session = Depends(get_db),
):
    """
    추가 정보를 수정합니다.
    """
    # 추가 정보 조회
    additional_info = (
        db.query(AdditionalInfo)
        .filter(AdditionalInfo.document_id == document_id)
        .first()
    )

    if not additional_info:
        raise HTTPException(status_code=404, detail="추가 정보를 찾을 수 없습니다.")

    # 업데이트할 필드만 변경
    if data.field_data is not None:
        additional_info.field_data = data.field_data

    if data.custom_fields is not None:
        additional_info.custom_fields = data.custom_fields.model_dump(
            exclude_none=True
        )

    if data.collateral_data is not None:
        additional_info.collateral_data = data.collateral_data.model_dump(
            exclude_none=True
        )

    db.commit()
    db.refresh(additional_info)

    return additional_info
