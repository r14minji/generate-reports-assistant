import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Layout from "../../components/common/Layout";
import FileUpload from "../../components/upload/FileUpload";
import { DocumentUploadResponse } from "../../services/documents";

export default function Upload() {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState<DocumentUploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUploadSuccess = (response: DocumentUploadResponse) => {
    setUploadedFile(response);
    setError(null);
  };

  const handleUploadError = (errorMsg: string) => {
    setError(errorMsg);
    setUploadedFile(null);
  };

  const handleStartAnalysis = () => {
    navigate("/corporate-loan/extraction");
  };

  const handleBack = () => {
    navigate("/corporate-loan/dashboard");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <Layout
      title="Document Upload"
      subtitle="Upload business plan and supporting documents"
    >
      <FileUpload
        onUploadSuccess={handleUploadSuccess}
        onUploadError={handleUploadError}
      />

      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-red-800">{error}</div>
            </div>
          </div>
        </div>
      )}

      {uploadedFile && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-green-800">
                File uploaded successfully
              </div>
              <div className="text-sm text-green-700">
                {uploadedFile.filename} ({formatFileSize(uploadedFile.file_size)})
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-between">
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
        {uploadedFile && (
          <Button onClick={handleStartAnalysis}>
            Start Analysis
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
        )}
      </div>
    </Layout>
  );
}
