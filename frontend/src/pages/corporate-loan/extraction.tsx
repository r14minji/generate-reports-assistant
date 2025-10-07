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
      title="데이터 추출"
      subtitle="추출된 정보 확인 및 검증"
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
          이전
        </Button>
        <Button onClick={handleNext}>
          다음 단계
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
