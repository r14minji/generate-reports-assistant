import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/common/Button";
import Layout from "../../components/common/Layout";
import FileAttachment from "../../components/risk-analysis/FileAttachment";
import ReviewOpinion from "../../components/risk-analysis/ReviewOpinion";
import { documentsService } from "../../services/documents";

export default function Analysis() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const documentId = Number(searchParams.get("documentId")) || 1;

  const [isProcessing, setIsProcessing] = useState(true);
  const [reviewOpinion, setReviewOpinion] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsProcessing(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

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
      ) : (
        <div className="space-y-8">
          {/* Industry Classification */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              산업 분류
            </h3>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="text-base font-medium text-gray-900 mb-2">
                A01 - 자동차 부품 제조업
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                <strong>신뢰도:</strong> 95% (매우 높음)
              </p>

              <div className="mt-3">
                <strong className="text-sm font-medium text-gray-700">
                  분류 근거:
                </strong>
                <ul className="mt-2 ml-4 space-y-1">
                  <li className="text-sm text-gray-600">
                    • 주요 제품: 엔진 부품, 전기 부품
                  </li>
                  <li className="text-sm text-gray-600">
                    • 고객사: 현대자동차, 기아자동차
                  </li>
                  <li className="text-sm text-gray-600">
                    • 사업 영역: B2B 부품 공급
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <strong className="text-sm font-medium text-gray-700 mb-3 block">
                대체 분류:
              </strong>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  {
                    code: "A01",
                    name: "자동차 부품 제조",
                    selected: true,
                  },
                  { code: "A02", name: "식품 제조", selected: false },
                  {
                    code: "B01",
                    name: "전자제품 도매",
                    selected: false,
                  },
                  { code: "C01", name: "IT 서비스", selected: false },
                ].map((industry) => (
                  <div
                    key={industry.code}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      industry.selected
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="text-sm font-medium">{industry.name}</div>
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
              {/* High Risk */}
              <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    고위험
                  </span>
                  <h4 className="font-medium text-red-900">
                    고객 집중도 위험
                  </h4>
                </div>
                <div className="text-sm text-red-800">
                  <p>현대그룹 매출 의존도: 87%</p>
                  <p>산업 위험 임계값 80% 초과</p>
                  <p className="mt-2">
                    <strong>권장사항:</strong> 고객 다변화 계획 필요
                  </p>
                </div>
              </div>

              {/* Medium Risk */}
              <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-r-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    중위험
                  </span>
                  <h4 className="font-medium text-yellow-900">
                    원자재 가격 변동성
                  </h4>
                </div>
                <div className="text-sm text-yellow-800">
                  <p>철강 원자재 의존도: 60%</p>
                  <p>
                    <strong>권장사항:</strong> 헤징 전략 검증 필요
                  </p>
                </div>
              </div>

              {/* Low Risk */}
              <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    저위험
                  </span>
                  <h4 className="font-medium text-green-900">
                    기술 및 품질 관리
                  </h4>
                </div>
                <div className="text-sm text-green-800">
                  <p>ISO 9001 인증, 낮은 품질 클레임</p>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Ratios */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              재무 비율 분석
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">
                  부채비율: 145% vs 산업평균 120%
                </span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: "72%" }}
                    ></div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    주의
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">
                  유동비율: 135% vs 산업평균 130%
                </span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: "68%" }}
                    ></div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    양호
                  </span>
                </div>
              </div>

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
                      종합 평가: B등급 (5등급 중 2등급)
                    </p>
                    <p className="text-sm text-blue-800 mt-1">
                      개선 계획: 수익성 개선 방안 검토 필요
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
