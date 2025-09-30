import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

// 예시: Axios 인스턴스 생성 및 설정
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Cache-Control": "no-cache",
  },
  validateStatus: (status) => {
    return status >= 200 && status < 300; // 기본 성공 상태 코드 범위
  },
});

// 예시: 요청 인터셉터 - 모든 요청에 대해 실행
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("API 요청 URL:", `${config.baseURL || ""}${config.url || ""}`);
    console.log("요청 헤더:", config.headers);
    // 예시: 인증 토큰이 있다면 여기서 추가
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    console.error("요청 에러:", error.message);
    return Promise.reject(error);
  }
);

// 예시: 응답 인터셉터 - 모든 응답에 대해 실행
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("응답 상태:", response.status);
    console.log("응답 데이터:", response.data);
    // data만 반환하여 사용하기 편리하게 만듦
    return response.data;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      console.error("Axios 에러:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });

      // 예시: 401 에러 시 로그아웃 처리
      // if (error.response?.status === 401) {
      //   localStorage.removeItem('token');
      //   window.location.href = '/login';
      // }
    } else {
      console.error("알 수 없는 에러:", error);
    }
    return Promise.reject(error);
  }
);

// 예시: HTTP 메서드별 래퍼 함수들
export const httpClient = {
  get: async <T>(endpoint: string): Promise<T> => {
    return axiosInstance.get<T, T>(endpoint);
  },

  post: async <T, D = unknown>(endpoint: string, data: D, config?: any): Promise<T> => {
    return axiosInstance.post<T, T>(endpoint, data, config);
  },

  put: async <T, D = unknown>(endpoint: string, data: D): Promise<T> => {
    return axiosInstance.put<T, T>(endpoint, data);
  },

  patch: async <T, D = unknown>(endpoint: string, data: D): Promise<T> => {
    return axiosInstance.patch<T, T>(endpoint, data);
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    return axiosInstance.delete<T, T>(endpoint);
  },
};
