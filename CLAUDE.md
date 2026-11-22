# 마이로드 경남 — 작업 안내 (Claude Code / 개발자 공통)

경상남도 중·고등학생용 진로·학업 설계 웹앱. 대구광역시교육청 플랫폼(dgcareer.vercel.app)의 모든 요소를 참고해 더 나은 방향으로 만드는 프로젝트다.
자동 작업 에이전트 규칙은 `docs/AGENT.md`, 사용자 결정 요청은 `docs/DECISIONS.md`.
새 컴퓨터에서 이어 작업할 때는 `docs/DEVELOPMENT.md`, 남은 일은 `docs/ROADMAP.md`, 원본 분석은 `docs/reference/dgcareer-inventory.md`를 본다.

## 새 세션을 시작하면 (다른 컴퓨터·새 대화)

이전 대화 기록은 넘어오지 않는다. 맥락은 이 파일과 `docs/`에 있다. 작업 전에:
1. `git pull`로 최신 상태를 받고 `git log --oneline -10`으로 최근 작업을 확인한다.
2. `docs/ROADMAP.md`에서 완료 항목과 "다음 우선순위"를 읽는다.
3. `npm ci && npm run validate && npm run build`로 환경이 정상인지 확인한다.
4. 사용자에게 다음 작업 후보를 짧게 제안하고, 정해지면 진행한다.
5. 작업을 마치면 `docs/ROADMAP.md`를 갱신하고 커밋한 뒤 `main`에 push한다(자동 배포). 사용자가 원하지 않으면 push하지 않는다.

- 저장소: https://github.com/nagusdl87-create/- · 사이트: https://my-job-c1e50.web.app · Firebase 프로젝트: `my-job-c1e50`
- 배포 키(서비스 계정 JSON)는 GitHub Secrets에만 있다. 키 파일을 요청하거나 저장소·대화에 넣지 않는다.
- 사용자는 Windows를 쓴다. 명령 안내는 PowerShell 기준으로 한다.

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
- 학교 편제표: `src/data/curriculum.ts`(형식·예시·공유 코드), 편집기 `/credits/school`. 편제표 모드에서는 `credits.curriculum + picks + extra`로 `credits.plan`을 다시 계산한다.
- 데이터 파일: `src/data/` — `subjects.ts`(2022 개정 290과목), `jobs.ts`(51), `majors.ts`(56), `gn.ts`(경남 고입·산업·링크), `gn-schools.json`(203교), `gn-middle.json`(270교).
- 디자인: 색은 `tailwind.config.ts` 토큰(brand=청록, sun=강조, canvas=배경), 공통 클래스는 `globals.css`(`card`, `btn-*`, `chip`, `eyebrow`, `icon-box`). 아이콘은 `lucide-react`만 쓰고 제목·메뉴에 이모지를 넣지 않는다(직업·산업 등 콘텐츠 이모지는 허용). 원본(대구) 플랫폼과 비슷한 어두운 그라데이션 배너·카드 격자를 피한다.
- 다크 모드: tailwind 색(slate·brand 등)은 CSS 변수(`src/app/theme.css`, `node scripts/gen-theme.cjs`로 생성)라 `html.dark`에서 자동으로 바뀐다. 새 색 계열을 쓰면 `tailwind.config.ts`의 `FAMILIES`와 생성 스크립트에 추가. 흰 글씨 버튼은 `bg-accent`, 카드 면은 `bg-surface`. 바꾼 뒤 밝게·어둡게 모두 접근성 검사.
- 지도: 카카오맵(`src/components/KakaoSchoolMap.tsx`, 키 `src/lib/site.ts`) 우선, 실패 시 Leaflet + OpenStreetMap(`SchoolMap.tsx`) 자동 대체.
- 홈·메뉴 숫자: `src/data/stats.ts` 한곳에서 관리, `npm run check:stats`로 매일 점검.
- 직업·학과 상세: `src/data/deep/`(형식 `types.ts`), 기준 `docs/content-standard.md`. 페이지(`page.tsx`, 서버)에서 해당 항목만 골라 넘긴다(전체를 화면 코드에 싣지 않기). 새 직업·학과(커리어넷 포함)는 기준의 모든 항목을 채워야 `npm run validate` 통과.

## 지켜야 할 결정 사항

0. **제작자 표기 유지.** 제작자는 삼천포여자중학교 교사 윤용현이다. 홈의 `CreditCard`, 모든 페이지 푸터의 `CreditLine`(`src/components/Credit.tsx`), `LICENSE`의 저작권 표기를 지우거나 바꾸지 않는다.

1. **원본 사이트 데이터를 복사하지 않는다.** 공식 출처(교육부 고시, 경남교육청 고입포털, 공공데이터포털, NEIS, 커리어넷 등)로 직접 구성하고 출처를 주석에 남긴다.
2. **경상남도 특화.** 학교·고입·산업 정보는 경남 기준. 일반 내용은 전국 공통으로 쓴다.
3. **경남교육청 공식 서비스처럼 보이지 않게 한다.** 교육청 로고·명칭을 브랜드로 쓰지 않고, 푸터의 비공식 고지를 유지한다.
4. **로그인은 선택 기능이다**(결정 D1=B). 로그인하지 않으면 지금처럼 기기에만 저장하고 서버로 보내지 않는다. 로그인 시에만 Firebase Auth(구글) + Firestore에 본인 기록을 저장하며, 보안 규칙은 본인 문서만 허용. 개인정보 처리 방침(`/privacy`)을 사용자가 확인·게시하기 전에는 로그인 버튼을 공개하지 않는다.
5. 확실하지 않은 사실(전형 일정, 대학별 권장과목, 기관 연락처)은 지어내지 말고 공식 링크로 안내한다. 연도별로 바뀌는 값(`ADMISSION_SCHEDULE`, `DATA_AS_OF`)은 매년 갱신한다.
6. UI 문구는 중·고등학생 눈높이의 존댓말("~해요")로 쓴다. 접근성: 모달은 `role="dialog"` + Esc 닫기(`useEscape`), 탭은 `role="tab"`, 입력에는 라벨.

## 배포

- `main`에 push → `.github/workflows/firebase-hosting-merge.yml`이 Firebase Hosting(live)에 배포.
- PR → 미리보기 채널 배포 + CI.
- 필요한 설정: 저장소 변수 `FIREBASE_PROJECT_ID`, 시크릿 `FIREBASE_SERVICE_ACCOUNT` (설정 전에는 배포 단계를 건너뜀). 자세한 절차는 `docs/DEVELOPMENT.md`.
