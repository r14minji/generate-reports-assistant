import React, { useEffect, useState } from 'react';
import { dashboardService, RecentAnalysisItem } from '../../services/dashboard';

interface RecentAnalysisListProps {
  limit?: number;
}

export default function RecentAnalysisList({ limit = 10 }: RecentAnalysisListProps) {
  const [analyses, setAnalyses] = useState<RecentAnalysisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentAnalyses = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getRecentAnalysis(limit);
        setAnalyses(data);
        setError(null);
      } catch (err) {
        setError('Failed to load recent analyses');
        console.error('Error fetching recent analyses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentAnalyses();
  }, [limit]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreBadge = (score: number | null) => {
    if (score === null) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          N/A
        </span>
      );
    }

    if (score >= 80) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Low Risk ({score})
        </span>
      );
    } else if (score >= 60) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Medium Risk ({score})
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          High Risk ({score})
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Analysis</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Analysis</h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Analysis</h3>
        <div className="text-center py-8 text-gray-500">
          No analyses found
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Recent Analysis
        </h3>
        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
      <div className="space-y-4">
        {analyses.map((analysis) => (
          <div key={analysis.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
            <div className="font-medium text-gray-900 mb-1">{analysis.filename}</div>
            <div className="text-sm text-gray-600 mb-2">
              Type: {analysis.analysis_type} | ID: #{analysis.document_id}
            </div>
            <div className="flex items-center justify-between">
              {getScoreBadge(analysis.score)}
              <span className="text-xs text-gray-500">{formatDate(analysis.created_at)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}