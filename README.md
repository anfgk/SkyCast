## 프로젝트 소개

실시간 도시별 날씨를 빠르게 확인할 수 있는 React + TypeScript 기반의 웹앱입니다. 사전 정의된 도시를 선택하면 현재 기온, 체감온도, 풍속, 습도 등의 핵심 정보를 카드를 통해 즉시 확인할 수 있고, 즐겨찾기로 자주 보는 도시를 손쉽게 관리할 수 있도록 설계했습니다.

## 실행 방법

```bash
npm install
npm run dev
```

## 기술 스택

`Vite` `TypeScript` `React18` `TailwindCSS` `zustand` `axios` `dayjs`

## 기능

- **오픈 소스 api 사용**: https://openweathermap.org/api
- **도시 선택 → 조회**: 기본 도시 목록에서 선택 시 즉시 날씨 요청/표시
- **즐겨찾기**: 카드/대시보드에서 즐겨찾기 토글
- **로딩/에러 처리**: API 상태에 따른 로딩 처리와 try/catch를 활용한 에러 핸들링

## 페이지 구조

- **App 루트** (`src/app/App.tsx`, `src/App.tsx`): 전역 레이아웃 및 라우트 엔트리(단일 페이지)
- **WeatherDashboard** (`src/widgets/WeatherDashboard/ui/WeatherDashboard.tsx`): 도시 선택, API 트리거, 결과 섹션 관리
- **WeatherCard** (`src/entities/Weather/ui/WeatherCard.tsx`): 도시명/아이콘/현재 온도 요약
- **DetailedWeatherCard** (`src/entities/Weather/ui/DetailedWeatherCard.tsx`): 체감온도/풍속/습도 등 상세

## 데이터/로직 개요

- **날씨 API 연동**: `shared/api/weatherApi.ts`에서 데이터 요청/응답 맵핑
- **도시 데이터**: `shared/config/cities.ts`에 기본 도시 목록 정의
- **즐겨찾기 상태**: `shared/store/favoriteStore.ts`에서 추가/삭제/조회 관리
- **UI 컴포넌트**: 요약/상세 카드를 조합해 대시보드에서 단계적 정보 제공

## 접근성/UX 고려

- 일관된 여백/타이포/컬러 시스템(Tailwind 프리셋)으로 가독성 강화
- 모바일 퍼스트 레이아웃과 간결한 카드 베이스 정보 구조

