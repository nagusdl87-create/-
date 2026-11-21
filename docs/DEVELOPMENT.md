# 개발 환경 · 배포 가이드

## 1. 다른 컴퓨터에서 이어 작업하기 (Windows 기준)

저장소: https://github.com/nagusdl87-create/- · 사이트: https://my-job-c1e50.web.app
배포는 GitHub Actions가 하므로, 새 컴퓨터에는 **Firebase 설정이나 키가 필요 없어요.** Git·Node.js만 있으면 됩니다.

### 1-1. 프로그램 설치 (컴퓨터마다 한 번)
| 프로그램 | 받는 곳 | 설치 팁 |
|---|---|---|
| Git | https://git-scm.com/download/win | 기본 옵션 그대로 "Next". Git Credential Manager가 함께 설치돼요 |
| Node.js 22 LTS | https://nodejs.org | "LTS" 버전(22.x). 설치 중 "Automatically install the necessary tools"는 체크 안 해도 됨 |
| VS Code (선택) | https://code.visualstudio.com | 코드 편집기 |
| Claude Code (선택) | PowerShell에서 `npm install -g @anthropic-ai/claude-code` | Claude와 함께 작업할 때 |

설치 후 **새 PowerShell 창**을 열고 확인:
```powershell
git --version
node --version   # v22.x.x 이면 OK
npm --version
```

### 1-2. Git 사용자 정보 (컴퓨터마다 한 번)
```powershell
git config --global user.name "내 이름"
git config --global user.email "GitHub에 등록한 이메일"
```

### 1-3. 코드 받기 (컴퓨터마다 한 번)
```powershell
cd $HOME\Documents
git clone https://github.com/nagusdl87-create/-.git myroad
cd myroad
npm ci
npm run dev
```
브라우저에서 http://localhost:3000 이 열리면 성공이에요. 끝낼 때는 PowerShell에서 `Ctrl + C`.

### 1-4. 매일 작업 순서
```powershell
cd $HOME\Documents\myroad
git pull                 # ① 다른 컴퓨터에서 한 작업 먼저 받기 (가장 중요!)
npm ci                   # ② package-lock.json이 바뀐 경우만
npm run dev              # ③ 작업하며 http://localhost:3000 에서 확인
npm run validate         # ④ 데이터 검사
npm run build            # ⑤ 빌드 확인 (오류가 없어야 배포돼요)
git add -A
git commit -m "무엇을 바꿨는지"
git push                 # ⑥ 올리면 1~2분 뒤 사이트에 자동 반영
```
처음 `git push` 할 때 GitHub 로그인 창이 뜨면 브라우저에서 로그인하세요(Git Credential Manager가 기억해요).
배포 결과는 저장소의 **Actions** 탭에서 볼 수 있어요(초록 ✓ = 성공).

> 두 컴퓨터에서 번갈아 작업할 때는 **시작 전 `git pull`, 끝날 때 `git push`**만 지키면 충돌이 거의 없어요.
> 학생이 앱에 입력한 데이터(흥미 탐색 결과, 설계 등)는 브라우저에만 저장되어 Git으로 옮겨지지 않아요. 테스트 데이터는 앱의 **리포트 → 백업 파일 저장/불러오기**로 옮기세요.

### 1-5. Claude와 이어 작업하기
- **내 컴퓨터에서 (Claude Code):** 프로젝트 폴더에서 `claude` 실행 → 처음 한 번 로그인 → “`docs/ROADMAP.md` 보고 다음 작업 이어서 하자”.
  `CLAUDE.md`가 자동으로 읽혀 구조·결정 사항을 알고 시작해요. Claude가 만든 변경도 `git push`해야 다른 컴퓨터와 사이트에 반영돼요.
- **브라우저에서 (claude.ai/code):** 새 세션을 만들 때 저장소 `nagusdl87-create/-`를 선택하면 설치 없이 이어 작업할 수 있어요.

### 1-6. 자주 생기는 문제
| 증상 | 해결 |
|---|---|
| `npm ci` 오류 / `node` 명령을 못 찾음 | Node.js 22 설치 후 PowerShell 창을 새로 열기 |
| `git push`가 거절됨 (rejected) | `git pull --rebase` 후 다시 `git push` |
| 3000번 포트 사용 중 | 다른 창의 개발 서버를 `Ctrl + C`로 끄거나 `npm run dev -- -p 3001` |
| Actions가 빨간 ✗ | Actions 탭에서 실패한 단계 로그 확인 → 보통 `npm run validate`/`build` 오류 (내 컴퓨터에서 같은 명령으로 재현) |
| 화면이 예전 그대로 | 브라우저 강력 새로고침(`Ctrl + F5`) |

### 1-7. 그 밖의 도구 (필요할 때만)
| 프로그램 | 용도 |
|---|---|
| Python 3.9+ | 경남 학교 데이터 재생성(`npm run build:schools`) |
| Firebase CLI (`npm i -g firebase-tools`) | 내 컴퓨터에서 직접 배포·에뮬레이터 미리보기 |
| Playwright (`npm i -D playwright && npx playwright install chromium`) | 전체 흐름 브라우저 테스트 |

## 2. Firebase Hosting 배포

현재 연결된 프로젝트: `my-job-c1e50` → https://my-job-c1e50.web.app (GitHub 저장소 `nagusdl87-create/-`의 `main`에 push하면 자동 배포)

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

### 2-4. 배포 키 교체 (보안상 필요할 때)
1. https://console.cloud.google.com/iam-admin/serviceaccounts?project=my-job-c1e50 → `github-deploy@…` → **키** 탭 → **키 추가 → 새 키 만들기 → JSON**
2. GitHub 저장소 **Settings → Secrets and variables → Actions → `FIREBASE_SERVICE_ACCOUNT` → Update** 에 새 JSON 내용을 붙여 넣기
3. Actions 탭에서 배포가 성공하는지 확인 (아무 커밋이나 push 또는 Deploy 워크플로의 **Run workflow**)
4. 성공하면 키 탭에서 **예전 키 삭제**, 내려받은 JSON 파일도 컴퓨터에서 삭제

### 2-5. `.firebaserc`
`REPLACE_WITH_FIREBASE_PROJECT_ID`를 실제 프로젝트 ID로 바꾸거나 `firebase use --add`를 실행하세요. (자동 배포는 이 파일 대신 `FIREBASE_PROJECT_ID` 변수를 씁니다.)

## 3. 데이터 갱신

| 데이터 | 파일 | 갱신 시기 |
|---|---|---|
| 경남 고입 일정·규칙 | `src/data/gn.ts` (`ADMISSION_SCHEDULE`, `ADMISSION_RULES`, `DATA_AS_OF`) | 매년 경남교육청 기본계획 발표 후 |
| 경남 고교 목록·학과·정원 | `scripts/raw/*.json` → `npm run build:schools` | 매년 고입포털 고교현황 갱신 후 |
| 과목·평가 규칙 | `src/data/subjects.ts` | 교육과정·대입 제도 변경 시 |
| 직업·학과 | `src/data/jobs.ts`, `src/data/majors.ts` | 수시 |

데이터를 고친 뒤에는 `npm run validate`로 참조 오류(없는 과목명, 없는 직업 id, 없는 학교명)를 확인하세요.

## 5. 외부 API 인증키 (선택)

키는 저장소·코드·대화에 넣지 않고 **GitHub 저장소 → Settings → Secrets and variables → Actions → New repository secret**에만 등록한다. 빌드 단계(GitHub Actions)에서 읽어 JSON으로 저장하므로 방문자 브라우저에는 키가 노출되지 않는다.

| Secret 이름 | 발급처 | 용도 |
|---|---|---|
| `CAREERNET_API_KEY` | 커리어넷 Open API 센터(career.go.kr) → 회원 로그인 → 오픈API 신청 → 담당자 승인 → 인증신청현황에서 확인 | 직업·학과 정보 확장 |
| `NEIS_API_KEY` | 나이스 교육정보 개방 포털(open.neis.go.kr) → 회원가입 → 인증키 신청 | 학교 급식·시간표 |
| `YOUTUBE_API_KEY` | Google Cloud Console → 프로젝트 → YouTube Data API v3 사용 설정 → 사용자 인증 정보 → API 키(제한: YouTube Data API v3) | 직업 영상 자동 연결 |
| `DATA_GO_KR_KEY` | 공공데이터포털(data.go.kr) → 데이터 활용신청 → 마이페이지 일반 인증키(Decoding) | 공공데이터 자동 갱신 |

## 4. 테스트
```bash
npm run build
firebase emulators:start --only hosting &      # 또는 npx serve@14.2.4 out -l 5000
BASE=http://localhost:5000 node scripts/e2e.cjs
```
Playwright가 없다면 `npm i -D playwright && npx playwright install chromium`.
