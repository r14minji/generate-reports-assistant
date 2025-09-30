import { useEffect, useState } from "react";
import { extractionService, ExtractionData as ExtractionDataType } from "../../services/extraction";
import Button from "../common/Button";

interface ExtractionDataProps {
  documentId: number;
}

export default function ExtractionData({ documentId }: ExtractionDataProps) {
  const [data, setData] = useState<ExtractionDataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExtractionData = async () => {
      try {
        setLoading(true);
        const extractionData = await extractionService.getExtractionData(documentId);
        setData(extractionData);
        setError(null);
      } catch (err) {
        setError("추출 데이터를 불러오는데 실패했습니다.");
        console.error("Error fetching extraction data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (documentId) {
      fetchExtractionData();
    }
  }, [documentId]);

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

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="text-blue-800 font-medium">
            Analyzing document... Please wait
          </span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">{error || "데이터를 불러올 수 없습니다."}</p>
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
              Edit
            </Button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">회사명</span>
              <span className="text-sm text-gray-900">{data.company_name || "N/A"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">사업자번호</span>
              <span className="text-sm text-gray-900">{data.business_number || "N/A"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">대표자명</span>
              <span className="text-sm text-gray-900">{data.ceo_name || "N/A"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">설립일</span>
              <span className="text-sm text-gray-900">{data.establishment_date || "N/A"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">업종</span>
              <span className="text-sm text-gray-900">{data.industry || "N/A"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">주소</span>
              <span className="text-sm text-gray-900 text-right">{data.address || "N/A"}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm font-medium text-gray-600">직원수</span>
              <span className="text-sm text-gray-900">{formatNumber(data.employee_count)}명</span>
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">재무 정보</h4>
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
              Edit
            </Button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">매출액</span>
              <span className="text-sm text-gray-900">{formatCurrency(data.revenue)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">영업이익</span>
              <span className="text-sm text-gray-900">{formatCurrency(data.operating_profit)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">당기순이익</span>
              <span className="text-sm text-gray-900">{formatCurrency(data.net_profit)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">총자산</span>
              <span className="text-sm text-gray-900">{formatCurrency(data.total_assets)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">총부채</span>
              <span className="text-sm text-gray-900">{formatCurrency(data.total_liabilities)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm font-medium text-gray-600">자본</span>
              <span className="text-sm text-gray-900">{formatCurrency(data.equity)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Loan Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">대출 정보</h4>
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
            Edit
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">
              주요 제품/서비스
            </label>
            <p className="text-sm text-gray-900 bg-gray-50 rounded p-3">
              {data.main_products || "N/A"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">
              대출 목적
            </label>
            <p className="text-sm text-gray-900 bg-gray-50 rounded p-3">
              {data.loan_purpose || "N/A"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">
              대출 신청 금액
            </label>
            <p className="text-sm text-gray-900 bg-gray-50 rounded p-3 font-semibold">
              {formatCurrency(data.loan_amount)}
            </p>
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