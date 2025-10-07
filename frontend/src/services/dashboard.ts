import { httpClient } from "../lib/axios";

export interface DashboardStats {
  total_documents: number;
  total_analyses: number;
  today_uploads: number;
  today_analyses: number;
  avg_score: number | null;
}

export interface RecentAnalysisItem {
  id: number;
  document_id: number;
  filename: string;
  analysis_type: string;
  score: number | null;
  created_at: string;
}

export interface CompletedReport {
  id: number;
  filename: string;
  company_name: string | null;
  industry: string | null;
  upload_date: string | null;
  status: string;
}

export const dashboardService = {
  // 대시보드 통계 조회
  getStats: async (): Promise<DashboardStats> => {
    return httpClient.get<DashboardStats>("/api/dashboard/stats");
  },

  // 최근 분석 목록 조회
  getRecentAnalysis: async (limit: number = 10): Promise<RecentAnalysisItem[]> => {
    return httpClient.get<RecentAnalysisItem[]>(`/api/dashboard/recent-analysis?limit=${limit}`);
  },

  // 완료된 리포트 목록 조회
  getCompletedReports: async (): Promise<CompletedReport[]> => {
    return httpClient.get<CompletedReport[]>("/api/dashboard/completed-reports");
  },
};