import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { documentsService, ReportData } from "../../services/documents";
import Button from "../common/Button";

export default function GenerateReport() {
  const [searchParams] = useSearchParams();
  const documentId = Number(searchParams.get("documentId")) || 1;
  const [data, setData] = useState<ReportData | null>(null);
  const [editData, setEditData] = useState<ReportData | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [reviewOpinion, setReviewOpinion] = useState<string>("");
  const [editMode, setEditMode] = useState({
    summary: false,
    company: false,
    financial: false,
    risk: false,
    loan: false,
    additional: false,
  });

  const handleEdit = (
    section: "summary" | "company" | "financial" | "risk" | "loan" | "additional"
  ) => {
    setEditMode({ ...editMode, [section]: true });
  };

  const handleCancel = (
    section: "summary" | "company" | "financial" | "risk" | "loan" | "additional"
  ) => {
    setEditData(data);
    setEditMode({ ...editMode, [section]: false });
  };

  const handleSave = async (
    section: "summary" | "company" | "financial" | "risk" | "loan" | "additional"
  ) => {
    if (!editData) return;

    try {
      await documentsService.updateReport(documentId, editData);
      setData(editData);
      setEditMode({ ...editMode, [section]: false });
    } catch (error) {
      console.error("리포트 저장 실패:", error);
      alert("리포트 저장에 실패했습니다.");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportResponse, reviewResponse] = await Promise.all([
          documentsService.getReport(documentId),
          documentsService.getReviewOpinion(documentId),
        ]);

        setData(reportResponse.data);
        setEditData(reportResponse.data);
        setReviewOpinion(reviewResponse.review_opinion || "");
      } catch (error) {
        console.error("데이터 조회 실패:", error);
        // API가 없을 경우 mock 데이터 사용
        const mockData: ReportData = {
          summary:
            "ABC 자동차부품 주식회사는 안정적인 기술력을 보유한 자동차 부품 전문 제조업체입니다. 다만, 높은 고객 집중도가 리스크 관리 측면에서 개선이 필요한 부분입니다. 재무 구조 개선을 통한 신용등급 상향 여지가 있습니다.",
          company: {
            name: "ABC 자동차부품 주식회사",
            industry: "자동차 부품 제조업 (A01)",
            established_year: "2010년 (업력 14년)",
            main_business: "엔진 부품, 전기 부품 제조",
            main_clients: "현대자동차, 기아자동차",
          },
          financial: {
            ratios: {
              debt_ratio: "부채비율: 145% (산업평균 120% 대비 높음)",
              current_ratio: "유동비율: 135% (산업평균 130% 대비 양호)",
              operating_margin: "영업이익률: 8% (산업평균 12% 대비 낮음)",
            },
            revenue: {
              current_year: "2024년 예상: 45억원",
              next_year: "2025년 목표: 52억원 (15.6% 증가)",
              year_after_next: "2026년 목표: 60억원 (15.4% 증가)",
            },
          },
          risk: {
            high: [
              "고객 집중도 위험: 현대그룹 매출 의존도 87%",
              "산업 위험 임계값(80%) 초과, 즉각적인 개선 필요",
            ],
            medium: [
              "원자재 가격 변동성: 철강 원자재 의존도 60%",
              "수익성 개선 필요: 영업이익률이 산업평균 이하",
            ],
            positive: [
              "안정적인 기술력 및 품질관리 시스템",
              "장기 거래관계 유지 (10년 이상)",
            ],
          },
          loan: {
            conditions: {
              approval_limit: "승인 한도: 25억원 (신청금액 30억원의 83%)",
              interest_rate: "금리: 연 4.5% (우대금리 적용)",
              repayment_period: "상환 기간: 5년 (원금균등분할상환)",
              collateral: "담보: 부동산 담보 120% 권장",
            },
            approval_requirements: [
              "고객 다변화 계획 제출",
              "분기별 재무 현황 보고",
              "원자재 헤징 계획 수립",
            ],
          },
        };
        setData(mockData);
        setEditData(mockData);
      }
    };

    if (!isProcessing) {
      fetchData();
    }
  }, [documentId, isProcessing]);

  return (
    <>
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
                <h3 className="text-lg font-semibold text-gray-900">요약</h3>
                {editMode.summary ? (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancel("summary")}
                    >
                      취소
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleSave("summary")}
                    >
                      저장
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit("summary")}
                  >
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
                )}
              </div>
              {editMode.summary ? (
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-600 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  value={editData?.summary || ""}
                  onChange={(e) =>
                    setEditData(
                      editData
                        ? { ...editData, summary: e.target.value }
                        : null
                    )
                  }
                />
              ) : (
                <div className="text-sm text-gray-600 leading-relaxed">
                  {data?.summary}
                </div>
              )}
            </div>

            {/* Company Overview */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  기업 개요
                </h3>
                {editMode.company ? (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancel("company")}
                    >
                      취소
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleSave("company")}
                    >
                      저장
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit("company")}
                  >
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
                )}
              </div>
              {editMode.company ? (
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-gray-500">회사명</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editData?.company.name || ""}
                      onChange={(e) =>
                        setEditData(
                          editData
                            ? {
                                ...editData,
                                company: {
                                  ...editData.company,
                                  name: e.target.value,
                                },
                              }
                            : null
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">산업분류</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editData?.company.industry || ""}
                      onChange={(e) =>
                        setEditData(
                          editData
                            ? {
                                ...editData,
                                company: {
                                  ...editData.company,
                                  industry: e.target.value,
                                },
                              }
                            : null
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">설립연도</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editData?.company.established_year || ""}
                      onChange={(e) =>
                        setEditData(
                          editData
                            ? {
                                ...editData,
                                company: {
                                  ...editData.company,
                                  established_year: e.target.value,
                                },
                              }
                            : null
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">주요 사업</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editData?.company.main_business || ""}
                      onChange={(e) =>
                        setEditData(
                          editData
                            ? {
                                ...editData,
                                company: {
                                  ...editData.company,
                                  main_business: e.target.value,
                                },
                              }
                            : null
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">주요 거래처</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editData?.company.main_clients || ""}
                      onChange={(e) =>
                        setEditData(
                          editData
                            ? {
                                ...editData,
                                company: {
                                  ...editData.company,
                                  main_clients: e.target.value,
                                },
                              }
                            : null
                        )
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-600 leading-relaxed space-y-1">
                  <p>• 회사명: {data?.company.name}</p>
                  <p>• 산업분류: {data?.company.industry}</p>
                  <p>• 설립연도: {data?.company.established_year}</p>
                  <p>• 주요 사업: {data?.company.main_business}</p>
                  <p>• 주요 거래처: {data?.company.main_clients}</p>
                </div>
              )}
            </div>

            {/* Financial Analysis */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  재무 분석
                </h3>
                {editMode.financial ? (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancel("financial")}
                    >
                      취소
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleSave("financial")}
                    >
                      저장
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit("financial")}
                  >
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
                )}
              </div>
              {editMode.financial ? (
                <div className="space-y-4">
                  <div>
                    <p className="font-medium mb-2">재무 비율 분석:</p>
                    <div className="space-y-2">
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={editData?.financial.ratios.debt_ratio || ""}
                        onChange={(e) =>
                          setEditData(
                            editData
                              ? {
                                  ...editData,
                                  financial: {
                                    ...editData.financial,
                                    ratios: {
                                      ...editData.financial.ratios,
                                      debt_ratio: e.target.value,
                                    },
                                  },
                                }
                              : null
                          )
                        }
                      />
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={editData?.financial.ratios.current_ratio || ""}
                        onChange={(e) =>
                          setEditData(
                            editData
                              ? {
                                  ...editData,
                                  financial: {
                                    ...editData.financial,
                                    ratios: {
                                      ...editData.financial.ratios,
                                      current_ratio: e.target.value,
                                    },
                                  },
                                }
                              : null
                          )
                        }
                      />
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={
                          editData?.financial.ratios.operating_margin || ""
                        }
                        onChange={(e) =>
                          setEditData(
                            editData
                              ? {
                                  ...editData,
                                  financial: {
                                    ...editData.financial,
                                    ratios: {
                                      ...editData.financial.ratios,
                                      operating_margin: e.target.value,
                                    },
                                  },
                                }
                              : null
                          )
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium mb-2">매출 현황:</p>
                    <div className="space-y-2">
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={editData?.financial.revenue.current_year || ""}
                        onChange={(e) =>
                          setEditData(
                            editData
                              ? {
                                  ...editData,
                                  financial: {
                                    ...editData.financial,
                                    revenue: {
                                      ...editData.financial.revenue,
                                      current_year: e.target.value,
                                    },
                                  },
                                }
                              : null
                          )
                        }
                      />
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={editData?.financial.revenue.next_year || ""}
                        onChange={(e) =>
                          setEditData(
                            editData
                              ? {
                                  ...editData,
                                  financial: {
                                    ...editData.financial,
                                    revenue: {
                                      ...editData.financial.revenue,
                                      next_year: e.target.value,
                                    },
                                  },
                                }
                              : null
                          )
                        }
                      />
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={
                          editData?.financial.revenue.year_after_next || ""
                        }
                        onChange={(e) =>
                          setEditData(
                            editData
                              ? {
                                  ...editData,
                                  financial: {
                                    ...editData.financial,
                                    revenue: {
                                      ...editData.financial.revenue,
                                      year_after_next: e.target.value,
                                    },
                                  },
                                }
                              : null
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-600 leading-relaxed">
                  <p className="font-medium mb-2">재무 비율 분석:</p>
                  <div className="space-y-1 mb-4">
                    <p>• {data?.financial.ratios.debt_ratio}</p>
                    <p>• {data?.financial.ratios.current_ratio}</p>
                    <p>• {data?.financial.ratios.operating_margin}</p>
                  </div>

                  <p className="font-medium mb-2">매출 현황:</p>
                  <div className="space-y-1">
                    <p>• {data?.financial.revenue.current_year}</p>
                    <p>• {data?.financial.revenue.next_year}</p>
                    <p>• {data?.financial.revenue.year_after_next}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Risk Analysis */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  위험 분석
                </h3>
                {editMode.risk ? (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancel("risk")}
                    >
                      취소
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleSave("risk")}
                    >
                      저장
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit("risk")}
                  >
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
                )}
              </div>
              {editMode.risk ? (
                <div className="space-y-4">
                  <div>
                    <p className="font-medium mb-2 text-red-700">고위험 요소:</p>
                    <textarea
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      value={editData?.risk.high.join("\n") || ""}
                      onChange={(e) =>
                        setEditData(
                          editData
                            ? {
                                ...editData,
                                risk: {
                                  ...editData.risk,
                                  high: e.target.value.split("\n"),
                                },
                              }
                            : null
                        )
                      }
                      placeholder="한 줄에 하나씩 입력하세요"
                    />
                  </div>
                  <div>
                    <p className="font-medium mb-2 text-yellow-700">
                      중위험 요소:
                    </p>
                    <textarea
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      value={editData?.risk.medium.join("\n") || ""}
                      onChange={(e) =>
                        setEditData(
                          editData
                            ? {
                                ...editData,
                                risk: {
                                  ...editData.risk,
                                  medium: e.target.value.split("\n"),
                                },
                              }
                            : null
                        )
                      }
                      placeholder="한 줄에 하나씩 입력하세요"
                    />
                  </div>
                  <div>
                    <p className="font-medium mb-2 text-green-700">긍정 요소:</p>
                    <textarea
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      value={editData?.risk.positive.join("\n") || ""}
                      onChange={(e) =>
                        setEditData(
                          editData
                            ? {
                                ...editData,
                                risk: {
                                  ...editData.risk,
                                  positive: e.target.value.split("\n"),
                                },
                              }
                            : null
                        )
                      }
                      placeholder="한 줄에 하나씩 입력하세요"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-600 leading-relaxed">
                  <p className="font-medium mb-2 text-red-700">고위험 요소:</p>
                  <div className="space-y-1 mb-4">
                    {data?.risk.high.map((item, idx) => (
                      <p key={idx}>• {item}</p>
                    ))}
                  </div>

                  <p className="font-medium mb-2 text-yellow-700">
                    중위험 요소:
                  </p>
                  <div className="space-y-1 mb-4">
                    {data?.risk.medium.map((item, idx) => (
                      <p key={idx}>• {item}</p>
                    ))}
                  </div>

                  <p className="font-medium mb-2 text-green-700">긍정 요소:</p>
                  <div className="space-y-1">
                    {data?.risk.positive.map((item, idx) => (
                      <p key={idx}>• {item}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Loan Conditions */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  대출 조건 권장사항
                </h3>
                {editMode.loan ? (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancel("loan")}
                    >
                      취소
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleSave("loan")}
                    >
                      저장
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit("loan")}
                  >
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
                )}
              </div>
              {editMode.loan ? (
                <div className="space-y-4">
                  <div>
                    <p className="font-medium mb-2">대출 조건:</p>
                    <div className="space-y-2">
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={
                          editData?.loan.conditions.approval_limit || ""
                        }
                        onChange={(e) =>
                          setEditData(
                            editData
                              ? {
                                  ...editData,
                                  loan: {
                                    ...editData.loan,
                                    conditions: {
                                      ...editData.loan.conditions,
                                      approval_limit: e.target.value,
                                    },
                                  },
                                }
                              : null
                          )
                        }
                        placeholder="승인 한도"
                      />
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={editData?.loan.conditions.interest_rate || ""}
                        onChange={(e) =>
                          setEditData(
                            editData
                              ? {
                                  ...editData,
                                  loan: {
                                    ...editData.loan,
                                    conditions: {
                                      ...editData.loan.conditions,
                                      interest_rate: e.target.value,
                                    },
                                  },
                                }
                              : null
                          )
                        }
                        placeholder="금리"
                      />
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={
                          editData?.loan.conditions.repayment_period || ""
                        }
                        onChange={(e) =>
                          setEditData(
                            editData
                              ? {
                                  ...editData,
                                  loan: {
                                    ...editData.loan,
                                    conditions: {
                                      ...editData.loan.conditions,
                                      repayment_period: e.target.value,
                                    },
                                  },
                                }
                              : null
                          )
                        }
                        placeholder="상환 기간"
                      />
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={editData?.loan.conditions.collateral || ""}
                        onChange={(e) =>
                          setEditData(
                            editData
                              ? {
                                  ...editData,
                                  loan: {
                                    ...editData.loan,
                                    conditions: {
                                      ...editData.loan.conditions,
                                      collateral: e.target.value,
                                    },
                                  },
                                }
                              : null
                          )
                        }
                        placeholder="담보"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium mb-2">승인 조건:</p>
                    <textarea
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      value={
                        editData?.loan.approval_requirements.join("\n") || ""
                      }
                      onChange={(e) =>
                        setEditData(
                          editData
                            ? {
                                ...editData,
                                loan: {
                                  ...editData.loan,
                                  approval_requirements:
                                    e.target.value.split("\n"),
                                },
                              }
                            : null
                        )
                      }
                      placeholder="한 줄에 하나씩 입력하세요"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-600 leading-relaxed">
                  <p className="font-medium mb-2">대출 조건:</p>
                  <div className="space-y-1 mb-4">
                    <p>• {data?.loan.conditions.approval_limit}</p>
                    <p>• {data?.loan.conditions.interest_rate}</p>
                    <p>• {data?.loan.conditions.repayment_period}</p>
                    <p>• {data?.loan.conditions.collateral}</p>
                  </div>

                  <p className="font-medium mb-2">승인 조건:</p>
                  <div className="space-y-1">
                    {data?.loan.approval_requirements.map((item, idx) => (
                      <p key={idx}>• {item}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Additional Information - LLM 생성 */}
            {data?.additional_information && (
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900">
                      추가 정보 분석
                    </h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      AI 생성
                    </span>
                  </div>
                  {editMode.additional ? (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancel("additional")}
                      >
                        취소
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleSave("additional")}
                      >
                        저장
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit("additional")}
                    >
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
                  )}
                </div>
                {editMode.additional ? (
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-600 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={8}
                    value={editData?.additional_information || ""}
                    onChange={(e) =>
                      setEditData(
                        editData
                          ? { ...editData, additional_information: e.target.value }
                          : null
                      )
                    }
                  />
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {data?.additional_information}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Review Opinion */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  심사 의견
                </h3>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {reviewOpinion || "심사 의견이 입력되지 않았습니다."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
