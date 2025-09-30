// 예시: 라우트 경로 상수 중앙 관리
export const ROUTES = {
  // 메인 페이지들
  HOME: "/",

  // 예시 페이지들
  COUNTER: "/counter", // Redux Toolkit 예시
  API_DEMO: "/api-demo", // TanStack Query 예시
  INFO: "/info", // i18next 예시

  // 동적 라우트 예시 (향후 확장용)
  USER_PROFILE: (id: string | number) => `/user/${id}`,
  BLOG_POST: (slug: string) => `/blog/${slug}`,
} as const;

// 예시: 네비게이션에서 사용할 메뉴 항목들
export const NAV_ITEMS = [
  {
    path: ROUTES.HOME,
    labelKey: "nav.home",
    fallback: "홈",
  },
  {
    path: ROUTES.COUNTER,
    labelKey: "nav.counter",
    fallback: "Redux",
  },
  {
    path: ROUTES.API_DEMO,
    labelKey: "nav.apiDemo",
    fallback: "TanStack Query",
  },
  {
    path: ROUTES.INFO,
    labelKey: "nav.info",
    fallback: "i18next",
  },
] as const;

// 예시: 라우트 타입 (타입 안전성을 위해)
export type RouteKeys = keyof typeof ROUTES;
export type RoutePaths = (typeof ROUTES)[RouteKeys];
