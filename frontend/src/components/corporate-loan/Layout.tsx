import React from 'react';
import { useLocation } from 'react-router-dom';
import ProgressIndicator from './ProgressIndicator';
import Breadcrumb from './Breadcrumb';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function Layout({ children, title, subtitle }: LayoutProps) {
  const location = useLocation();

  // Extract current step from the path
  const pathSegments = location.pathname.split('/');
  const currentStep = pathSegments[pathSegments.length - 1] || 'dashboard';

  // Check if we're in the corporate loan system
  const isCorpLoanSystem = location.pathname.includes('/corporate-loan');

  // Generate breadcrumb items
  const breadcrumbItems = [];
  if (isCorpLoanSystem) {
    breadcrumbItems.push({ name: 'Corporate Loan Analysis', href: '/corporate-loan/dashboard' });

    const stepNames = {
      dashboard: 'Dashboard',
      upload: 'Document Upload',
      extraction: 'Data Extraction',
      analysis: 'Risk Analysis',
      report: 'Report Generation',
      final: 'Analysis Complete'
    };

    if (currentStep !== 'dashboard' && stepNames[currentStep as keyof typeof stepNames]) {
      breadcrumbItems.push({
        name: stepNames[currentStep as keyof typeof stepNames],
        current: true
      });
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Corporate Loan Analysis System
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              AI-powered document analysis and risk assessment platform
            </p>

            {/* Breadcrumb */}
            {isCorpLoanSystem && breadcrumbItems.length > 0 && (
              <div className="mt-4">
                <Breadcrumb items={breadcrumbItems} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      {isCorpLoanSystem && (
        <ProgressIndicator currentStep={currentStep} />
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {(title || subtitle) && (
            <div className="px-6 py-4 border-b border-gray-200">
              {title && (
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
              )}
            </div>
          )}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}