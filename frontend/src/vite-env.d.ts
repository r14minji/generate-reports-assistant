/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client" />

// vite-plugin-pages 가상 모듈 타입 정의
declare module "~react-pages" {
  import type { RouteObject } from "react-router-dom";
  const routes: RouteObject[];
  export default routes;
}
