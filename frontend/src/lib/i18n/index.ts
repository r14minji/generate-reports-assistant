import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// 리소스의 타입 정의
type TranslationResource = {
  welcome: string;
  description: string;
  nav: {
    home: string;
    data: string;
    about: string;
  };
  home: {
    title: string;
    techStack: string;
    tech1: string;
    tech2: string;
    tech3: string;
    tech4: string;
    tech5: string;
    tech6: string;
    tech7: string;
    tech8: string;
  };
  data: {
    title: string;
    loading: string;
    error: string;
    apiTitle: string;
    apiDescription: string;
    apiDetailsTitle: string;
    apiBaseUrl: string;
    apiResponseFormat: string;
    apiAuth: string;
    apiTimeout: string;
    apiNote: string;
  };
  about: {
    title: string;
    description: string;
    reduxTest: string;
    count: string;
    decrease: string;
    increase: string;
    increaseBy: string;
    backToHome: string;
  };
};

// locales 하위의 모든 번역 파일 자동 로드
const modules = import.meta.glob("./locales/**/*.ts", {
  eager: true,
  import: "default",
});

const resources: Record<string, { translation: TranslationResource }> =
  Object.entries(modules).reduce(
    (acc, [fileName, content]) => {
      const match = fileName.match(/^.*\/(.*).ts$/);
      if (match)
        acc[match[1]] = { translation: content as TranslationResource };
      return acc;
    },
    {} as Record<string, { translation: TranslationResource }>
  );

// 지원하는 언어 목록 생성
const availableLocales = Object.keys(resources);

export const initI18n = () => {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      lng: "ko",
      fallbackLng: "ko",
      debug: process.env.NODE_ENV === "development",
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ["querystring", "cookie", "localStorage", "navigator"],
        lookupQuerystring: "lng",
        lookupCookie: "i18next",
        lookupLocalStorage: "i18nextLng",
        caches: [],
      },
    } as const);
};

export { availableLocales };
export default i18n;
