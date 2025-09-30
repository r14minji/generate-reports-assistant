import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NAV_ITEMS } from "../constants";

// 예시: React Router와 i18next, 그리고 constants를 함께 사용한 네비게이션
const Nav: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex space-x-8">
              {/* 예시: constants에서 중앙 관리되는 네비게이션 메뉴 */}
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive(item.path)
                      ? "border-gray-300 text-white"
                      : "border-transparent text-gray-300 hover:border-gray-400 hover:text-gray-100"
                  }`}
                >
                  {t(item.labelKey, item.fallback)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
