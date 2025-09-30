import React from "react";
import { Link } from "react-router-dom";
import { ROUTES, APP_CONFIG } from "../constants";

// 예시: 공통 레이아웃 컴포넌트 (현재는 Nav.tsx를 주로 사용)
interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* 예시: 헤더 영역 */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-6">
          <nav className="flex space-x-4">
            <Link
              to={ROUTES.HOME}
              className="text-gray-700 hover:text-blue-500"
            >
              홈
            </Link>
            <Link
              to={ROUTES.INFO}
              className="text-gray-700 hover:text-blue-500"
            >
              정보
            </Link>
          </nav>
        </div>
      </header>

      {/* 예시: 메인 콘텐츠 영역 */}
      <main className="max-w-7xl mx-auto py-6 px-6">{children}</main>

      {/* 예시: 푸터 영역 */}
      <footer className="bg-white shadow mt-10">
        <div className="max-w-7xl mx-auto py-4 px-6 text-center text-gray-500">
          © {new Date().getFullYear()} {APP_CONFIG.NAME}. 모든 권리 보유.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
