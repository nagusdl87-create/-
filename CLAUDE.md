# 마이로드 경남 — 작업 안내 (Claude Code / 개발자 공통)

경상남도 중·고등학생용 진로·학업 설계 웹앱. 대구광역시교육청 플랫폼(dgcareer.vercel.app)의 모든 요소를 참고해 더 나은 방향으로 만드는 프로젝트다.
새 컴퓨터에서 이어 작업할 때는 `docs/DEVELOPMENT.md`, 남은 일은 `docs/ROADMAP.md`, 원본 분석은 `docs/reference/dgcareer-inventory.md`를 본다.

## 명령어

```bash
npm ci                 # 의존성 설치 (Node 22, .nvmrc)
npm run dev            # 개발 서버 http://localhost:3000
npm run validate       # 데이터 교차 검증 (과목·직업·학과·학교 참조)
npm run build          # 정적 내보내기 → out/
npm run deploy         # 빌드 후 Firebase Hosting 배포 (firebase login 필요)
npm run build:schools  # scripts/raw → src/data/gn-schools.json 재생성 (Python 3)
BASE=http://localhost:5000 node scripts/e2e.cjs   # 전체 흐름 브라우저 테스트 (Playwright)
```

변경 후에는 최소 `npm run validate && npm run build`를 통과시킨다. UI를 바꿨다면 e2e도 돌린다.

## 구조와 원칙

- Next.js 15 App Router + TypeScript + Tailwind 3. `output: "export"`로 **완전 정적 사이트** → Firebase Hosting(`firebase.json`, public `out/`, cleanUrls).
  - 서버 기능(API 라우트, 서버 액션, 동적 렌더링, next/image 최적화)을 쓰지 않는다. 동적 경로는 `generateStaticParams`로 미리 생성.
- 상태: `src/lib/store.tsx` 하나의 `AppState`를 localStorage(`myroad:v1`)에 저장. 필드를 추가하면 `initialState`와 `sanitize`를 함께 고친다(구버전 데이터 호환).
- 학교급: `profile.stage` = `"ms" | "hs"`. 여정 단계는 `src/lib/journey.ts`, 진행률은 `src/lib/match.ts`의 `progress`.
- 192학점 진단·자동 채우기: `src/lib/credits.ts` (규칙은 `src/data/subjects.ts`의 `CREDIT_RULES`).
- 데이터 파일: `src/data/` — `subjects.ts`(2022 개정 137과목), `jobs.ts`(51), `majors.ts`(56), `gn.ts`(경남 고입·산업·링크), `gn-schools.json`(203교), `gn-middle.json`(270교).
- 지도: Leaflet + OpenStreetMap 타일(`src/components/SchoolMap.tsx`, 클라이언트 전용 dynamic import).

## 지켜야 할 결정 사항

1. **원본 사이트 데이터를 복사하지 않는다.** 공식 출처(교육부 고시, 경남교육청 고입포털, 공공데이터포털, NEIS, 커리어넷 등)로 직접 구성하고 출처를 주석에 남긴다.
2. **경상남도 특화.** 학교·고입·산업 정보는 경남 기준. 일반 내용은 전국 공통으로 쓴다.
3. **경남교육청 공식 서비스처럼 보이지 않게 한다.** 교육청 로고·명칭을 브랜드로 쓰지 않고, 푸터의 비공식 고지를 유지한다.
4. **학생 개인정보는 서버로 보내지 않는다**(현재). 로그인·동기화를 넣는다면 Firebase Auth/Firestore를 선택 기능으로 추가하고, 미성년자 개인정보 처리 방침을 먼저 정한다.
5. 확실하지 않은 사실(전형 일정, 대학별 권장과목, 기관 연락처)은 지어내지 말고 공식 링크로 안내한다. 연도별로 바뀌는 값(`ADMISSION_SCHEDULE`, `DATA_AS_OF`)은 매년 갱신한다.
6. UI 문구는 중·고등학생 눈높이의 존댓말("~해요")로 쓴다. 접근성: 모달은 `role="dialog"` + Esc 닫기(`useEscape`), 탭은 `role="tab"`, 입력에는 라벨.

## 배포

- `main`에 push → `.github/workflows/firebase-hosting-merge.yml`이 Firebase Hosting(live)에 배포.
- PR → 미리보기 채널 배포 + CI.
- 필요한 설정: 저장소 변수 `FIREBASE_PROJECT_ID`, 시크릿 `FIREBASE_SERVICE_ACCOUNT` (설정 전에는 배포 단계를 건너뜀). 자세한 절차는 `docs/DEVELOPMENT.md`.
