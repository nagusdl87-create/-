# 개발 환경 · 배포 가이드

## 1. 다른 컴퓨터에서 이어 작업하기

### 필요한 프로그램
| 프로그램 | 버전 | 용도 |
|---|---|---|
| Git | 최신 | 코드 내려받기·올리기 |
| Node.js | 22 (최소 20) | 개발 서버·빌드 (`.nvmrc` 참고, nvm 사용 시 `nvm use`) |
| Python 3 | 3.9+ | 경남 학교 데이터 재생성할 때만 |
| Firebase CLI | 14+ | 직접 배포·로컬 미리보기할 때만 (`npm i -g firebase-tools`) |

### 처음 한 번
```bash
git clone https://github.com/<계정>/<저장소>.git myroad
cd myroad
npm ci
npm run dev
```
브라우저에서 http://localhost:3000 을 열면 됩니다.

### 매번 작업할 때
```bash
git pull                 # 다른 컴퓨터에서 한 작업 받기
npm ci                   # package-lock.json이 바뀌었을 때만
npm run dev
# … 작업 …
npm run validate && npm run build
git add -A && git commit -m "작업 내용"
git push                 # main에 push하면 자동 배포
```

> 학생이 입력한 데이터(흥미 탐색 결과, 설계 등)는 각 브라우저에만 저장되므로 Git으로 옮겨지지 않아요. 테스트 데이터를 옮기려면 앱의 **리포트 → 백업 파일 저장/불러오기**를 쓰세요.

### Claude Code로 이어 작업하기
저장소를 열면 `CLAUDE.md`가 자동으로 읽혀 프로젝트 구조와 결정 사항을 알 수 있어요. 시작할 때 “`docs/ROADMAP.md` 보고 다음 작업 이어서 하자”라고 요청하면 됩니다.

## 2. Firebase Hosting 배포

### 2-1. Firebase 프로젝트 만들기 (한 번)
1. https://console.firebase.google.com 에서 **프로젝트 추가** (예: `myroad-gn`). Google Analytics는 꺼도 됩니다.
2. 왼쪽 메뉴 **빌드 → Hosting → 시작하기**를 누릅니다 (CLI 안내 화면은 건너뛰어도 됩니다).
3. 프로젝트 ID를 확인합니다 (프로젝트 설정 → 일반).

### 2-2. 내 컴퓨터에서 직접 배포 (선택)
```bash
npm i -g firebase-tools
firebase login
firebase use --add        # 프로젝트 선택, 별칭은 default
npm run deploy            # = next build && firebase deploy --only hosting
```
배포 후 `https://<프로젝트ID>.web.app` 에서 확인할 수 있어요.

로컬에서 Firebase와 똑같이 미리보기:
```bash
npm run build
firebase emulators:start --only hosting   # http://localhost:5000
```

### 2-3. GitHub push 시 자동 배포 (권장)
`.github/workflows/`에 워크플로가 이미 들어 있어요. GitHub 저장소에 아래 두 가지만 등록하면 됩니다.

**① 서비스 계정 키 만들기**
1. https://console.cloud.google.com/iam-admin/serviceaccounts 에서 Firebase 프로젝트를 선택합니다.
2. **서비스 계정 만들기** → 이름 `github-deploy`.
3. 역할: **Firebase 호스팅 관리자(Firebase Hosting Admin)**, **API 키 뷰어(API Keys Viewer)**, **Cloud Run 뷰어(Cloud Run Viewer)**.
4. 만든 계정 → **키 → 키 추가 → JSON** → 파일이 내려받아집니다. (이 파일은 절대 저장소에 커밋하지 마세요. `.gitignore`에 `service-account*.json`이 들어 있어요.)

**② GitHub 저장소에 등록**
저장소 → **Settings → Secrets and variables → Actions**
- **Secrets** 탭 → New repository secret: 이름 `FIREBASE_SERVICE_ACCOUNT`, 값 = 내려받은 JSON 파일 내용 전체
- **Variables** 탭 → New repository variable: 이름 `FIREBASE_PROJECT_ID`, 값 = 프로젝트 ID

이제 `main`에 push하면 자동으로 빌드·검증·배포되고, Pull Request를 만들면 7일짜리 미리보기 주소가 PR 댓글로 달려요. (변수를 등록하기 전에는 배포 단계만 건너뛰고 CI는 그대로 돌아요.)

> 다른 방법: `firebase init hosting:github` 명령으로 서비스 계정과 시크릿을 자동으로 만들 수도 있어요. 이 경우 시크릿 이름이 `FIREBASE_SERVICE_ACCOUNT_<프로젝트ID>`로 만들어지므로, 워크플로 파일의 `secrets.FIREBASE_SERVICE_ACCOUNT`를 그 이름으로 바꾸고, 워크플로 파일 덮어쓰기는 “No”를 고르세요.

### 2-4. `.firebaserc`
`REPLACE_WITH_FIREBASE_PROJECT_ID`를 실제 프로젝트 ID로 바꾸거나 `firebase use --add`를 실행하세요. (자동 배포는 이 파일 대신 `FIREBASE_PROJECT_ID` 변수를 씁니다.)

## 3. 데이터 갱신

| 데이터 | 파일 | 갱신 시기 |
|---|---|---|
| 경남 고입 일정·규칙 | `src/data/gn.ts` (`ADMISSION_SCHEDULE`, `ADMISSION_RULES`, `DATA_AS_OF`) | 매년 경남교육청 기본계획 발표 후 |
| 경남 고교 목록·학과·정원 | `scripts/raw/*.json` → `npm run build:schools` | 매년 고입포털 고교현황 갱신 후 |
| 과목·평가 규칙 | `src/data/subjects.ts` | 교육과정·대입 제도 변경 시 |
| 직업·학과 | `src/data/jobs.ts`, `src/data/majors.ts` | 수시 |

데이터를 고친 뒤에는 `npm run validate`로 참조 오류(없는 과목명, 없는 직업 id, 없는 학교명)를 확인하세요.

## 4. 테스트
```bash
npm run build
firebase emulators:start --only hosting &      # 또는 npx serve@14.2.4 out -l 5000
BASE=http://localhost:5000 node scripts/e2e.cjs
```
Playwright가 없다면 `npm i -D playwright && npx playwright install chromium`.
