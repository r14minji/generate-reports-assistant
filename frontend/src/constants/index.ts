// 예시: constants 폴더의 모든 상수들을 한 곳에서 export
export * from "./routes";

// 예시: API 관련 상수들
export const API_CONFIG = {
  BASE_URL: "https://jsonplaceholder.typicode.com",
  TIMEOUT: 30000,
  RETRY_COUNT: 3,
} as const;

// 예시: 앱 설정 상수들
export const APP_CONFIG = {
  NAME: "React Boilerplate",
  VERSION: "1.0.0",
  DEFAULT_LANGUAGE: "ko",
  SUPPORTED_LANGUAGES: ["ko", "en"] as const,
} as const;

// 예시: 로컬 스토리지 키들
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER_PREFERENCES: "user_preferences",
  LANGUAGE: "i18nextLng",
  THEME: "theme",
} as const;

// 예시: 쿼리 키들 (TanStack Query용)
export const QUERY_KEYS = {
  POSTS: "posts",
  USER: "user",
  USERS: "users",
  // 함수형 쿼리 키 (매개변수가 있는 경우)
  POST_BY_ID: (id: number) => ["post", id],
  POSTS_BY_USER: (userId: number) => ["posts", "user", userId],
} as const;
