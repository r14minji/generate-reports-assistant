import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/corporate-loan/Layout';
import Button from '../../components/corporate-loan/Button';

export default function Final() {
  const navigate = useNavigate();

  const handleReset = () => {
    navigate('/corporate-loan/dashboard');
  };

  const handleDashboard = () => {
    navigate('/corporate-loan/dashboard');
  };

  return (
    <Layout title="Analysis Complete" subtitle="Final assessment results">
      {/* Success Summary */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg p-8 text-center mb-8">
        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Analysis Completed Successfully</h2>
        <h3 className="text-xl font-semibold">Final Credit Rating: B+ (Recommended for Approval)</h3>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">8m 30s</div>
            <div className="text-sm opacity-90">Total Processing Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">32 pages</div>
            <div className="text-sm opacity-90">Analysis Document</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">94%</div>
            <div className="text-sm opacity-90">Extraction Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">2.5B KRW</div>
            <div className="text-sm opacity-90">Recommended Amount</div>
          </div>
        </div>
      </div>

      {/* Key Recommendations */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Recommendations</h3>
        <ol className="space-y-3 text-gray-600">
          <li className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">1</span>
            <div>
              <strong className="text-gray-900">Customer Concentration Improvement Plan</strong>
              <p className="text-sm">Reduce Hyundai dependency from 87% to below 70%</p>
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">2</span>
            <div>
              <strong className="text-gray-900">Collateral Setup at 120% Ratio</strong>
              <p className="text-sm">Real estate collateral for risk hedging</p>
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">3</span>
            <div>
              <strong className="text-gray-900">Quarterly Financial Monitoring</strong>
              <p className="text-sm">Monitor profitability improvement trends</p>
            </div>
          </li>
        </ol>
      </div>

      {/* Efficiency Comparison */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Efficiency Comparison</h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-3">Traditional Method</h5>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Document Review:</span>
                <span>120 minutes</span>
              </div>
              <div className="flex justify-between">
                <span>Analysis Work:</span>
                <span>60 minutes</span>
              </div>
              <div className="flex justify-between">
                <span>Report Writing:</span>
                <span>30 minutes</span>
              </div>
              <div className="flex justify-between font-medium text-gray-900 pt-2 border-t">
                <span>Total Time:</span>
                <span>3 hours 30 minutes</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-3">AI Agent System</h5>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Auto Extraction:</span>
                <span>3 minutes</span>
              </div>
              <div className="flex justify-between">
                <span>Auto Analysis:</span>
                <span>4 minutes</span>
              </div>
              <div className="flex justify-between">
                <span>Auto Generation:</span>
                <span>1.5 minutes</span>
              </div>
              <div className="flex justify-between font-medium text-gray-900 pt-2 border-t">
                <span>Total Time:</span>
                <span>8 minutes 30 seconds</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="font-semibold">95% Efficiency Improvement!</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Button variant="outline">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Email Report
        </Button>
        <Button variant="outline">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Save to System
        </Button>
        <Button onClick={handleReset}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          New Analysis
        </Button>
        <Button variant="secondary" onClick={handleDashboard}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v0a2 2 0 012-2h6l2 2h6a2 2 0 012 2z" />
          </svg>
          Dashboard
        </Button>
      </div>
    </Layout>
  );
}