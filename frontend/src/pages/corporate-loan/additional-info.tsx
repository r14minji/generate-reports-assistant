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

interface AdditionalInfoData {
  industry: string;
  suggestedFields: SuggestedField[];
  aiReason: string;
}

export default function AdditionalInfo() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const documentId = Number(searchParams.get("documentId")) || 1;

  const [isLoading, setIsLoading] = useState(true);
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfoData | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
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

    // TODO: API 연동 - 추가 정보 저장
    // await additionalInfoService.saveAdditionalInfo(documentId, formData);

    console.log("Saving additional info:", { documentId, formData });

    // Analysis 페이지로 이동 (documentId 전달)
    navigate(`/corporate-loan/analysis?documentId=${documentId}`);
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
              AI Analysis: {additionalInfo.industry}
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

      {/* 저장된 정보 미리보기 (입력한 필드가 있을 때만 표시) */}
      {Object.keys(formData).length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-6">
          <h3 className="text-base font-semibold text-gray-900 mb-3">
            Entered Information Preview
          </h3>
          <div className="space-y-2">
            {Object.entries(formData).map(([fieldId, value]) => {
              const field = additionalInfo.suggestedFields.find(
                (f) => f.id === fieldId
              );
              if (!field || !value) return null;
              return (
                <div key={fieldId} className="text-sm">
                  <span className="font-medium text-gray-700">
                    {field.label}:
                  </span>{" "}
                  <span className="text-gray-600">{value}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

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