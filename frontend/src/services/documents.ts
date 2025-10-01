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

export const documentsService = {
  // 파일 업로드
  uploadDocument: async (file: File): Promise<DocumentUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    return httpClient.post<DocumentUploadResponse, FormData>(
      "/api/documents/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
};
