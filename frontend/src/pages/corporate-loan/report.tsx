import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/common/Button";
import Layout from "../../components/common/Layout";
import GenerateReport from "../../components/report/GenerateReport";
import { documentsService } from "../../services/documents";

export default function Report() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const documentId = Number(searchParams.get("documentId")) || 1;
  const [isSaving, setIsSaving] = useState(false);

  const handleBack = () => {
    navigate(`/corporate-loan/analysis?documentId=${documentId}`);
  };

  const handleSaveToSystem = async () => {
    try {
      setIsSaving(true);
      await documentsService.completeReport(documentId);
      alert("리포트가 시스템에 저장되었습니다.");
      navigate("/corporate-loan/dashboard");
    } catch (error) {
      console.error("리포트 저장 실패:", error);
      alert("리포트 저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout title="종합 리포트" subtitle="심사 보고서">
      <GenerateReport />

      <div className="flex flex-wrap justify-end gap-2 mt-6">
        <Button size="sm" variant="secondary">
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
          공유
        </Button>
        <Button size="sm" variant="secondary">
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
          PDF 다운로드
        </Button>
        <Button size="sm" variant="secondary">
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
          인쇄
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-6 ">
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
        <Button
          variant="primary"
          onClick={handleSaveToSystem}
          disabled={isSaving}
        >
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {isSaving ? "완료 처리 중..." : "리포트 완료"}
        </Button>
      </div>
    </Layout>
  );
}
