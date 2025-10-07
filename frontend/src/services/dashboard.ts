import { httpClient } from "../lib/axios";

export interface CompletedReport {
  id: number;
  filename: string;
  company_name: string | null;
  industry: string | null;
  upload_date: string | null;
  status: string;
}

export const dashboardService = {
  // 완료된 리포트 목록 조회
  getCompletedReports: async (): Promise<CompletedReport[]> => {
    return httpClient.get<CompletedReport[]>("/api/dashboard/completed-reports");
  },
};