import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/common/Button";
import Layout from "../../components/common/Layout";

interface SuggestedField {
  id: string;
  label: string;
  description: string;
  type: "text" | "number" | "textarea" | "date";
  required: boolean;
  placeholder?: string;
}

interface IndustryInsight {
  title: string;
  content: string;
  type: "positive" | "negative" | "neutral";
}

interface AdditionalInfoData {
  industry: string;
  suggestedFields: SuggestedField[];
  aiReason: string;
  industryOutlook?: string;
  insights?: IndustryInsight[];
}

export default function AdditionalInfo() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const documentId = Number(searchParams.get("documentId")) || 1;

  const [isLoading, setIsLoading] = useState(true);
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfoData | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [customFields, setCustomFields] = useState({
    special_considerations: "",
    management_evaluation: "",
    other_notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // TODO: API 연동 - AI가 산업 분석 후 필요한 추가 정보 제안
    // const data = await additionalInfoService.getSuggestedFields(documentId);

    // 임시 목업 데이터
    setTimeout(() => {
      const mockData: AdditionalInfoData = {
        industry: "자동차 부품 제조업",
        aiReason:
          "자동차 부품 제조업의 경우, 생산 능력, 품질 관리 체계, 주요 거래처와의 계약 조건 등이 신용 평가에 중요한 요소입니다.",
        industryOutlook:
          "글로벌 자동차 산업은 전기차 전환과 자율주행 기술 발전으로 구조적 변화를 겪고 있습니다. 국내 자동차 부품 업계는 2024년 하반기부터 회복세를 보이고 있으며, 특히 전동화 부품 수요가 급증하고 있습니다. 정부의 그린뉴딜 정책과 친환경차 보조금 확대로 관련 부품 제조사들의 수혜가 예상됩니다.",
        insights: [
          {
            title: "전기차 전환 가속화",
            content:
              "2024년 전기차 판매량이 전년 대비 35% 증가하며, 전동화 부품(배터리 팩, 모터, 인버터) 수요가 급증하고 있습니다. 기존 내연기관 부품 업체들의 사업 전환이 필수적입니다.",
            type: "positive",
          },
          {
            title: "공급망 다변화 트렌드",
            content:
              "글로벌 완성차 업체들이 중국 의존도를 낮추기 위해 한국 부품사로 공급망을 다변화하고 있어, 국내 부품사들의 수주 기회가 확대되고 있습니다.",
            type: "positive",
          },
          {
            title: "원자재 가격 변동성",
            content:
              "철강, 알루미늄, 구리 등 주요 원자재 가격이 지정학적 리스크로 인해 불안정한 상황입니다. 원가 관리 능력과 가격 전가력이 수익성에 큰 영향을 미칠 것으로 예상됩니다.",
            type: "negative",
          },
          {
            title: "디지털 전환 필수화",
            content:
              "스마트 팩토리 도입과 AI 기반 품질관리 시스템 구축이 경쟁력 확보의 핵심 요소로 부상하고 있습니다. 디지털 전환 투자가 중장기 경쟁력을 좌우할 전망입니다.",
            type: "neutral",
          },
        ],
        suggestedFields: [
          {
            id: "production_capacity",
            label: "연간 생산 능력",
            description: "생산 규모를 파악하기 위한 정보",
            type: "number",
            required: true,
            placeholder: "예: 100000 (단위: 개)",
          },
          {
            id: "quality_certifications",
            label: "품질 인증 현황",
            description: "ISO, IATF 등 품질 관련 인증서",
            type: "textarea",
            required: true,
            placeholder: "예: ISO 9001:2015, IATF 16949:2016",
          },
          {
            id: "major_clients",
            label: "주요 거래처 목록",
            description: "상위 5개 거래처와 매출 비중",
            type: "textarea",
            required: true,
            placeholder: "예: 현대자동차 (45%), 기아자동차 (30%), ...",
          },
          {
            id: "contract_period",
            label: "주요 거래처 계약 기간",
            description: "장기 공급 계약 여부 및 기간",
            type: "text",
            required: false,
            placeholder: "예: 3년 장기 공급 계약 (2024.01 ~ 2027.01)",
          },
          {
            id: "equipment_investment",
            label: "최근 3년 설비 투자 규모",
            description: "생산 설비 현대화 및 확장 투자",
            type: "number",
            required: false,
            placeholder: "예: 500000000 (단위: 원)",
          },
          {
            id: "rd_investment",
            label: "연구개발 투자 비중",
            description: "매출 대비 R&D 투자 비율",
            type: "number",
            required: false,
            placeholder: "예: 5 (단위: %)",
          },
          {
            id: "inventory_turnover",
            label: "재고 회전율",
            description: "재고 관리 효율성 지표",
            type: "number",
            required: false,
            placeholder: "예: 8.5 (회/년)",
          },
        ],
      };

      setAdditionalInfo(mockData);
      setIsLoading(false);
    }, 1500);
  }, [documentId]);

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
    // 에러 제거
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleCustomFieldChange = (
    fieldName: "special_considerations" | "management_evaluation" | "other_notes",
    value: string
  ) => {
    setCustomFields((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!additionalInfo) return false;

    const newErrors: Record<string, string> = {};

    additionalInfo.suggestedFields.forEach((field) => {
      if (field.required && !formData[field.id]?.trim()) {
        newErrors[field.id] = `${field.label}은(는) 필수 입력 항목입니다.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // TODO: API 연동 - 추가 정보 저장 (AI 제안 필드 + 사용자 커스텀 필드)
      // await additionalInfoService.saveAdditionalInfo(
      //   documentId,
      //   formData,
      //   customFields
      // );

      console.log("Saving additional info:", {
        documentId,
        field_data: formData,
        custom_fields: customFields,
      });

      // Analysis 페이지로 이동 (documentId 전달)
      navigate(`/corporate-loan/analysis?documentId=${documentId}`);
    } catch (error) {
      console.error("Failed to save additional info:", error);
      // TODO: 에러 처리 UI 추가
    }
  };

  const handleBack = () => {
    navigate(`/corporate-loan/extraction?documentId=${documentId}`);
  };

  const handleSkip = () => {
    // 추가 정보 입력을 건너뛰고 다음 단계로
    navigate(`/corporate-loan/analysis?documentId=${documentId}`);
  };

  if (isLoading) {
    return (
      <Layout
        title="Additional Information"
        subtitle="AI-suggested required information"
      >
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-blue-800 font-medium">
              Analyzing industry and suggesting required information...
            </span>
          </div>
        </div>
      </Layout>
    );
  }

  if (!additionalInfo) {
    return (
      <Layout
        title="Additional Information"
        subtitle="AI-suggested required information"
      >
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <span className="text-red-800 font-medium">
            Failed to load additional information suggestions.
          </span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title="Additional Information"
      subtitle="AI-suggested required information"
    >
      {/* 업계 동향 및 전망 */}
      {additionalInfo.industryOutlook && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 mb-6">
          <div className="flex items-start space-x-3 mb-4">
            <svg
              className="w-6 h-6 text-purple-600 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">
                AI 업계 동향 및 전망 분석
              </h3>
              <p className="text-sm text-purple-800 leading-relaxed">
                {additionalInfo.industryOutlook}
              </p>
            </div>
          </div>

          {/* 세부 인사이트 */}
          {additionalInfo.insights && additionalInfo.insights.length > 0 && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {additionalInfo.insights.map((insight, index) => {
                const colors = {
                  positive: {
                    bg: "bg-green-50",
                    border: "border-green-300",
                    text: "text-green-900",
                    badge: "bg-green-100 text-green-800",
                    icon: "text-green-600",
                  },
                  negative: {
                    bg: "bg-red-50",
                    border: "border-red-300",
                    text: "text-red-900",
                    badge: "bg-red-100 text-red-800",
                    icon: "text-red-600",
                  },
                  neutral: {
                    bg: "bg-gray-50",
                    border: "border-gray-300",
                    text: "text-gray-900",
                    badge: "bg-gray-100 text-gray-800",
                    icon: "text-gray-600",
                  },
                };

                const color = colors[insight.type];

                return (
                  <div
                    key={index}
                    className={`${color.bg} border ${color.border} rounded-lg p-4`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className={`text-sm font-semibold ${color.text}`}>
                        {insight.title}
                      </h4>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${color.badge}`}
                      >
                        {insight.type === "positive"
                          ? "기회"
                          : insight.type === "negative"
                          ? "위험"
                          : "참고"}
                      </span>
                    </div>
                    <p className={`text-xs ${color.text} leading-relaxed`}>
                      {insight.content}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* AI 분석 결과 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <div className="flex items-start space-x-3">
          <svg
            className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="text-base font-semibold text-blue-900 mb-2">
              추가 정보 수집 이유: {additionalInfo.industry}
            </h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              {additionalInfo.aiReason}
            </p>
          </div>
        </div>
      </div>

      {/* 추가 정보 입력 폼 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Suggested Information to Collect
          <span className="text-sm font-normal text-gray-500 ml-2">
            (* Required fields)
          </span>
        </h3>

        <div className="space-y-6">
          {additionalInfo.suggestedFields.map((field) => (
            <div key={field.id}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
              <p className="text-xs text-gray-500 mb-2">{field.description}</p>

              {field.type === "textarea" ? (
                <textarea
                  value={formData[field.id] || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors[field.id]
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
              ) : (
                <input
                  type={field.type}
                  value={formData[field.id] || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors[field.id]
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
              )}

              {errors[field.id] && (
                <p className="text-xs text-red-600 mt-1">{errors[field.id]}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 사용자 추가 입력 섹션 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Additional Notes for LLM Analysis
          <span className="text-sm font-normal text-gray-500 ml-2">
            (Optional - Will be used for final report generation)
          </span>
        </h3>

        <div className="space-y-6">
          {/* 특별 고려사항 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              특별 고려사항
            </label>
            <p className="text-xs text-gray-500 mb-2">
              대출 심사 시 특별히 고려해야 할 사항이나 특이사항을 입력하세요
            </p>
            <textarea
              value={customFields.special_considerations}
              onChange={(e) =>
                handleCustomFieldChange("special_considerations", e.target.value)
              }
              placeholder="예: 최근 신규 사업 진출, 대규모 설비 투자 계획, 정부 지원 사업 선정 등"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 경영진 평가 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              경영진 평가
            </label>
            <p className="text-xs text-gray-500 mb-2">
              경영진의 역량, 경력, 비전 등에 대한 평가를 입력하세요
            </p>
            <textarea
              value={customFields.management_evaluation}
              onChange={(e) =>
                handleCustomFieldChange("management_evaluation", e.target.value)
              }
              placeholder="예: CEO는 업계 20년 경력 보유, 전략적 사고 우수, 과거 유사 업종에서 성공 경험 보유"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 기타 참고사항 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              기타 참고사항
            </label>
            <p className="text-xs text-gray-500 mb-2">
              위에 포함되지 않은 기타 참고 정보를 자유롭게 입력하세요
            </p>
            <textarea
              value={customFields.other_notes}
              onChange={(e) =>
                handleCustomFieldChange("other_notes", e.target.value)
              }
              placeholder="예: 업계 동향, 시장 전망, 경쟁사 대비 강점, 잠재적 리스크 등"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={handleBack}>
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </Button>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleSkip}>
            Skip
          </Button>
          <Button onClick={handleSave}>
            Save & Continue
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Button>
        </div>
      </div>
    </Layout>
  );
}