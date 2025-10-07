import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Layout from "../../components/common/Layout";
import FileUpload from "../../components/upload/FileUpload";
import { DocumentUploadResponse } from "../../services/documents";
import { extractionService } from "../../services/extraction";

export default function Upload() {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState<DocumentUploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [triggeringExtraction, setTriggeringExtraction] = useState(false);

  const handleUploadSuccess = async (response: DocumentUploadResponse) => {
    setUploadedFile(response);
    setError(null);

    // 업로드 성공 시 자동으로 데이터 추출 시작
    try {
      setTriggeringExtraction(true);
      console.log("Triggering extraction for document:", response.id);
      const result = await extractionService.triggerExtraction(response.id);
      console.log("Extraction completed:", result);
      setError(null);
    } catch (err: any) {
      console.error("Failed to trigger extraction:", err);
      const errorMsg = err.response?.data?.detail || "데이터 추출에 실패했습니다.";
      setError(errorMsg);
    } finally {
      setTriggeringExtraction(false);
    }
  };

  const handleUploadError = (errorMsg: string) => {
    setError(errorMsg);
    setUploadedFile(null);
  };

  const handleStartAnalysis = async () => {
    // 업로드된 파일의 document_id를 URL 파라미터로 전달
    if (uploadedFile?.id) {
      // 데이터 추출이 완료될 때까지 기다림
      if (triggeringExtraction) {
        // 아직 추출이 진행 중이면 대기
        setError("데이터 추출이 진행 중입니다. 잠시만 기다려주세요.");
        return;
      }
      navigate(`/corporate-loan/extraction?documentId=${uploadedFile.id}`);
    }
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
      title="문서 업로드"
      subtitle="사업계획서 및 지원 문서 업로드"
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
              {triggeringExtraction ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
              ) : (
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
              )}
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-green-800">
                {triggeringExtraction ? "데이터 추출 시작 중..." : "파일 업로드 완료"}
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
          이전
        </Button>
        {uploadedFile && (
          <Button
            onClick={handleStartAnalysis}
            disabled={triggeringExtraction}
          >
            {triggeringExtraction ? "추출 중..." : "분석 시작"}
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
