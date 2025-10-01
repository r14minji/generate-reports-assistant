import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/common/Button";
import Layout from "../../components/common/Layout";

export default function Report() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const documentId = Number(searchParams.get("documentId")) || 1;

  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    navigate(`/corporate-loan/analysis?documentId=${documentId}`);
  };

  const handleNext = () => {
    navigate(`/corporate-loan/final?documentId=${documentId}`);
  };

  return (
    <Layout title="종합 리포트" subtitle="심사 보고서">
      {isProcessing ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-blue-800 font-medium">
              리포트 생성 중... 잠시만 기다려주세요
            </span>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex flex-wrap gap-2 mb-6">
            <Button size="sm">
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
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              저장
            </Button>
            <Button size="sm">
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
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              공유
            </Button>
            <Button size="sm">
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              PDF 다운로드
            </Button>
            <Button size="sm">
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
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              인쇄
            </Button>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Executive Summary */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  요약
                </h3>
                <Button variant="outline" size="sm">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  편집
                </Button>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                ABC 자동차부품 주식회사는 안정적인 기술력을 보유한 자동차 부품 전문 제조업체입니다.
                다만, 높은 고객 집중도가 리스크 관리 측면에서 개선이 필요한 부분입니다.
                재무 구조 개선을 통한 신용등급 상향 여지가 있습니다.
              </div>
            </div>

            {/* Company Overview */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  기업 개요
                </h3>
                <Button variant="outline" size="sm">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  편집
                </Button>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed space-y-1">
                <p>• 회사명: ABC 자동차부품 주식회사</p>
                <p>• 산업분류: 자동차 부품 제조업 (A01)</p>
                <p>• 설립연도: 2010년 (업력 14년)</p>
                <p>• 주요 사업: 엔진 부품, 전기 부품 제조</p>
                <p>• 주요 거래처: 현대자동차, 기아자동차</p>
              </div>
            </div>

            {/* Financial Analysis */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  재무 분석
                </h3>
                <Button variant="outline" size="sm">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  편집
                </Button>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                <p className="font-medium mb-2">재무 비율 분석:</p>
                <div className="space-y-1 mb-4">
                  <p>• 부채비율: 145% (산업평균 120% 대비 높음)</p>
                  <p>• 유동비율: 135% (산업평균 130% 대비 양호)</p>
                  <p>• 영업이익률: 8% (산업평균 12% 대비 낮음)</p>
                </div>

                <p className="font-medium mb-2">매출 현황:</p>
                <div className="space-y-1">
                  <p>• 2024년 예상: 45억원</p>
                  <p>• 2025년 목표: 52억원 (15.6% 증가)</p>
                  <p>• 2026년 목표: 60억원 (15.4% 증가)</p>
                </div>
              </div>
            </div>

            {/* Risk Analysis */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  위험 분석
                </h3>
                <Button variant="outline" size="sm">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  편집
                </Button>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                <p className="font-medium mb-2 text-red-700">
                  고위험 요소:
                </p>
                <div className="space-y-1 mb-4">
                  <p>• 고객 집중도 위험: 현대그룹 매출 의존도 87%</p>
                  <p>• 산업 위험 임계값(80%) 초과, 즉각적인 개선 필요</p>
                </div>

                <p className="font-medium mb-2 text-yellow-700">
                  중위험 요소:
                </p>
                <div className="space-y-1 mb-4">
                  <p>• 원자재 가격 변동성: 철강 원자재 의존도 60%</p>
                  <p>• 수익성 개선 필요: 영업이익률이 산업평균 이하</p>
                </div>

                <p className="font-medium mb-2 text-green-700">
                  긍정 요소:
                </p>
                <div className="space-y-1">
                  <p>• 안정적인 기술력 및 품질관리 시스템</p>
                  <p>• 장기 거래관계 유지 (10년 이상)</p>
                </div>
              </div>
            </div>

            {/* Loan Conditions */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  대출 조건 권장사항
                </h3>
                <Button variant="outline" size="sm">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  편집
                </Button>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                <p className="font-medium mb-2">대출 조건:</p>
                <div className="space-y-1 mb-4">
                  <p>• 승인 한도: 25억원 (신청금액 30억원의 83%)</p>
                  <p>• 금리: 연 4.5% (우대금리 적용)</p>
                  <p>• 상환 기간: 5년 (원금균등분할상환)</p>
                  <p>• 담보: 부동산 담보 120% 권장</p>
                </div>

                <p className="font-medium mb-2">승인 조건:</p>
                <div className="space-y-1">
                  <p>• 고객 다변화 계획 제출</p>
                  <p>• 분기별 재무 현황 보고</p>
                  <p>• 원자재 헤징 계획 수립</p>
                </div>
              </div>
            </div>

            {/* Review Opinion */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  심사 의견
                </h3>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {/* TODO: 이전 페이지(analysis)에서 작성한 심사 의견을 불러와야 함 */}
                  심사 의견이 입력되지 않았습니다.
                </p>
              </div>
            </div>
          </div>
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
        <Button onClick={handleNext}>
          완료
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
    </Layout>
  );
}
