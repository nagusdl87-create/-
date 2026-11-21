# 마이로드 경남 — 중·고등학생 진로·학업 설계 플랫폼

**제작: 삼천포여자중학교 교사 윤용현** · © 2026 윤용현. All rights reserved. (자세한 내용은 [LICENSE](LICENSE))

🌐 **사이트:** https://my-job-c1e50.web.app

경상남도 중·고등학생이 **흥미 탐색 → 직업·학과 → 고교 과목 → 경남 고교 선택 → 192학점 설계 → 2028 대입**을
하나의 흐름으로 설계하는 웹앱입니다. 서버·DB 없이 동작하며 학생 데이터는 브라우저(localStorage)에만 저장됩니다.

> 경상남도교육청의 공식 서비스가 아닙니다. 고교·입학 정보는 공개 자료를 바탕으로 했으며 원서 접수 전 공식 안내를 확인해야 합니다.

## 실행

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
npm run validate     # 과목·직업·학과·학교 데이터 교차 검증
npm run deploy       # Firebase Hosting 배포
```

**배포: Firebase Hosting + GitHub Actions.** 완전 정적 사이트(`out/`)로 빌드되며, `main`에 push하면 자동 배포됩니다.
설정 방법과 다른 컴퓨터에서 이어 작업하는 방법은 [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md), 남은 작업은 [docs/ROADMAP.md](docs/ROADMAP.md)를 보세요.

## 구성

| 구분 | 경로 | 내용 |
|---|---|---|
| 홈 | `/` | 학교급(중/고) 선택 → 단계별 대시보드, 다가오는 경남 고입 일정, 192학점 현황 |
| 나의 설계 (중) | `/discover` → `/jobs` → `/path` → `/highschool` → `/plan` | 흥미 탐색, 직업 찜, 길 잇기, 고교 유형·경남 고입, 학기별 계획 |
| 나의 설계 (고) | `/discover` → `/majors` → `/path` → `/credits` → `/plan` | 흥미 탐색, 학과 찜, 핵심·권장 과목, 192학점 설계, 계획·기록 |
| 탐색 | `/jobs` `/majors` `/subjects` `/schools` `/highschool` `/admission` `/industry` | 직업 51 · 학과 56 · 과목 137(위계도·평가) · 경남 고교 203(지도) · 경남 고입 · 2028 대입 · 경남 산업 진로 지도 |
| 도구 | `/credits` `/admission#calc` `/portfolio` `/tests` `/resources` `/guide` | 192학점 설계·진단, 5등급 내신 계산기, 포트폴리오 3종, 진로검사·상담, 체험·자료, 5장 가이드북 |
| 기타 | `/search` `/report` | 통합 검색(학교·학과명 포함), 한 장 리포트(인쇄·공유 링크·백업) |

## 데이터 출처

- **경남 고교 203곳**: 경상남도교육청 고등학교 입학포털 고교현황(학군·전형·학과별 모집 정원), 공공데이터포털 전국초중등학교위치표준데이터(좌표, 2026-10-01), 교육정보 개방포털 NEIS 학교기본정보(유형·누리집). 원본은 `scripts/raw/`, 생성은 `npm run build:schools`.
- **경남 고입 규칙·일정**: 경남교육청 「2027학년도 고등학교 입학전형」 공통사항·평준화지역 전형·일정 (`src/data/gn.ts`).
- **과목**: 2022 개정 교육과정 고등학교 보통교과, 192학점 이수 기준, 5등급제, 2028 수능 개편 확정안 (`src/data/subjects.ts`).
- **직업·학과·흥미 문항**: 직접 작성한 안내용 데이터. 운영 전 커리어넷 Open API 연동이나 전문가 검수가 필요합니다.

## 원본(대구 플랫폼) 대비 개선점

| 원본의 한계 | 마이로드 경남 |
|---|---|
| 메뉴 10개가 자료 종류별로 나뉜 백과사전형 | 중/고 학교급별 5단계 여정 + 탐색·도구 구분, 앞 단계 결과가 다음 단계로 연결 |
| 검사 결과가 다른 기능과 연결되지 않음 | 흥미·가치관 → 직업 추천 → 학과 → 192학점 ★표시 → 리포트까지 자동 연결, 공식 검사 결과 비교 |
| 시뮬레이터 ⭐가 9개 일반 계열 기준 | 계열 + **찜한 학과의 핵심·권장 과목**을 함께 표시, 계열 자동 채우기(9개 계열 모두 192학점·경고 0) |
| 같은 학기 선수과목, 국영수 81 초과인데 "충족" 출력 | 같은 학기·역순 선수과목, 중복 과목, 81 상한을 모두 경고 |
| 고교 지도는 손그림 SVG, 직업계고 편제 없음 | 실제 지도(Leaflet/OSM), 내 중학교·현재 위치 기준 거리순, 학과별 모집 정원 149개 학과 표시·검색 |
| 내신 계산기 동석차 미처리 | 동석차 반영 석차백분율, 학점 가중 평균 |
| 모달 Esc·포커스·역할 미지원, 404 없음 | 대화상자 role·Esc 닫기, 탭 role, 라벨, 404 페이지 |
| 모든 페이지에서 약 1.7MB JS 로드 | 페이지별 첫 로드 약 103~170KB |

## 구조

```
src/
  app/            페이지 (App Router)
  components/     Nav, SchoolMap(Leaflet), Radar, JobCard, PathFlow, ui, useEscape
  data/           riasec, jobs, majors, subjects, highschools, gn(경남), plan, gn-schools.json, gn-middle.json
  lib/            store(상태·저장·공유), match(추천·진행률), credits(192학점 진단·자동 채우기), journey(메뉴)
scripts/          build-schools.py, validate-data.ts, raw/(수집 원본)
```
