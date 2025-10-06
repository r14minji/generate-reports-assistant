import { useEffect, useState, useRef, useCallback } from "react";
import { extractionService, ExtractionData as ExtractionDataType, ExtractionDataUpdate } from "../../services/extraction";
import Button from "../common/Button";

interface ExtractionDataProps {
  documentId: number;
}

export default function ExtractionData({ documentId }: ExtractionDataProps) {
  const [data, setData] = useState<ExtractionDataType | null>(null);
  const [editData, setEditData] = useState<ExtractionDataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState({
    company: false,
    financial: false,
    loan: false,
  });

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const [retryCount, setRetryCount] = useState(0); // UI 업데이트를 위한 상태
  const maxRetries = 60; // 최대 120초 (2초 * 60회)

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    retryCountRef.current = 0;
    setRetryCount(0);
  }, []);

  const fetchExtractionData = useCallback(async () => {
    try {
      console.log(`[Fetch] Attempting to fetch extraction data for document ${documentId}`);
      const extractionData = await extractionService.getExtractionData(documentId);

      // 데이터 로드 성공
      console.log('[Fetch] ✅ SUCCESS! Data received:', {
        id: extractionData.id,
        company: extractionData.company_name,
        status: 'loaded'
      });

      // 상태 업데이트를 배치로 처리
      setLoading(false);
      setError(null);
      setData(extractionData);
      setEditData(extractionData);

      console.log('[Fetch] State updated - loading: false, data set');
      console.log('[Fetch] Current data:', extractionData);

      // 성공하면 폴링 중지
      stopPolling();
    } catch (err: any) {
      console.error('[Fetch] ❌ Error:', {
        status: err.response?.status,
        detail: err.response?.data?.detail
      });

      // HTTP 상태 코드에 따라 다른 처리
      if (err.response?.status === 422) {
        // 추출 실패
        setError("데이터 추출에 실패했습니다. 문서를 다시 업로드하거나 재처리를 시도해주세요.");
        setLoading(false);
        stopPolling();
      } else if (err.response?.status === 202) {
        // 처리 중 - 로딩 상태 유지하고 자동으로 재시도
        setLoading(true);
        setError(null);

        // 폴링이 아직 시작되지 않았으면 시작
        if (!pollIntervalRef.current) {
          console.log('[Polling] Starting polling...');
          pollIntervalRef.current = setInterval(() => {
            retryCountRef.current++;
            setRetryCount(retryCountRef.current); // UI 업데이트
            console.log(`[Polling] Retry ${retryCountRef.current}/${maxRetries}`);

            if (retryCountRef.current >= maxRetries) {
              setError("문서 처리 시간이 초과되었습니다. 페이지를 새로고침해주세요.");
              setLoading(false);
              stopPolling();
            } else {
              fetchExtractionData();
            }
          }, 2000); // 2초마다 재시도
        }
      } else if (err.response?.status === 404) {
        // 데이터 없음
        setError("추출된 데이터가 없습니다. 문서 처리를 시작해주세요.");
        setLoading(false);
        stopPolling();
      } else {
        // 기타 오류
        setError(err.response?.data?.detail || "추출 데이터를 불러오는데 실패했습니다.");
        setLoading(false);
        stopPolling();
      }
    }
  }, [documentId, stopPolling]);

  useEffect(() => {
    console.log('[Effect] Component mounted or documentId changed:', documentId);

    // 이전 폴링 정리
    stopPolling();

    setLoading(true);
    setError(null);
    setData(null);
    setEditData(null);
    retryCountRef.current = 0;
    setRetryCount(0);

    // 약간의 딜레이 후 fetch (React Strict Mode 대응)
    const timer = setTimeout(() => {
      fetchExtractionData(); // eslint-disable-line react-hooks/exhaustive-deps
    }, 100);

    // 컴포넌트 언마운트 시 폴링 중지
    return () => {
      console.log('[Effect] Cleanup');
      clearTimeout(timer);
      stopPolling();
    };
  }, [documentId]);

  const handleEdit = (section: "company" | "financial" | "loan") => {
    setEditMode({ ...editMode, [section]: true });
  };

  const handleCancel = (section: "company" | "financial" | "loan") => {
    setEditData(data);
    setEditMode({ ...editMode, [section]: false });
  };

  const handleSave = async (section: "company" | "financial" | "loan") => {
    if (!editData) return;

    try {
      setSaving(true);
      const updateData: ExtractionDataUpdate = {
        company_name: editData.company_name,
        business_number: editData.business_number,
        ceo_name: editData.ceo_name,
        establishment_date: editData.establishment_date,
        industry: editData.industry,
        address: editData.address,
        revenue: editData.revenue,
        operating_profit: editData.operating_profit,
        net_profit: editData.net_profit,
        total_assets: editData.total_assets,
        total_liabilities: editData.total_liabilities,
        equity: editData.equity,
        employee_count: editData.employee_count,
        main_products: editData.main_products,
        loan_purpose: editData.loan_purpose,
        loan_amount: editData.loan_amount,
      };

      const updatedData = await extractionService.updateExtractionData(documentId, updateData);
      setData(updatedData);
      setEditData(updatedData);
      setEditMode({ ...editMode, [section]: false });
      setError(null);
    } catch (err) {
      setError("데이터 저장에 실패했습니다.");
      console.error("Error saving data:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof ExtractionDataType, value: string | number) => {
    if (!editData) return;
    setEditData({ ...editData, [field]: value });
  };

  const handleRetryExtraction = async () => {
    try {
      setProcessing(true);
      setError(null);
      await extractionService.triggerExtraction(documentId);

      // 처리 완료 후 데이터 다시 불러오기
      setTimeout(async () => {
        try {
          const extractionData = await extractionService.getExtractionData(documentId);
          setData(extractionData);
          setEditData(extractionData);
        } catch (err) {
          setError("추출된 데이터를 불러오는데 실패했습니다.");
        } finally {
          setProcessing(false);
        }
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || "재처리에 실패했습니다.");
      setProcessing(false);
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "N/A";
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount);
  };

  const formatNumber = (num: number | null) => {
    if (num === null) return "N/A";
    return new Intl.NumberFormat("ko-KR").format(num);
  };

  // 로딩 중일 때는 항상 로딩 UI 표시 (data 유무와 관계없이)
  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              문서 분석 중...
            </h3>
            <p className="text-blue-700 text-sm">
              OCR 처리 및 데이터 추출을 진행하고 있습니다. 잠시만 기다려주세요.
            </p>
            <p className="text-blue-600 text-xs mt-2">
              {retryCount > 0 && `재시도 중... (${retryCount}/${maxRetries})`}
            </p>
          </div>
          <div className="w-full max-w-md bg-blue-100 rounded-full h-2 overflow-hidden">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
          </div>
          <Button variant="outline" onClick={() => {
            console.log('[DEBUG] Manual refresh triggered');
            fetchExtractionData();
          }}>
            수동 새로고침 (디버그)
          </Button>
        </div>
      </div>
    );
  }

  // 에러가 있거나 데이터가 없을 때만 에러 UI 표시
  if (error && !data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <p className="text-red-800">{error}</p>
          <Button
            variant="outline"
            onClick={handleRetryExtraction}
            disabled={processing}
          >
            {processing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                처리 중...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                재처리
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // 데이터가 없으면 에러 UI
  if (!data || !editData) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <p className="text-yellow-800">데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Company Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">회사 정보</h4>
            {!editMode.company ? (
              <Button variant="outline" size="sm" onClick={() => handleEdit("company")}>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleSave("company")} disabled={saving}>
                  {saving ? "저장 중..." : "저장"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleCancel("company")} disabled={saving}>
                  취소
                </Button>
              </div>
            )}
          </div>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">회사명</span>
              {editMode.company ? (
                <input
                  type="text"
                  value={editData.company_name || ""}
                  onChange={(e) => handleInputChange("company_name", e.target.value)}
                  className="text-sm text-gray-900 border rounded px-2 py-1"
                />
              ) : (
                <span className="text-sm text-gray-900">{data.company_name || "N/A"}</span>
              )}
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">사업자번호</span>
              {editMode.company ? (
                <input
                  type="text"
                  value={editData.business_number || ""}
                  onChange={(e) => handleInputChange("business_number", e.target.value)}
                  className="text-sm text-gray-900 border rounded px-2 py-1"
                />
              ) : (
                <span className="text-sm text-gray-900">{data.business_number || "N/A"}</span>
              )}
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">대표자명</span>
              {editMode.company ? (
                <input
                  type="text"
                  value={editData.ceo_name || ""}
                  onChange={(e) => handleInputChange("ceo_name", e.target.value)}
                  className="text-sm text-gray-900 border rounded px-2 py-1"
                />
              ) : (
                <span className="text-sm text-gray-900">{data.ceo_name || "N/A"}</span>
              )}
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">설립일</span>
              {editMode.company ? (
                <input
                  type="date"
                  value={editData.establishment_date || ""}
                  onChange={(e) => handleInputChange("establishment_date", e.target.value)}
                  className="text-sm text-gray-900 border rounded px-2 py-1"
                />
              ) : (
                <span className="text-sm text-gray-900">{data.establishment_date || "N/A"}</span>
              )}
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">업종</span>
              {editMode.company ? (
                <input
                  type="text"
                  value={editData.industry || ""}
                  onChange={(e) => handleInputChange("industry", e.target.value)}
                  className="text-sm text-gray-900 border rounded px-2 py-1"
                />
              ) : (
                <span className="text-sm text-gray-900">{data.industry || "N/A"}</span>
              )}
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">주소</span>
              {editMode.company ? (
                <input
                  type="text"
                  value={editData.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="text-sm text-gray-900 border rounded px-2 py-1 w-64"
                />
              ) : (
                <span className="text-sm text-gray-900 text-right">{data.address || "N/A"}</span>
              )}
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm font-medium text-gray-600">직원수</span>
              {editMode.company ? (
                <input
                  type="number"
                  value={editData.employee_count || ""}
                  onChange={(e) => handleInputChange("employee_count", Number(e.target.value))}
                  className="text-sm text-gray-900 border rounded px-2 py-1 w-24"
                />
              ) : (
                <span className="text-sm text-gray-900">{formatNumber(data.employee_count)}명</span>
              )}
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">재무 정보</h4>
            {!editMode.financial ? (
              <Button variant="outline" size="sm" onClick={() => handleEdit("financial")}>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleSave("financial")} disabled={saving}>
                  {saving ? "저장 중..." : "저장"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleCancel("financial")} disabled={saving}>
                  취소
                </Button>
              </div>
            )}
          </div>
          <div className="space-y-3">
            {[
              { label: "매출액", field: "revenue" as const },
              { label: "영업이익", field: "operating_profit" as const },
              { label: "당기순이익", field: "net_profit" as const },
              { label: "총자산", field: "total_assets" as const },
              { label: "총부채", field: "total_liabilities" as const },
              { label: "자본", field: "equity" as const },
            ].map(({ label, field }, index, array) => (
              <div key={field} className={`flex justify-between py-2 ${index < array.length - 1 ? "border-b border-gray-100" : ""}`}>
                <span className="text-sm font-medium text-gray-600">{label}</span>
                {editMode.financial ? (
                  <input
                    type="number"
                    value={editData[field] || ""}
                    onChange={(e) => handleInputChange(field, Number(e.target.value))}
                    className="text-sm text-gray-900 border rounded px-2 py-1 w-40"
                  />
                ) : (
                  <span className="text-sm text-gray-900">{formatCurrency(data[field])}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Loan Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">대출 정보</h4>
          {!editMode.loan ? (
            <Button variant="outline" size="sm" onClick={() => handleEdit("loan")}>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleSave("loan")} disabled={saving}>
                {saving ? "저장 중..." : "저장"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleCancel("loan")} disabled={saving}>
                취소
              </Button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">
              주요 제품/서비스
            </label>
            {editMode.loan ? (
              <textarea
                value={editData.main_products || ""}
                onChange={(e) => handleInputChange("main_products", e.target.value)}
                className="text-sm text-gray-900 bg-gray-50 rounded p-3 w-full border"
                rows={3}
              />
            ) : (
              <p className="text-sm text-gray-900 bg-gray-50 rounded p-3">
                {data.main_products || "N/A"}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">
              대출 목적
            </label>
            {editMode.loan ? (
              <textarea
                value={editData.loan_purpose || ""}
                onChange={(e) => handleInputChange("loan_purpose", e.target.value)}
                className="text-sm text-gray-900 bg-gray-50 rounded p-3 w-full border"
                rows={3}
              />
            ) : (
              <p className="text-sm text-gray-900 bg-gray-50 rounded p-3">
                {data.loan_purpose || "N/A"}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">
              대출 신청 금액
            </label>
            {editMode.loan ? (
              <input
                type="number"
                value={editData.loan_amount || ""}
                onChange={(e) => handleInputChange("loan_amount", Number(e.target.value))}
                className="text-sm text-gray-900 bg-gray-50 rounded p-3 w-full border font-semibold"
              />
            ) : (
              <p className="text-sm text-gray-900 bg-gray-50 rounded p-3 font-semibold">
                {formatCurrency(data.loan_amount)}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">
              추출 방식
            </label>
            <p className="text-sm text-gray-900 bg-gray-50 rounded p-3">
              {data.extraction_method === "mock" ? "Mock Data" : data.extraction_method}
            </p>
          </div>
        </div>
      </div>

      {/* Confidence Score */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">
            Extraction Confidence
          </h4>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            {data.extraction_method === "mock" ? "Mock Data" : "Very High"}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-600">
            Accuracy:
          </span>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{ width: data.extraction_method === "mock" ? "100%" : "94%" }}
            ></div>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {data.extraction_method === "mock" ? "100%" : "94%"}
          </span>
        </div>
      </div>
    </div>
  );
}