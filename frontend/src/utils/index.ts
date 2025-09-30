// 예시: 공통 유틸리티 함수들

/**
 * 예시: 날짜 포맷팅 함수
 */
export const formatDate = (
  date: Date | string,
  locale: string = "ko-KR"
): string => {
  const d = new Date(date);
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * 예시: 문자열이 비어있는지 확인
 */
export const isEmpty = (value: string | null | undefined): boolean => {
  return !value || value.trim().length === 0;
};

/**
 * 예시: 숫자를 천 단위로 구분하여 포맷팅
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString("ko-KR");
};

/**
 * 예시: 디바운스 함수
 */
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * 예시: 로컬 스토리지 헬퍼
 */
export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  },

  remove: (key: string): void => {
    localStorage.removeItem(key);
  },
};
