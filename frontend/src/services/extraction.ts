import { httpClient } from "../lib/axios";

export interface ExtractionData {
  id: number;
  document_id: number;

  // 회사 정보
  company_name: string | null;
  business_number: string | null;
  ceo_name: string | null;
  establishment_date: string | null;
  industry: string | null;
  address: string | null;

  // 재무 정보
  revenue: number | null;
  operating_profit: number | null;
  net_profit: number | null;
  total_assets: number | null;
  total_liabilities: number | null;
  equity: number | null;

  // 기타 정보
  employee_count: number | null;
  main_products: string | null;
  loan_purpose: string | null;
  loan_amount: number | null;

  // 메타데이터
  extracted_at: string;
  extraction_method: string;
}

export const extractionService = {
  // 추출 데이터 조회
  getExtractionData: async (documentId: number): Promise<ExtractionData> => {
    return httpClient.get<ExtractionData>(`/api/extraction/${documentId}`);
  },

  // 추출 프로세스 트리거
  triggerExtraction: async (documentId: number): Promise<{ message: string; document_id?: number; extraction_id?: number }> => {
    return httpClient.post<{ message: string; document_id?: number; extraction_id?: number }, null>(
      `/api/extraction/${documentId}/process`,
      null
    );
  },
};