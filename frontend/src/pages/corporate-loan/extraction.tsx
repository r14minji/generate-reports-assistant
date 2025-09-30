import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/common/Button";
import Layout from "../../components/common/Layout";
import ExtractionData from "../../components/extraction/ExtractionData";

export default function Extraction() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // URL 쿼리 파라미터에서 documentId 가져오기 (없으면 기본값 1)
  const documentId = Number(searchParams.get("documentId")) || 1;

  const handleBack = () => {
    navigate("/corporate-loan/upload");
  };

  const handleNext = () => {
    navigate(`/corporate-loan/additional-info?documentId=${documentId}`);
  };

  return (
    <Layout
      title="Data Extraction"
      subtitle="Review and verify extracted information"
    >
      <ExtractionData documentId={documentId} />

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
