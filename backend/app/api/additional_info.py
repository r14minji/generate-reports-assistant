from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

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
    실제로는 추출된 산업 정보를 기반으로 LLM이 필요한 필드를 제안해야 합니다.
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

    # TODO: LLM을 사용하여 산업별 맞춤 필드 제안
    # 현재는 목업 데이터 반환
    suggested_fields = [
        SuggestedField(
            id="production_capacity",
            label="연간 생산 능력",
            description="생산 규모를 파악하기 위한 정보",
            type="number",
            required=True,
            placeholder="예: 100000 (단위: 개)",
        ),
        SuggestedField(
            id="quality_certifications",
            label="품질 인증 현황",
            description="ISO, IATF 등 품질 관련 인증서",
            type="textarea",
            required=True,
            placeholder="예: ISO 9001:2015, IATF 16949:2016",
        ),
        SuggestedField(
            id="major_clients",
            label="주요 거래처 목록",
            description="상위 5개 거래처와 매출 비중",
            type="textarea",
            required=True,
            placeholder="예: 현대자동차 (45%), 기아자동차 (30%), ...",
        ),
        SuggestedField(
            id="contract_period",
            label="주요 거래처 계약 기간",
            description="장기 공급 계약 여부 및 기간",
            type="text",
            required=False,
            placeholder="예: 3년 장기 공급 계약 (2024.01 ~ 2027.01)",
        ),
        SuggestedField(
            id="equipment_investment",
            label="최근 3년 설비 투자 규모",
            description="생산 설비 현대화 및 확장 투자",
            type="number",
            required=False,
            placeholder="예: 500000000 (단위: 원)",
        ),
        SuggestedField(
            id="rd_investment",
            label="연구개발 투자 비중",
            description="매출 대비 R&D 투자 비율",
            type="number",
            required=False,
            placeholder="예: 5 (단위: %)",
        ),
        SuggestedField(
            id="inventory_turnover",
            label="재고 회전율",
            description="재고 관리 효율성 지표",
            type="number",
            required=False,
            placeholder="예: 8.5 (회/년)",
        ),
    ]

    # TODO: LLM을 사용하여 실시간 업계 동향 및 전망 분석
    # 현재는 목업 데이터 반환
    industry_outlook = "글로벌 자동차 산업은 전기차 전환과 자율주행 기술 발전으로 구조적 변화를 겪고 있습니다. 국내 자동차 부품 업계는 2024년 하반기부터 회복세를 보이고 있으며, 특히 전동화 부품 수요가 급증하고 있습니다. 정부의 그린뉴딜 정책과 친환경차 보조금 확대로 관련 부품 제조사들의 수혜가 예상됩니다."

    insights = [
        IndustryInsight(
            title="전기차 전환 가속화",
            content="2024년 전기차 판매량이 전년 대비 35% 증가하며, 전동화 부품(배터리 팩, 모터, 인버터) 수요가 급증하고 있습니다. 기존 내연기관 부품 업체들의 사업 전환이 필수적입니다.",
            type="positive",
        ),
        IndustryInsight(
            title="공급망 다변화 트렌드",
            content="글로벌 완성차 업체들이 중국 의존도를 낮추기 위해 한국 부품사로 공급망을 다변화하고 있어, 국내 부품사들의 수주 기회가 확대되고 있습니다.",
            type="positive",
        ),
        IndustryInsight(
            title="원자재 가격 변동성",
            content="철강, 알루미늄, 구리 등 주요 원자재 가격이 지정학적 리스크로 인해 불안정한 상황입니다. 원가 관리 능력과 가격 전가력이 수익성에 큰 영향을 미칠 것으로 예상됩니다.",
            type="negative",
        ),
        IndustryInsight(
            title="디지털 전환 필수화",
            content="스마트 팩토리 도입과 AI 기반 품질관리 시스템 구축이 경쟁력 확보의 핵심 요소로 부상하고 있습니다. 디지털 전환 투자가 중장기 경쟁력을 좌우할 전망입니다.",
            type="neutral",
        ),
    ]

    return AdditionalInfoSuggestion(
        document_id=document_id,
        industry=industry,
        ai_reason=f"{industry}의 경우, 생산 능력, 품질 관리 체계, 주요 거래처와의 계약 조건 등이 신용 평가에 중요한 요소입니다.",
        industry_outlook=industry_outlook,
        insights=insights,
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

    # 추가 정보 생성
    additional_info = AdditionalInfo(
        document_id=document_id,
        field_data=data.field_data,
        custom_fields=custom_fields_dict,
    )

    db.add(additional_info)
    db.commit()
    db.refresh(additional_info)

    return additional_info


@router.get("/{document_id}", response_model=AdditionalInfoResponse)
def get_additional_info(document_id: int, db: Session = Depends(get_db)):
    """
    저장된 추가 정보를 조회합니다.
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

    db.commit()
    db.refresh(additional_info)

    return additional_info
