# 보고서 자동 생성 시스템

재무제표와 사업계획서를 업로드하면 AI가 자동으로 데이터를 추출하고 위험 분석을 수행하여 대출 심사 보고서를 생성합니다.

## 주요 기능

### 1. 문서 업로드 및 데이터 추출

- **재무제표 및 사업계획서 업로드**: PDF, 이미지(JPG, PNG) 형식 지원
- **AI 기반 자동 데이터 추출**: Google Gemini AI를 활용한 재무 데이터 자동 추출
  - 기업명, 대표자명, 사업자등록번호 등 기본 정보
  - 매출액, 영업이익, 당기순이익 등 재무 데이터
  - 자산, 부채, 자본 정보
  - 산업 분류 및 사업 내용

### 2. 위험 분석

- **산업 분류 분석**: AI 기반 산업 코드 자동 분류 및 대안 제시
- **위험 요소 평가**: 재무 건전성, 수익성, 성장성 등 다각도 분석
- **재무 비율 분석**:
  - 유동비율, 부채비율, ROE 등 주요 재무지표 계산
  - 산업 평균 대비 비교 분석
  - 위험도 수준별 시각화 (양호/주의/위험)

### 3. 추가 정보 관리

- **산업별 맞춤 정보**: AI가 산업 특성에 맞는 추가 정보 필드 제안
- **담보 정보 관리**: 담보 종류, 평가액, 담보율 등 관리
- **심사 의견 작성**: 심사자 의견 입력 및 관리

### 4. 보고서 생성

- **최종 심사 보고서 자동 생성**: 모든 분석 결과를 종합한 전문적인 보고서
- **PDF 다운로드**: 생성된 보고서를 PDF 형식으로 다운로드

### 5. 대시보드

- **완료된 리포트 목록**: 완료된 문서 및 분석 결과 조회

## 기술 스택

### Backend

- **FastAPI**: Python 기반 웹 프레임워크
- **SQLAlchemy**: ORM 데이터베이스 관리
- **SQLite**: 데이터베이스
- **Google Gemini AI**: 구조화된 데이터 추출 및 분석
- **Tesseract OCR**: 광학 문자 인식 (문서 텍스트 추출)
- **OpenCV & Pillow**: 이미지 전처리 및 OCR 정확도 향상

### Frontend

- **React 19**: UI 프레임워크
- **TypeScript**: 타입 안정성
- **Vite**: 빌드 도구
- **TailwindCSS 4**: 스타일링
- **React Query**: 서버 상태 관리
- **Redux Toolkit**: 클라이언트 상태 관리
- **React Router**: 라우팅
- **Axios**: HTTP 클라이언트

### Infrastructure

- **Docker & Docker Compose**: 컨테이너화
- **Redis**: 캐싱 (백엔드 의존성)

## 로컬 환경 설정

### 사전 요구사항

- Docker 및 Docker Compose 설치
- Google Gemini API 키 ([Google AI Studio](https://aistudio.google.com/app/apikey)에서 발급)

### 설치 및 실행

#### 1. 저장소 클론

```bash
git clone <repository-url>
cd generate-reports-assistant
```

#### 2. 환경 변수 설정

```bash
# .env 파일 생성 (프로젝트 루트에)
cp .env.example .env

# .env 파일 편집하여 API 키 추가
# OPENAI_API_KEY=your_google_gemini_api_key_here
```

**중요**: Google Gemini API 키를 `.env` 파일의 `OPENAI_API_KEY`에 입력해야 합니다.

#### 3. Docker Compose로 실행

```bash
docker-compose up --build
```

#### 4. 서비스 접속

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API 문서: http://localhost:8000/docs

### Docker 없이 로컬 실행

#### Backend 실행

```bash
cd backend

# 가상환경 생성 및 활성화
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# 환경 변수 설정
export OPENAI_API_KEY=your_google_gemini_api_key_here
# Windows: set OPENAI_API_KEY=your_google_gemini_api_key_here

# 서버 실행
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend 실행

```bash
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

**주의**: Redis가 필요합니다. Docker로 Redis를 실행하거나 로컬에 설치해야 합니다.

```bash
# Docker로 Redis 실행
docker run -d -p 6379:6379 redis:7-alpine
```

## 사용 방법

### 테스트 파일

로컬 환경에서 테스트할 수 있도록 `backend/uploads/` 디렉토리에 샘플 보고서 파일 4개가 포함되어 있습니다:

- 제조업 (서울자동차부품 주식회사)
- 신재생에너지 (그린에너지솔루션 주식회사)
- 물류 및 운송 (한강물류서비스 주식회사)
- IT 소프트웨어 개발 (스마트테크놀로지 주식회사)

각 파일은 다양한 업종과 규모의 기업 정보를 담고 있어 시스템을 테스트하는 데 활용할 수 있습니다.

### 1. 문서 업로드

- 메인 페이지에서 "문서 업로드" 버튼 클릭
- 재무제표 또는 사업계획서 PDF/이미지 파일 선택 (위의 테스트 파일 사용)
- AI가 자동으로 데이터를 추출합니다 (약 30초~1분 소요)

### 2. 데이터 확인 및 수정

- 추출된 데이터 확인
- 필요시 데이터 수정 가능

### 3. 위험 분석

- "위험 분석" 탭에서 AI 기반 위험 분석 결과 확인
- 산업 분류, 위험 요소, 재무 비율 등 확인

### 4. 추가 정보 입력

- "추가 정보" 탭에서 담보 정보 등 추가 데이터 입력
- AI가 산업별로 필요한 정보를 제안합니다

### 5. 심사 의견 작성

- 심사자 의견 입력

### 6. 보고서 생성

- "보고서 생성" 버튼 클릭
- 최종 심사 보고서를 PDF로 다운로드

## 프로젝트 구조

```
generate-reports-assistant/
├── backend/              # FastAPI 백엔드
│   ├── app/
│   │   ├── api/         # API 라우터
│   │   ├── core/        # 데이터베이스 설정
│   │   ├── models/      # SQLAlchemy 모델
│   │   ├── schemas/     # Pydantic 스키마
│   │   └── services/    # 비즈니스 로직
│   ├── main.py          # FastAPI 앱 진입점
│   └── requirements.txt # Python 의존성
├── frontend/            # React 프론트엔드
│   ├── src/
│   │   ├── components/  # 재사용 가능한 컴포넌트
│   │   ├── pages/       # 페이지 컴포넌트
│   │   ├── services/    # API 서비스
│   │   ├── store/       # Redux 스토어
│   │   └── utils/       # 유틸리티 함수
│   └── package.json     # NPM 의존성
├── data/                # 데이터 저장소
├── docker-compose.yml   # Docker Compose 설정
└── README.md
```

## API 엔드포인트

주요 API 엔드포인트:

- `GET /api/dashboard/completed-reports` - 완료된 리포트 목록
- `POST /api/documents/upload` - 문서 업로드
- `GET /api/extraction/{document_id}` - 추출 데이터 조회
- `PUT /api/extraction/{document_id}` - 추출 데이터 수정
- `POST /api/documents/{document_id}/analyze-risk` - 위험 분석
- `GET /api/additional-info/{document_id}/suggestions` - 추가 정보 제안
- `POST /api/documents/{document_id}/generate-report` - 보고서 생성

전체 API 문서: http://localhost:8000/docs

## 개발 도구

### Frontend

```bash
# 린트 검사
npm run lint

# 린트 자동 수정
npm run lint:fix

# 코드 포맷팅
npm run format

# 포맷팅 검사
npm run format:check

# 프로덕션 빌드
npm run build
```

### Backend

```bash
# 데이터베이스 마이그레이션 (필요시)
python migrate_add_collateral.py
python migrate_add_report_data.py
python migrate_add_review_opinion.py
```

## 라이선스

MIT
