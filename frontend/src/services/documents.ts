import { httpClient } from "../lib/axios";

export interface DocumentUploadResponse {
  id: number;
  filename: string;
  filepath: string;
  file_size: number;
  upload_date: string;
  status: string;
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
};
