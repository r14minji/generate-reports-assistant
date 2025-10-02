import { httpClient } from "../lib/axios";

export interface DocumentUploadResponse {
  id: number;
  filename: string;
  filepath: string;
  file_size: number;
  upload_date: string;
  status: string;
}

export interface ReviewOpinionResponse {
  review_opinion: string | null;
}

export interface ReportData {
  summary: string;
  company: {
    name: string;
    industry: string;
    established_year: string;
    main_business: string;
    main_clients: string;
  };
  financial: {
    ratios: {
      debt_ratio: string;
      current_ratio: string;
      operating_margin: string;
    };
    revenue: {
      current_year: string;
      next_year: string;
      year_after_next: string;
    };
  };
  risk: {
    high: string[];
    medium: string[];
    positive: string[];
  };
  loan: {
    conditions: {
      approval_limit: string;
      interest_rate: string;
      repayment_period: string;
      collateral: string;
    };
    approval_requirements: string[];
  };
}

export interface ReportResponse {
  data: ReportData;
}

export const documentsService = {
  // 파일 업로드
  uploadDocument: async (file: File): Promise<DocumentUploadResponse> => {
    const formData = new FormData();
    console.log("file", file);
    console.log("formData", formData);
    formData.append("file", file);
    console.log("formData after append", formData.get("file"));

    return httpClient.post<DocumentUploadResponse, FormData>(
      "/api/documents/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 300000, // 5분 (OCR/LLM 처리 시간 고려)
      }
    );
  },

  // 심사 의견 저장
  updateReviewOpinion: async (
    documentId: number,
    reviewOpinion: string
  ): Promise<ReviewOpinionResponse> => {
    return httpClient.put<ReviewOpinionResponse>(
      `/api/documents/${documentId}/review-opinion`,
      { review_opinion: reviewOpinion }
    );
  },

  // 심사 의견 조회
  getReviewOpinion: async (
    documentId: number
  ): Promise<ReviewOpinionResponse> => {
    return httpClient.get<ReviewOpinionResponse>(
      `/api/documents/${documentId}/review-opinion`
    );
  },

  // 리포트 데이터 조회
  getReport: async (documentId: number): Promise<ReportResponse> => {
    return httpClient.get<ReportResponse>(
      `/api/documents/${documentId}/report`
    );
  },

  // 리포트 데이터 저장
  updateReport: async (
    documentId: number,
    data: ReportData
  ): Promise<ReportResponse> => {
    return httpClient.post<ReportResponse>(
      `/api/documents/${documentId}/report`,
      { data }
    );
  },
};
