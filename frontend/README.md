# React Boilerplate

팀 프로젝트를 위한 React Boilerplate입니다.

## ⚡ 핵심 기술 스택

**개발 환경**

- [Vite](https://vitejs.dev/) - 빠른 개발 서버 및 빌드
- [TypeScript](https://www.typescriptlang.org/) - 타입 안정성
- [ESLint](https://eslint.org/) - 코드 품질 관리

**UI & 스타일링**

- [React 19](https://react.dev/) - 최신 React
- [TailwindCSS 4](https://tailwindcss.com/) - 유틸리티 CSS

**상태 관리**

- [Redux Toolkit](https://redux-toolkit.js.org/) - 전역 상태
- [TanStack Query](https://tanstack.com/query/latest) - 서버 상태
- [Axios](https://axios-http.com/) - HTTP 클라이언트

**라우팅 & 국제화**

- [vite-plugin-pages](https://github.com/hannoeru/vite-plugin-pages) - 파일 기반 라우팅
- [React-i18next](https://react.i18next.com/) - 다국어 지원

## 시작하기

### 필수 조건

- Node.js 18.0.0 이상
- Yarn 패키지 매니저

### 설치 및 실행

```bash
# 의존성 설치
yarn install

# 개발 서버 실행
yarn dev

# 빌드
yarn build

# 린트 실행
yarn lint

# 코드 포맷팅
yarn format
```

## 📁 프로젝트 구조

```
├── public/                     # 정적 파일
├── src/
│   ├── components/             # 재사용 가능한 UI 컴포넌트
│   │   ├── Layout.tsx          # 레이아웃 컴포넌트
│   │   └── Nav.tsx             # 네비게이션 컴포넌트
│   ├── constants/              # 앱 전역에서 사용하는 상수들
│   │   ├── index.ts            # 모든 상수 통합 export
│   │   └── routes.ts           # 라우트 경로 및 네비게이션 설정
│   ├── lib/                    # 외부 라이브러리 설정
│   │   ├── axios.ts            # Axios 인스턴스 및 인터셉터 설정
│   │   └── i18n/               # 국제화 설정
│   │       ├── index.ts        # i18next 초기 설정
│   │       └── locales/        # 언어별 번역 파일
│   ├── pages/                  # 파일 기반 라우팅 (vite-plugin-pages)
│   │   ├── index.tsx           # 홈페이지 (/)
│   │   ├── counter.tsx         # Redux 예시 (/counter)
│   │   ├── api-demo.tsx        # TanStack Query 예시 (/api-demo)
│   │   └── info.tsx            # i18next 예시 (/info)
│   ├── services/               # API 비즈니스 로직
│   │   └── postService.ts      # 포스트 관련 API 호출들
│   ├── store/                  # Redux 상태 관리
│   │   ├── index.ts            # 스토어 설정
│   │   └── features/           # 기능별 슬라이스
│   │       └── counterSlice.ts
│   ├── interfaces/             # TypeScript 타입 정의
│   │   └── index.ts            # API 응답, 공통 타입들
│   ├── utils/                  # 공통 유틸리티 함수
│   │   └── index.ts            # 날짜 포맷, 디바운스, 스토리지 헬퍼 등
│   ├── App.tsx                 # 루트 컴포넌트
│   └── main.tsx                # 애플리케이션 진입점
├── index.html                  # HTML 템플릿
└── vite.config.ts              # Vite 설정
```

### 📋 폴더별 역할

| 폴더          | 용도                                 | 예시                               |
| ------------- | ------------------------------------ | ---------------------------------- |
| `components/` | 재사용 가능한 UI 컴포넌트            | `Button.tsx`, `Modal.tsx`          |
| `constants/`  | 앱 전역 상수 관리                    | `routes.ts`, `apiConfig.ts`        |
| `lib/`        | 외부 라이브러리 설정 및 초기화       | `axios.ts`, `i18n/`                |
| `pages/`      | 각 라우트에 대응하는 페이지 컴포넌트 | `index.tsx` → `/`                  |
| `services/`   | API 호출 로직 (비즈니스 레이어)      | `userService.ts`, `authService.ts` |
| `store/`      | 전역 상태 관리 (Redux)               | `userSlice.ts`, `themeSlice.ts`    |
| `interfaces/` | TypeScript 타입 및 인터페이스        | `User.ts`, `ApiResponse.ts`        |
| `utils/`      | 공통 유틸리티 함수                   | `formatDate.ts`, `validation.ts`   |

## 🚀 주요 특징

- **파일 기반 라우팅**: `src/pages/` 폴더에 파일 추가만으로 자동 라우트 생성
- **레이어드 아키텍처**: lib → services → pages 구조로 관심사 분리
- **타입 안전**: TypeScript로 컴파일 타임 에러 방지
- **빠른 개발**: Vite의 HMR로 즉시 변경사항 확인
- **다국어 지원**: i18next로 쉬운 번역 관리
- **상태 관리**: Redux Toolkit + TanStack Query로 클라이언트/서버 상태 분리
- **HTTP 클라이언트**: Axios 인터셉터로 요청/응답 로깅 및 에러 처리

## 📁 페이지 추가하기

```bash
# 새 페이지 생성 예시
src/pages/
├── index.tsx          # → / 경로
├── about.tsx          # → /about 경로
├── user/
│   ├── index.tsx      # → /user 경로
└── └── [id].tsx       # → /user/:id 동적 경로

```

## 🔧 사용 패턴 예시

### constants 중앙 관리

```typescript
// constants/routes.ts - 라우트 경로 중앙 관리
export const ROUTES = {
  HOME: '/',
  USER_PROFILE: (id: string) => `/user/${id}`,
} as const;

// components/Nav.tsx - constants 사용
import { NAV_ITEMS } from '../constants';
{NAV_ITEMS.map(item => (
  <Link key={item.path} to={item.path}>
    {t(item.labelKey, item.fallback)}
  </Link>
))}
```

### 서비스 레이어 패턴

```typescript
// 1. lib/axios.ts - HTTP 클라이언트 설정
export const httpClient = {
  get: <T>(url: string) => axiosInstance.get<T>(url),
  post: <T>(url: string, data: any) => axiosInstance.post<T>(url, data),
};

// 2. services/userService.ts - 비즈니스 로직
export const userService = {
  getUsers: () => httpClient.get<User[]>("/users"),
  createUser: (data: CreateUserDto) => httpClient.post<User>("/users", data),
};

// 3. 페이지에서 TanStack Query와 함께 사용
const { data: users } = useQuery({
  queryKey: [QUERY_KEYS.USERS], // constants에서 관리
  queryFn: userService.getUsers,
});
```

## 🎨 추천 UI 라이브러리 (Boilerplate에 추가되어있지 않음)

### [shadcn/ui](https://ui.shadcn.com/)

TailwindCSS 기반의 현대적인 UI 컴포넌트 라이브러리입니다.

**주요 장점:**

- 🎯 **TailwindCSS 완벽 호환**: 기존 스타일링과 자연스러운 통합
- ✨ **최신 트렌드 반영**: 모던하고 세련된 디자인 시스템
- 🔧 **코드 소유권**: 컴포넌트 코드를 직접 복사하여 자유롭게 커스터마이징 가능
- 📦 **선택적 설치**: 필요한 컴포넌트만 골라서 설치하는 방식
- 🎨 **다크모드 지원**: 내장된 다크/라이트 테마 전환
- ⚡ **경량화**: 사용하는 컴포넌트만 번들에 포함

**설치 방법:**

```bash
# shadcn-ui 설치
npx shadcn-ui@latest init

# 필요한 컴포넌트 개별 설치 (예시)
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
```

**사용 예시:**

```typescript
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// 바로 사용 가능하며, 필요시 코드를 직접 수정할 수 있음
<Button variant="default" size="lg">
  클릭하세요
</Button>
```

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.
