import os
from typing import Dict, Any, Optional
from openai import OpenAI
import json


class StructuredDataService:
    """문서 텍스트에서 구조화된 데이터를 추출하는 서비스"""

    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model = "gpt-4o-mini"

    def extract_document_data(
        self, document_text: str, document_type: str = "기업 대출 신청서"
    ) -> Dict[str, Any]:
        """
        문서 텍스트에서 구조화된 데이터를 추출합니다.

        Args:
            document_text: OCR로 추출된 문서 텍스트
            document_type: 문서 유형

        Returns:
            Dict[str, Any]: 추출된 구조화된 데이터
        """

        prompt = f"""
다음은 {document_type}에서 추출된 텍스트입니다.
이 텍스트에서 아래 정보를 추출하여 JSON 형식으로 반환해주세요.

추출할 정보:
- company_name: 회사명
- business_number: 사업자등록번호
- ceo_name: 대표자명
- establishment_date: 설립일 (YYYY-MM-DD 형식)
- industry: 업종
- address: 주소
- revenue: 매출액 (숫자만, 단위: 원)
- operating_profit: 영업이익 (숫자만, 단위: 원)
- net_profit: 순이익 (숫자만, 단위: 원)
- total_assets: 총자산 (숫자만, 단위: 원)
- total_liabilities: 총부채 (숫자만, 단위: 원)
- equity: 자본금 (숫자만, 단위: 원)
- employee_count: 직원 수 (숫자만)
- main_products: 주요 제품/서비스
- loan_purpose: 대출 목적
- loan_amount: 대출 신청 금액 (숫자만, 단위: 원)

정보가 없는 경우 null을 반환해주세요.
숫자 필드는 쉼표 없이 숫자만 반환해주세요.

문서 텍스트:
{document_text}
"""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "당신은 문서에서 정보를 정확하게 추출하는 AI 어시스턴트입니다. 반드시 JSON 형식으로만 응답하세요.",
                    },
                    {"role": "user", "content": prompt},
                ],
                response_format={"type": "json_object"},
                temperature=0,
            )

            result = response.choices[0].message.content
            structured_data = json.loads(result)

            # 숫자 필드 타입 변환
            numeric_fields = [
                "revenue",
                "operating_profit",
                "net_profit",
                "total_assets",
                "total_liabilities",
                "equity",
                "employee_count",
                "loan_amount",
            ]

            for field in numeric_fields:
                if field in structured_data and structured_data[field] is not None:
                    try:
                        # 문자열인 경우 쉼표 제거 후 숫자 변환
                        if isinstance(structured_data[field], str):
                            structured_data[field] = int(
                                structured_data[field].replace(",", "")
                            )
                    except (ValueError, AttributeError):
                        structured_data[field] = None

            return structured_data

        except Exception as e:
            raise Exception(f"구조화된 데이터 추출 실패: {str(e)}")
