import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/common/Button";
import Layout from "../../components/common/Layout";
import FileAttachment from "../../components/risk-analysis/FileAttachment";
import ReviewOpinion from "../../components/risk-analysis/ReviewOpinion";
import { documentsService, RiskAnalysisResponse } from "../../services/documents";

export default function Analysis() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const documentId = Number(searchParams.get("documentId")) || 1;

  const [isProcessing, setIsProcessing] = useState(true);
  const [reviewOpinion, setReviewOpinion] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [analysisData, setAnalysisData] = useState<RiskAnalysisResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsProcessing(true);
      try {
        // 위험 분석 조회
        const riskData = await documentsService.getRiskAnalysis(documentId);
        setAnalysisData(riskData);
      } catch (error: any) {
        console.error("위험분석 조회 실패:", error);
        const errorMessage = error.response?.data?.detail || error.message || "알 수 없는 오류";
        alert(`위험분석 조회에 실패했습니다.\n${errorMessage}`);
      } finally {
        setIsProcessing(false);
      }
    };

    fetchData();
  }, [documentId]);

  const handleBack = () => {
    navigate(`/corporate-loan/additional-info?documentId=${documentId}`);
  };

  const handleNext = async () => {
    try {
      setIsSaving(true);
      // 심사 의견 저장
      await documentsService.updateReviewOpinion(documentId, reviewOpinion);
      navigate(`/corporate-loan/report?documentId=${documentId}`);
    } catch (error) {
      console.error("심사 의견 저장 실패:", error);
      alert("심사 의견 저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout title="위험 분석" subtitle="산업 분류 및 위험 평가">
      {isProcessing ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-blue-800 font-medium">
              산업 분석 진행 중... 잠시만 기다려주세요
            </span>
          </div>
        </div>
      ) : analysisData ? (
        <div className="space-y-8">
          {/* Industry Classification */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              산업 분류
            </h3>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="text-base font-medium text-gray-900 mb-2">
                {analysisData.industry_classification.code} - {analysisData.industry_classification.name}
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                <strong>신뢰도:</strong> {Math.round(analysisData.industry_classification.confidence * 100)}%
                {analysisData.industry_classification.confidence >= 0.8 ? " (매우 높음)" :
                 analysisData.industry_classification.confidence >= 0.6 ? " (높음)" : " (보통)"}
              </p>

              <div className="mt-3">
                <strong className="text-sm font-medium text-gray-700">
                  분류 근거:
                </strong>
                <ul className="mt-2 ml-4 space-y-1">
                  {analysisData.industry_classification.reasons.map((reason, idx) => (
                    <li key={idx} className="text-sm text-gray-600">
                      • {reason}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <strong className="text-sm font-medium text-gray-700 mb-3 block">
                대체 분류:
              </strong>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3 border rounded-lg bg-blue-600 text-white border-blue-600">
                  <div className="text-sm font-medium">
                    {analysisData.industry_classification.name}
                  </div>
                </div>
                {analysisData.industry_classification.alternatives.map((alt) => (
                  <div
                    key={alt.code}
                    className="p-3 border rounded-lg bg-white text-gray-700 border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="text-sm font-medium">{alt.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Risk Factors */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              위험 평가
            </h3>

            <div className="space-y-4">
              {analysisData.risk_factors.map((factor, idx) => {
                const levelConfig = {
                  high: {
                    label: "고위험",
                    borderColor: "border-red-500",
                    bgColor: "bg-red-50",
                    textColor: "text-red-800",
                    badgeBg: "bg-red-100",
                    badgeText: "text-red-800",
                    titleColor: "text-red-900",
                  },
                  medium: {
                    label: "중위험",
                    borderColor: "border-yellow-500",
                    bgColor: "bg-yellow-50",
                    textColor: "text-yellow-800",
                    badgeBg: "bg-yellow-100",
                    badgeText: "text-yellow-800",
                    titleColor: "text-yellow-900",
                  },
                  low: {
                    label: "저위험",
                    borderColor: "border-green-500",
                    bgColor: "bg-green-50",
                    textColor: "text-green-800",
                    badgeBg: "bg-green-100",
                    badgeText: "text-green-800",
                    titleColor: "text-green-900",
                  },
                };

                const config = levelConfig[factor.level];

                return (
                  <div
                    key={idx}
                    className={`border-l-4 ${config.borderColor} ${config.bgColor} p-4 rounded-r-lg`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.badgeBg} ${config.badgeText}`}
                      >
                        {config.label}
                      </span>
                      <h4 className={`font-medium ${config.titleColor}`}>
                        {factor.title}
                      </h4>
                    </div>
                    <div className={`text-sm ${config.textColor}`}>
                      <p>{factor.description}</p>
                      {factor.metrics.map((metric, mIdx) => (
                        <p key={mIdx}>{metric}</p>
                      ))}
                      {factor.recommendation && (
                        <p className="mt-2">
                          <strong>권장사항:</strong> {factor.recommendation}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Financial Ratios */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              재무 비율 분석
            </h3>

            <div className="space-y-4">
              {analysisData.financial_ratios.map((ratio, idx) => {
                const statusConfig = {
                  good: {
                    label: "양호",
                    color: "bg-green-500",
                    badgeBg: "bg-green-100",
                    badgeText: "text-green-800",
                  },
                  warning: {
                    label: "주의",
                    color: "bg-yellow-500",
                    badgeBg: "bg-yellow-100",
                    badgeText: "text-yellow-800",
                  },
                  danger: {
                    label: "위험",
                    color: "bg-red-500",
                    badgeBg: "bg-red-100",
                    badgeText: "text-red-800",
                  },
                };

                const config = statusConfig[ratio.status];

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm font-medium text-gray-900">
                      {ratio.name}: {ratio.value}% vs 산업평균 {ratio.industry_average}%
                    </span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className={`${config.color} h-2 rounded-full`}
                          style={{ width: `${ratio.percentage}%` }}
                        ></div>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.badgeBg} ${config.badgeText}`}
                      >
                        {config.label}
                      </span>
                    </div>
                  </div>
                );
              })}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <svg
                    className="w-5 h-5 text-blue-600 mt-0.5"
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
                    <p className="text-sm font-medium text-blue-900">
                      종합 평가: {analysisData.overall_grade}
                    </p>
                    <p className="text-sm text-blue-800 mt-1">
                      개선 계획: {analysisData.improvement_plan}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Review Opinion */}
          <ReviewOpinion value={reviewOpinion} onChange={setReviewOpinion} />

          {/* File Attachment */}
          <FileAttachment
            files={attachedFiles}
            onFilesChange={setAttachedFiles}
          />
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800">분석 데이터를 불러오지 못했습니다.</p>
        </div>
      )}

      <div className="flex justify-between">
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
          이전
        </Button>
        <Button onClick={handleNext} disabled={isSaving}>
          {isSaving ? "저장 중..." : "리포트 생성"}
          {!isSaving && (
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
          )}
        </Button>
      </div>
    </Layout>
  );
}
