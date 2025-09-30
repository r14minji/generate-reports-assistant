import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Layout from "../../components/common/Layout";

export default function Report() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    navigate("/corporate-loan/analysis");
  };

  const handleNext = () => {
    navigate("/corporate-loan/final");
  };

  return (
    <Layout title="Comprehensive Report" subtitle="Generated assessment report">
      {isProcessing ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-blue-800 font-medium">
              Generating report... Please wait
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
              Save
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
              Share
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
              Download PDF
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
              Print
            </Button>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Executive Summary */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Executive Summary
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
                  Edit
                </Button>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                ABC Automotive Parts Co., Ltd. is a specialized automotive parts
                manufacturer with stable technological capabilities. However,
                high customer concentration presents risk management challenges.
                There is potential for credit rating improvement through
                financial structure enhancement.
              </div>
            </div>

            {/* Company Overview */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Company Overview
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
                  Edit
                </Button>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed space-y-1">
                <p>• Company: ABC Automotive Parts Co., Ltd.</p>
                <p>• Industry: Automotive Parts Manufacturing (A01)</p>
                <p>• Established: 2010 (14 years in business)</p>
                <p>
                  • Main Business: Engine parts, electrical components
                  manufacturing
                </p>
                <p>• Key Clients: Hyundai Motors, Kia Motors</p>
              </div>
            </div>

            {/* Financial Analysis */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Financial Analysis
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
                  Edit
                </Button>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                <p className="font-medium mb-2">Financial Ratio Analysis:</p>
                <div className="space-y-1 mb-4">
                  <p>
                    • Debt Ratio: 145% (Higher than industry average of 120%)
                  </p>
                  <p>
                    • Current Ratio: 135% (Good, compared to industry average of
                    130%)
                  </p>
                  <p>• Operating Margin: 8% (Below industry average of 12%)</p>
                </div>

                <p className="font-medium mb-2">Revenue Status:</p>
                <div className="space-y-1">
                  <p>• 2024 Projected: 4.5 billion KRW</p>
                  <p>• 2025 Target: 5.2 billion KRW (15.6% increase)</p>
                  <p>• 2026 Target: 6.0 billion KRW (15.4% increase)</p>
                </div>
              </div>
            </div>

            {/* Risk Analysis */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Risk Analysis
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
                  Edit
                </Button>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                <p className="font-medium mb-2 text-red-700">
                  High Risk Factors:
                </p>
                <div className="space-y-1 mb-4">
                  <p>
                    • Customer Concentration Risk: 87% dependency on Hyundai
                    Group
                  </p>
                  <p>
                    • Exceeds industry risk threshold (80%), requires immediate
                    improvement
                  </p>
                </div>

                <p className="font-medium mb-2 text-yellow-700">
                  Medium Risk Factors:
                </p>
                <div className="space-y-1 mb-4">
                  <p>
                    • Raw Material Price Volatility: 60% steel raw material
                    dependency
                  </p>
                  <p>
                    • Profitability Improvement: Operating margin below industry
                    average
                  </p>
                </div>

                <p className="font-medium mb-2 text-green-700">
                  Positive Factors:
                </p>
                <div className="space-y-1">
                  <p>• Stable technology and quality management system</p>
                  <p>• Long-term business relationships (10+ years)</p>
                </div>
              </div>
            </div>

            {/* Loan Conditions */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recommended Loan Conditions
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
                  Edit
                </Button>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                <p className="font-medium mb-2">Recommended Loan Terms:</p>
                <div className="space-y-1 mb-4">
                  <p>
                    • Approval Limit: 2.5 billion KRW (83% of requested 3
                    billion KRW)
                  </p>
                  <p>
                    • Interest Rate: 4.5% per annum (preferential rate applied)
                  </p>
                  <p>
                    • Repayment Period: 5 years (equal principal installments)
                  </p>
                  <p>• Collateral: 120% real estate collateral recommended</p>
                </div>

                <p className="font-medium mb-2">Approval Conditions:</p>
                <div className="space-y-1">
                  <p>• Submit customer diversification plan</p>
                  <p>• Quarterly financial status reporting</p>
                  <p>• Establish raw material hedging plan</p>
                </div>
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
          Back
        </Button>
        <Button onClick={handleNext}>
          Complete
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
