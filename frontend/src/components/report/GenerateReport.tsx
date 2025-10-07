import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { documentsService, ReportData } from "../../services/documents";
import Button from "../common/Button";

export default function GenerateReport() {
  const [searchParams] = useSearchParams();
  const documentId = Number(searchParams.get("documentId")) || 1;
  const [data, setData] = useState<ReportData | null>(null);
  const [editData, setEditData] = useState<ReportData | null>(null);
  const [reviewOpinion, setReviewOpinion] = useState<string>("");
  const [editReviewOpinion, setEditReviewOpinion] = useState<string>("");
  const [editMode, setEditMode] = useState({
    summary: false,
    company: false,
    financial: false,
    risk: false,
    loan: false,
    additional: false,
    review: false,
  });

  const handleEdit = (
    section:
      | "summary"
      | "company"
      | "financial"
      | "risk"
      | "loan"
      | "additional"
      | "review"
  ) => {
    if (section === "review") {
      setEditReviewOpinion(reviewOpinion);
    }
    setEditMode({ ...editMode, [section]: true });
  };

  const handleCancel = (
    section:
      | "summary"
      | "company"
      | "financial"
      | "risk"
      | "loan"
      | "additional"
      | "review"
  ) => {
    setEditData(data);
    setEditReviewOpinion(reviewOpinion);
    setEditMode({ ...editMode, [section]: false });
  };

  const handleSave = async (
    section:
      | "summary"
      | "company"
      | "financial"
      | "risk"
      | "loan"
      | "additional"
      | "review"
  ) => {
    if (!editData && section !== "review") return;

    try {
      if (section === "review") {
        // 심사 의견 저장
        await documentsService.updateReviewOpinion(
          documentId,
          editReviewOpinion
        );
        setReviewOpinion(editReviewOpinion);
      } else {
        // 리포트 데이터 저장
        await documentsService.updateReport(documentId, editData!);
        setData(editData);
      }
      setEditMode({ ...editMode, [section]: false });
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장에 실패했습니다.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reportResponse = await documentsService.getReport(documentId);

        setData(reportResponse.data);
        setEditData(reportResponse.data);
        setReviewOpinion(reportResponse.review_opinion || "");
      } catch (error) {
        console.error("데이터 조회 실패:", error);
        alert("리포트 데이터를 불러올 수 없습니다.");
      }
    };

    fetchData();
  }, [documentId]);

  return (
    <>
      {!data ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
            <span className="text-gray-700 font-medium">
              리포트 불러오는 중...
            </span>
          </div>
        </div>
      ) : (
        <div>
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
                      editData ? { ...editData, summary: e.target.value } : null
                    )
                  }
                />
              ) : (
                <div className="text-sm text-gray-600 leading-relaxed">
                  {data?.summary || "N/A"}
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
                  <p>• 회사명: {data?.company.name || "N/A"}</p>
                  <p>• 산업분류: {data?.company.industry || "N/A"}</p>
                  <p>• 설립연도: {data?.company.established_year || "N/A"}</p>
                  <p>• 주요 사업: {data?.company.main_business || "N/A"}</p>
                  <p>• 주요 거래처: {data?.company.main_clients || "N/A"}</p>
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
                    <p>• {data?.financial.ratios.debt_ratio || "N/A"}</p>
                    <p>• {data?.financial.ratios.current_ratio || "N/A"}</p>
                    <p>• {data?.financial.ratios.operating_margin || "N/A"}</p>
                  </div>

                  <p className="font-medium mb-2">매출 현황:</p>
                  <div className="space-y-1">
                    <p>• {data?.financial.revenue.current_year || "N/A"}</p>
                    <p>• {data?.financial.revenue.next_year || "N/A"}</p>
                    <p>• {data?.financial.revenue.year_after_next || "N/A"}</p>
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
                    <p className="font-medium mb-2 text-red-700">
                      고위험 요소:
                    </p>
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
                    <p className="font-medium mb-2 text-green-700">
                      긍정 요소:
                    </p>
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
                    {data?.risk.high && data.risk.high.length > 0 ? (
                      data.risk.high.map((item, idx) => <p key={idx}>• {item}</p>)
                    ) : (
                      <p>• N/A</p>
                    )}
                  </div>

                  <p className="font-medium mb-2 text-yellow-700">
                    중위험 요소:
                  </p>
                  <div className="space-y-1 mb-4">
                    {data?.risk.medium && data.risk.medium.length > 0 ? (
                      data.risk.medium.map((item, idx) => <p key={idx}>• {item}</p>)
                    ) : (
                      <p>• N/A</p>
                    )}
                  </div>

                  <p className="font-medium mb-2 text-green-700">긍정 요소:</p>
                  <div className="space-y-1">
                    {data?.risk.positive && data.risk.positive.length > 0 ? (
                      data.risk.positive.map((item, idx) => <p key={idx}>• {item}</p>)
                    ) : (
                      <p>• N/A</p>
                    )}
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
                        value={editData?.loan.conditions.approval_limit || ""}
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
                        value={editData?.loan.conditions.repayment_period || ""}
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
                    <p>• {data?.loan.conditions.approval_limit || "N/A"}</p>
                    <p>• {data?.loan.conditions.interest_rate || "N/A"}</p>
                    <p>• {data?.loan.conditions.repayment_period || "N/A"}</p>
                    <p>• {data?.loan.conditions.collateral || "N/A"}</p>
                  </div>

                  <p className="font-medium mb-2">승인 조건:</p>
                  <div className="space-y-1">
                    {data?.loan.approval_requirements && data.loan.approval_requirements.length > 0 ? (
                      data.loan.approval_requirements.map((item, idx) => (
                        <p key={idx}>• {item}</p>
                      ))
                    ) : (
                      <p>• N/A</p>
                    )}
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
                          ? {
                              ...editData,
                              additional_information: e.target.value,
                            }
                          : null
                      )
                    }
                  />
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {data?.additional_information || "N/A"}
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
                {editMode.review ? (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancel("review")}
                    >
                      취소
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleSave("review")}
                    >
                      저장
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit("review")}
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
              {editMode.review ? (
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-4 text-sm text-gray-600 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={8}
                  value={editReviewOpinion}
                  onChange={(e) => setEditReviewOpinion(e.target.value)}
                  placeholder="심사 의견을 입력하세요"
                />
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {reviewOpinion || "심사 의견이 입력되지 않았습니다."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
