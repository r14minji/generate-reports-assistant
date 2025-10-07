import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/common/Button";
import Layout from "../../components/common/Layout";
import CollateralInfo from "../../components/risk-analysis/CollateralInfo";
import { additionalInfoService } from "../../services/additional-info";

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

interface CollateralData {
  type: "담보" | "신용" | "기타";
  appraisalValue: string;
  auctionRate: string;
  seniorLien: string;
  coLienShare: string;
  ourAllocation: string;
  recoveryExpected: string;
  recoveryAmount: string;
  lossAmount: string;
  lossOpinion: string;
}

export default function AdditionalInfo() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const documentId = Number(searchParams.get("documentId")) || 1;

  const [isLoading, setIsLoading] = useState(true);
  const [additionalInfo, setAdditionalInfo] =
    useState<AdditionalInfoData | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [customFields, setCustomFields] = useState({
    special_considerations: "",
    management_evaluation: "",
    other_notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false); // 저장된 데이터 존재 여부

  // 담보 정보 state
  const [collateralType, setCollateralType] = useState<
    "담보" | "신용" | "기타"
  >("담보");
  const [collateralData, setCollateralData] = useState<CollateralData>({
    type: "담보",
    appraisalValue: "",
    auctionRate: "",
    seniorLien: "",
    coLienShare: "",
    ourAllocation: "",
    recoveryExpected: "",
    recoveryAmount: "",
    lossAmount: "",
    lossOpinion: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. AI가 산업 분석 후 필요한 추가 정보 제안
        const suggestions =
          await additionalInfoService.getSuggestedFields(documentId);

        setAdditionalInfo({
          industry: suggestions.industry,
          aiReason: suggestions.ai_reason,
          industryOutlook: suggestions.industry_outlook,
          insights: suggestions.insights,
          suggestedFields: suggestions.suggested_fields,
        });

        // 2. 저장된 추가 정보가 있으면 불러오기
        try {
          const savedData =
            await additionalInfoService.getAdditionalInfo(documentId);

          // 저장된 데이터가 있음을 표시
          setHasExistingData(true);

          // 저장된 field_data로 formData 복원
          if (savedData.field_data) {
            setFormData(savedData.field_data);
          }

          // 저장된 custom_fields 복원
          if (savedData.custom_fields) {
            setCustomFields({
              special_considerations:
                savedData.custom_fields.special_considerations || "",
              management_evaluation:
                savedData.custom_fields.management_evaluation || "",
              other_notes: savedData.custom_fields.other_notes || "",
            });
          }

          // 저장된 collateral_data 복원
          if (savedData.collateral_data) {
            setCollateralType(savedData.collateral_data.type);
            setCollateralData({
              type: savedData.collateral_data.type,
              appraisalValue: savedData.collateral_data.appraisal_value || "",
              auctionRate: savedData.collateral_data.auction_rate || "",
              seniorLien: savedData.collateral_data.senior_lien || "",
              coLienShare: savedData.collateral_data.co_lien_share || "",
              ourAllocation: savedData.collateral_data.our_allocation || "",
              recoveryExpected:
                savedData.collateral_data.recovery_expected || "",
              recoveryAmount: savedData.collateral_data.recovery_amount || "",
              lossAmount: savedData.collateral_data.loss_amount || "",
              lossOpinion: savedData.collateral_data.loss_opinion || "",
            });
          }
        } catch (error: any) {
          // 404 에러면 저장된 데이터가 없는 것이므로 무시
          if (error.response?.status !== 404) {
            console.error("Failed to load saved additional info:", error);
          }
          setHasExistingData(false);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load suggestions:", error);
        setIsLoading(false);
      }
    };

    fetchData();
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
    fieldName:
      | "special_considerations"
      | "management_evaluation"
      | "other_notes",
    value: string
  ) => {
    setCustomFields((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleCollateralChange = (
    field: keyof CollateralData,
    value: string
  ) => {
    setCollateralData((prev) => ({
      ...prev,
      [field]: value,
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
      // 담보 정보를 백엔드 형식으로 변환 (camelCase -> snake_case)
      const collateralDataForBackend = {
        type: collateralData.type,
        appraisal_value: collateralData.appraisalValue,
        auction_rate: collateralData.auctionRate,
        senior_lien: collateralData.seniorLien,
        co_lien_share: collateralData.coLienShare,
        our_allocation: collateralData.ourAllocation,
        recovery_expected: collateralData.recoveryExpected,
        recovery_amount: collateralData.recoveryAmount,
        loss_amount: collateralData.lossAmount,
        loss_opinion: collateralData.lossOpinion,
      };

      // API 연동 - 저장된 데이터가 있으면 PUT, 없으면 POST
      if (hasExistingData) {
        await additionalInfoService.updateAdditionalInfo(
          documentId,
          formData,
          customFields,
          collateralDataForBackend
        );
        console.log("Additional info updated successfully");
      } else {
        await additionalInfoService.saveAdditionalInfo(
          documentId,
          formData,
          customFields,
          collateralDataForBackend
        );
        console.log("Additional info saved successfully");
      }

      // Analysis 페이지로 이동 (documentId 전달)
      navigate(`/corporate-loan/analysis?documentId=${documentId}`);
    } catch (error: any) {
      console.error("Failed to save additional info:", error);
      const errorMessage =
        error.response?.data?.detail || error.message || "알 수 없는 오류";
      alert(`추가 정보 저장에 실패했습니다.\n${errorMessage}`);
    }
  };

  const handleBack = () => {
    navigate(`/corporate-loan/extraction?documentId=${documentId}`);
  };

  const handleSkip = () => {
    // 경고 모달 표시
    setShowSkipModal(true);
  };

  const handleConfirmSkip = () => {
    // 추가 정보 없이 다음 단계로 이동
    setShowSkipModal(false);
    navigate(`/corporate-loan/analysis?documentId=${documentId}`);
  };

  const handleCancelSkip = () => {
    // 모달 닫기
    setShowSkipModal(false);
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
                {field.required && <span className="text-red-500 ml-1">*</span>}
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

      {/* 담보 정보 입력 섹션 */}
      <div className="mt-6">
        <CollateralInfo
          collateralType={collateralType}
          collateralData={collateralData}
          onTypeChange={setCollateralType}
          onDataChange={handleCollateralChange}
        />
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
                handleCustomFieldChange(
                  "special_considerations",
                  e.target.value
                )
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

      {/* Skip 경고 모달 */}
      {showSkipModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg
                    className="w-10 h-10 text-yellow-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    추가 정보 없이 진행하시겠습니까?
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    추가 정보를 입력하지 않으면 AI 분석의 정확도가 떨어질 수
                    있습니다. 업계 동향, 경영진 평가, 특별 고려사항 등의 정보는
                    리스크 분석과 최종 리포트 작성에 중요한 참고 자료로
                    활용됩니다.
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-yellow-800">
                      <strong>권장사항:</strong> 가능한 한 추가 정보를 입력하여
                      더 정확한 분석 결과를 받으시기 바랍니다.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={handleCancelSkip}>
                  취소
                </Button>
                <Button onClick={handleConfirmSkip}>그래도 건너뛰기</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
