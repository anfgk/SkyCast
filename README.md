## 프로젝트 소개

실시간 도시별 날씨를 빠르고 가볍게 확인할 수 있는 React + TypeScript 기반의 웹앱입니다. 사전 정의된 도시를 선택하면 현재 기온, 체감온도, 풍속, 습도 등의 핵심 정보를 카드를 통해 즉시 확인할 수 있고, 즐겨찾기로 자주 보는 도시를 손쉽게 관리할 수 있도록 설계했습니다. Vite와 TailwindCSS로 빠른 개발 경험과 반응형 UI를 제공합니다.

## 컨셉 개요

SkyCast는 “복잡하지 않은 날씨 경험”을 목표로 한 간결한 날씨 대시보드입니다. 필요한 정보(현재 날씨·상세 지표·즐겨찾기)를 최소한의 클릭으로 확인하게 하고, 향후 지도/예보 확장과 PWA를 통해 일상 속에서 자주 쓰이는 유틸리티가 되는 것을 지향합니다.

## 서비스 관점 주요 기능

1. **도시별 현재 날씨 조회**: 사전 구성된 도시 목록 기반으로 날씨 데이터 조회
2. **상세 지표 카드 뷰**: 온도, 체감온도, 풍속, 습도 등 핵심 지표 제공
3. **즐겨찾기 관리**: 자주 확인하는 도시 추가/삭제 및 목록 확인
4. **반응형 레이아웃**: 모바일/데스크톱 모두 보기 좋은 컴포넌트 구성
5. **에셋 제공**: 대표 이미지, 지도 마커 아이콘(확장 대비) 포함

## 주요 목표

- 직관적인 대시보드 설계와 컴포넌트 분리로 가독성과 재사용성 확보
- 타입 안전한 API 연동과 데이터 모델링 정립
- 반응형 UI와 생산성 높은 개발 환경(Vite + TailwindCSS) 구축

## 기술 스택

- **런타임/언어**: TypeScript
- **프레임워크/도구**: React 18, Vite
- **스타일**: TailwindCSS, PostCSS
- **상태 관리**: 경량 로컬 스토어(`shared/store/favoriteStore.ts`)
- **품질**: ESLint(구성 파일 포함)
- **배포**: 정적 호스팅(Vercel/Netlify 등) 또는 Nginx 서빙

## 기능 요약

- **도시 선택 → 조회**: 기본 도시 목록에서 선택 시 즉시 날씨 요청/표시
- **요약/상세 카드**: `WeatherCard`(요약), `DetailedWeatherCard`(상세)로 단계적 정보 제공
- **즐겨찾기 흐름**: 카드/대시보드에서 즐겨찾기 토글, 목록 렌더링
- **로딩/에러 처리**: API 요청 상태에 따른 UI 반응(기본 처리)

## 페이지 구조

- **App 루트** (`src/app/App.tsx`, `src/App.tsx`): 전역 레이아웃 및 라우트 엔트리(단일 페이지)
- **WeatherDashboard** (`src/widgets/WeatherDashboard/ui/WeatherDashboard.tsx`): 도시 선택, API 트리거, 결과 섹션 관리
- **WeatherCard** (`src/entities/Weather/ui/WeatherCard.tsx`): 도시명/아이콘/현재 온도 요약
- **DetailedWeatherCard** (`src/entities/Weather/ui/DetailedWeatherCard.tsx`): 체감온도/풍속/습도 등 상세

## 폴더 구조(요약)

```text
src/
  app/
    App.tsx
  entities/
    Weather/
      ui/
        WeatherCard.tsx
        DetailedWeatherCard.tsx
  widgets/
    WeatherDashboard/
      ui/
        WeatherDashboard.tsx
  shared/
    api/
      weatherApi.ts
    store/
      favoriteStore.ts
    config/
      cities.ts
  main.tsx
```

## 실행 방법

```bash
npm install
npm run dev
```

## 빌드/배포

- 개발: `npm run dev` (Vite 개발 서버)
- 빌드: `npm run build`
- 프리뷰: `npm run preview`
- 린트: 프로젝트 ESLint 구성 사용 가능

## 데이터/로직 개요

- **날씨 API 연동**: `shared/api/weatherApi.ts`에서 데이터 요청/응답 맵핑
- **도시 데이터**: `shared/config/cities.ts`에 기본 도시 목록 정의(MVP 단계)
- **즐겨찾기 상태**: `shared/store/favoriteStore.ts`에서 추가/삭제/조회 관리
- **UI 컴포넌트**: 요약/상세 카드를 조합해 대시보드에서 단계적 정보 제공

## 스크린샷/에셋

- 대표 이미지: `public/weather.png`
- 지도 마커 에셋: `public/marker-icon.png`, `public/marker-icon-2x.png`, `public/marker-shadow.png`

## 접근성/UX 고려

- 키보드 포커스 가능한 인터랙션과 충분한 터치 타겟
- 일관된 여백/타이포/컬러 시스템(Tailwind 프리셋)으로 가독성 강화
- 모바일 퍼스트 레이아웃과 간결한 카드 베이스 정보 구조

## 개선 아이디어(향후 계획)

- 도시 검색/자동완성, 사용자가 임의 도시 입력 기능
- 5일/주간 예보 및 시간대별 그래프, 지도(Leaflet/Mapbox) 연동
- 위치 기반(Geolocation) 현재 위치 날씨
- 오프라인/PWA 지원과 이미지 최적화, 코드 스플리팅 고도화
- 테스트 도입(Vitest, React Testing Library)으로 회귀 방지

## 활용 방안

- **개인 유틸리티**: 출퇴근/외출 전 빠른 기상 확인 도구
- **퍼블릭 키오스크/게시판**: 간단한 현황판 대체(예: 사내 게시판)

## 핵심 가치

- **단순성**: 필요한 정보만 빠르게 보여주는 집중된 경험
- **신뢰성**: 타입 안전성과 명확한 API 레이어로 예측 가능한 동작
- **확장성**: 도메인 단위 컴포넌트 구조로 기능 확장 용이
- 정적 데이터와 경량 상태 관리로 MVP를 빠르게 검증하고 점진 확장

