import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/corporate-loan/Layout';
import Button from '../../components/corporate-loan/Button';

export default function Upload() {
  const navigate = useNavigate();
  const [fileUploaded, setFileUploaded] = useState(false);

  const handleFileUpload = () => {
    setFileUploaded(true);
  };

  const handleStartAnalysis = () => {
    navigate('/corporate-loan/extraction');
  };

  const handleBack = () => {
    navigate('/corporate-loan/dashboard');
  };

  return (
    <Layout title="Document Upload" subtitle="Upload business plan and supporting documents">
      <div className="max-w-2xl mx-auto">
        <div
          onClick={handleFileUpload}
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50 hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200 cursor-pointer"
        >
          <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Upload Documents
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Drag and drop your business plan or click to browse
          </p>
          <div className="text-xs text-gray-500">
            <p>Supported formats: PDF, DOCX, PPT, Images</p>
            <p>Maximum file size: 50MB</p>
          </div>
        </div>

        {fileUploaded && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-green-800">
                  File uploaded successfully
                </div>
                <div className="text-sm text-green-700">
                  ABC_Automotive_Business_Plan.pdf (2.3MB)
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Button>
          {fileUploaded && (
            <Button onClick={handleStartAnalysis}>
              Start Analysis
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
}