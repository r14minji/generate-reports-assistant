import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Layout from "../../components/common/Layout";

export default function Extraction() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsProcessing(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    navigate("/corporate-loan/upload");
  };

  const handleNext = () => {
    navigate("/corporate-loan/analysis");
  };

  return (
    <Layout
      title="Data Extraction"
      subtitle="Review and verify extracted information"
    >
      {isProcessing ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-blue-800 font-medium">
              Analyzing document... Please wait
            </span>
          </div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Source Document */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Source Document
              </h4>
              <div className="bg-white rounded-lg p-4 h-80 overflow-y-auto space-y-4">
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">
                    2. Business Overview
                  </h5>
                  <p className="text-sm text-gray-600">
                    Founded in 2010, our company specializes in automotive parts
                    manufacturing, primarily producing engine components and
                    electrical parts for Hyundai and Kia Motors...
                  </p>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-2">
                    3. Financial Plan
                  </h5>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Total project cost: 5 billion KRW</p>
                    <p>Equity capital: 2 billion KRW</p>
                    <p>Loan amount requested: 3 billion KRW</p>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-2">
                    4. Revenue Projection
                  </h5>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>2024: 4.5 billion KRW</p>
                    <p>2025: 5.2 billion KRW</p>
                    <p>2026: 6.0 billion KRW</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Extracted Data */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                AI Extracted Data
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (Click to edit)
                </span>
              </h4>

              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-900">
                      Company Information
                    </h5>
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
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>• Company: ABC Automotive Parts Co., Ltd.</p>
                    <p>• CEO: Kim Cheol-soo</p>
                    <p>• Established: March 2010</p>
                    <p>• Industry: Automotive Parts Manufacturing</p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-900">
                      Financial Plan
                    </h5>
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
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>• Total project cost: 5 billion KRW</p>
                    <p>• Equity capital: 2 billion KRW</p>
                    <p>• Loan amount requested: 3 billion KRW</p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-900">
                      Revenue Projection
                    </h5>
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
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>• 2024: 4.5 billion KRW</p>
                    <p>• 2025: 5.2 billion KRW</p>
                    <p>• 2026: 6.0 billion KRW</p>
                  </div>
                </div>
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
                Very High
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-600">
                Accuracy:
              </span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: "94%" }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900">94%</span>
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
          Back
        </Button>
        <Button onClick={handleNext}>
          Next Step
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
