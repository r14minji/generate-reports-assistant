import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/corporate-loan/Layout';
import Button from '../../components/corporate-loan/Button';

export default function Analysis() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsProcessing(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    navigate('/corporate-loan/extraction');
  };

  const handleNext = () => {
    navigate('/corporate-loan/report');
  };

  return (
    <Layout title="Risk Analysis" subtitle="Industry classification and risk assessment">
      {isProcessing ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-blue-800 font-medium">
              Industry analysis in progress... Please wait
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Industry Classification */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Industry Classification</h3>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="text-base font-medium text-gray-900 mb-2">
                A01 - Automotive Parts Manufacturing
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                <strong>Confidence:</strong> 95% (Very High)
              </p>

              <div className="mt-3">
                <strong className="text-sm font-medium text-gray-700">Classification Basis:</strong>
                <ul className="mt-2 ml-4 space-y-1">
                  <li className="text-sm text-gray-600">• Main products: Engine parts, electrical components</li>
                  <li className="text-sm text-gray-600">• Clients: Hyundai Motors, Kia Motors</li>
                  <li className="text-sm text-gray-600">• Business area: B2B parts supply</li>
                </ul>
              </div>
            </div>

            <div>
              <strong className="text-sm font-medium text-gray-700 mb-3 block">Alternative Classifications:</strong>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { code: 'A01', name: 'Automotive Parts Mfg.', selected: true },
                  { code: 'A02', name: 'Food Manufacturing', selected: false },
                  { code: 'B01', name: 'Electronics Wholesale', selected: false },
                  { code: 'C01', name: 'IT Services', selected: false }
                ].map(industry => (
                  <div
                    key={industry.code}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      industry.selected
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
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
              Risk Assessment
              <span className="text-sm font-normal text-gray-500 ml-2">(Editable)</span>
            </h3>

            <div className="space-y-4">
              {/* High Risk */}
              <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      High Risk
                    </span>
                    <h4 className="font-medium text-red-900">Customer Concentration Risk</h4>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-red-800">
                  <p>Hyundai Group revenue dependency: 87%</p>
                  <p>Exceeds industry risk threshold of 80%</p>
                  <p className="mt-2"><strong>Recommendation:</strong> Customer diversification plan required</p>
                </div>
              </div>

              {/* Medium Risk */}
              <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-r-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Medium Risk
                    </span>
                    <h4 className="font-medium text-yellow-900">Raw Material Price Volatility</h4>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-yellow-800">
                  <p>Steel raw material dependency: 60%</p>
                  <p><strong>Recommendation:</strong> Hedging strategy verification needed</p>
                </div>
              </div>

              {/* Low Risk */}
              <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Low Risk
                    </span>
                    <h4 className="font-medium text-green-900">Technology & Quality Management</h4>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-green-800">
                  <p>ISO 9001 certified, low quality claims</p>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Ratios */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Ratio Analysis</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">
                  Debt Ratio: 145% vs Industry Avg. 120%
                </span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Caution
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">
                  Current Ratio: 135% vs Industry Avg. 130%
                </span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Good
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-blue-900">Overall Assessment: B Grade (2nd of 5 grades)</p>
                    <p className="text-sm text-blue-800 mt-1">Improvement Plan: Review profitability enhancement measures</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Button>
        <Button onClick={handleNext}>
          Generate Report
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </Layout>
  );
}