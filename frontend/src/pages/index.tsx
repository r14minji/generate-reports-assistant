import React from "react";
import { Link } from "react-router-dom";

// 예시: vite-plugin-pages를 사용한 파일 기반 라우팅
// src/pages/index.tsx -> "/" 경로
// src/pages/about.tsx -> "/about" 경로
// src/pages/user/[id].tsx -> "/user/:id" 동적 경로
const Home: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      {/* Corporate Loan Analysis System */}
      <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h2 className="text-xl font-semibold text-blue-900 mb-2">
          기업 대출 분석 시스템
        </h2>
        <p className="text-blue-700 mb-4">
          AI 기반 전문 대출 분석 플랫폼
          <br />
          모듈형 페이지 구조와 엔터프라이즈급 디자인으로 구성되어 있습니다.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/corporate-loan/dashboard"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            분석 시스템 시작
          </Link>
          <Link
            to="/corporate-loan/upload"
            className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md transition-colors"
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
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            바로 업로드하기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
