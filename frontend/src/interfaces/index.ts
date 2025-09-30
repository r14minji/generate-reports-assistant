// 예시: API 응답 타입 정의들
export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

// 예시: 사용자 관련 타입 (향후 확장용)
export interface User {
  id: number;
  name: string;
  email: string;
}

// 예시: 공통 API 응답 타입
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

// 예시: 페이지네이션 타입
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
