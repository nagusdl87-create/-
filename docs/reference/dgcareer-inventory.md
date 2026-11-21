> 원본 플랫폼(dgcareer.vercel.app) 기능 분석 기록 (2026-11-21). 새 기능을 만들 때 비교 기준으로 사용합니다.

# dgcareer.vercel.app: Feature Inventory (대구광역시교육청 진로·학업설계 플랫폼)

Audit date 2026-11-21. Every page was driven with Playwright at 1280x900 (plus 390x844 mobile). Only local inputs were filled (localStorage); nothing was submitted to the site. Raw captures were temporary; selected screenshots are kept in `docs/reference/screenshots/`.

---

## 0. Architecture, data sources and volumes

**Stack**
- Vite + React SPA with framer-motion and Tailwind, hosted on Vercel. All routes are served client-side.
- Font: Pretendard from jsDelivr.
- `robots.txt: Disallow: /` plus `noindex,nofollow`, so search engines cannot find the site.
- Unknown routes return HTTP 200 and render the home page. There is no 404 page.
- Hidden or alias routes:
  - `/planner` goes to portfolio
  - `/recommendations` goes to admission-2028, 권장이수과목 tab
  - `/guide` goes to the 고교학점제 안내 tab of school-credit
  - `/standards` and `/credit-standards` go to the 192학점 기준표
  - Underscore variants such as `/career_design` also work
  - Search deep link: `/recommendations?q=서울대학교`

**Bundles.** Every page loads these up front (raw size / brotli):

| file | raw | br |
|---|---|---|
| `index-*.js` (app code) | 1.45 MB | 318 KB |
| `app-data-*.js` (embedded datasets) | **7.5 MB** | **1.24 MB** |
| `vendor-react` | 268 KB | 80 KB |
| `kcueMajorIndex-*.js` (lazy, majors) | 474 KB | 99 KB |
| css | 270 KB | 29 KB |

- `cache-control: public, max-age=0, must-revalidate` is set even on hashed assets, so they are never cached as immutable.
- Even a static text page downloads about 1.7 MB of brotli JS.

**Data embedded in `app-data` JS.** Counts come from static analysis of the bundle.

| Dataset | Volume | Notes |
|---|---|---|
| 2022 개정 subjects | **227** (국어11, 영어13, 수학18, 사회23, 과학28, 기가/정보12, 체육·예술77, 제2외/한문35, 교양10) | Fields: id, name, group, type, credits, desc, coreConcepts, keyTopics, followUpSubjects, relatedFields, relatedJobs, video |
| Majors (학과) | **400** in the UI (323 `dept_5xx` + 27 `dept_add` + others) | Fields: name, category, summary, desc, mainCurriculum, coreRecommendedSubjects, recommendedSubjects, highSchoolSubjects{general,career,convergence}, similarDepartments, certifications, relatedJobs, topUniversities |
| University recommended subjects (권장이수) | **162 entries / 32 universities** | Fields: uniName, college, deptName, coreSubjects, recSubjects, note |
| 계열별 반영과목 matrix | 7 계열, 40 majors, 35 universities | |
| Promising jobs | **80** | Fields: id, category, 전망, desc, competencies, HS subjects, related majors |
| Job dictionary | **500** (about 528 `job_nm`) | Subjects and majors for these are "inferred" by category |
| Professor interviews | 315 (180 linked to majors + 135 "기타") | Q&A pulled live from CareerNet |
| Job-person media | Claimed 1,009 videos / 1,091 interviews; arclSer refs about 1.7k; 241 interview ids; 145 + 80 "분류 외" | |
| High schools (map) | **97** (중4, 동11, 서6, 남7, 북17, 수성17, 달서24, 달성10, 군위1) | NEIS school codes, schoolinfo UUIDs, homepages, features, 남녀공학 |
| Bus/subway data for commute | embedded | |
| `kcueMajorIndex` (lazy) | **238 universities, 10,821 major rows** | 대교협 2025 공시; used for "개설 대학" |

**Static JSON** (fetched on demand)
- `/curricula/index.json`: **72 schools** with curriculum. The home card says "69개 고교", which does not match.
  - Per-school file `/curricula/{id}.json` holds `{tracks, grandTotal, fixed[] (n,t,a,slots[track,term,alt,c]), blocks[] (group, term, pick, credits, alt, tracks, opts[]), activities (창체 credits per term), notes}`.
  - kind: 일반고 42, 중점학교 20, 교과특성화 7, 특목고 3. 8 schools run IB. 26 distinct track labels (일반, IB, AI중심, 과학, 미술, 음악, 의료·보건…).
  - 25 of the 97 mapped schools (특성화/마이스터 etc.) have no simulator data.
- `/admission2028_susi.json` (3.0 MB raw / 397 KB br): **28,676 수시 rows**, 19 cols, string-table compressed `{cols,t,r}`. The UI says "대학 233곳 · 전형 2,594개 · 모집인원 277,554명".
- `/admission2028_jeongsi.json` (1.8 MB): **9,530 정시 rows**, 40 cols (수능 반영비율, 탐구 반영, 영어·한국사 환산, 1단계 비율 …).
- `/university_master_map.json`: **214 universities**, each with 시행계획 PDF (Google Drive links), 학종안내, 전공안내 and 입학처 URLs.
- The code also tries `/data/...json` paths first. Several of these return the SPA HTML instead of 404.

**Live APIs** (Vercel serverless proxies, no auth, no DB)
- `/api/careernet/proxy?svcCode=JOB|JOB_VIEW|MAJOR`: CareerNet open API, used for the 500-job search fallback and the university list.
- `/api/careernet/interview-detail?seq=&listT=`: professor and job-person interview Q&A.
- `/api/careernet/mentoring-video?arclSer=`: mentor video URL. Playback failed in headless Chromium ("영상 재생 중 오류").
- `/api/work24/proxy?apiType=jobDicApi.do`: 고용24 job dictionary (XML) fallback.
- `/api/naver/geocode|reverse|local-search`: address to coordinates for the commute tool, with a quota-exceeded fallback flag in localStorage.
- `/api/neis/meal`, `/api/neis/timetable`: live weekly school lunch and timetable.
- `/api/schoolinfo/school?district=&schoolName=`: 학교알리미 figures (students, teachers, founding date, phone, address).
- External iframes and links: YouTube (subject videos), career.go.kr counsel list iframe, ggoomgil iframe, mentoring.career.go.kr thumbnails.

**User data.** There are no accounts and no server persistence. Data lives in localStorage:
- `dg-academic-plan-v1`: credit simulator and planner
- `dg_career_activity_portfolio_data`: activity portfolio
- `dg-reading-career-portfolio-v1`: reading portfolio
- `naver_map_quota_exceeded_until`

The portfolio "저장 / 이어쓰기" modal offers three things:
- download a backup file (`.dgcareer` / `.json`)
- restore it by file upload ("1초 복원")
- "이어쓰기 링크 복사", which base64-encodes the JSON into a URL for pasting into email or a class board

No analytics or tag manager was found.

---

## 1. Global / cross-cutting UI

**Navigation and layout**
- Sticky dark header with logo and 10 nav items. Two items have a neon outline highlight (고교별 학점 설계, 진로체험·진로자료).
- On mobile the nav collapses to a "메뉴" drawer with a 닫기 button.
- Footer links: 대구광역시교육청, 대구진학진로정보센터, 대구고교학점제 지원센터, 커리어넷, 임금직업포털, 에듀넷. Copyright © 2026 DMOE.
- Floating "맨 위로" button. Many sections have their own "맨 위로" and "…확인 완료" end markers.

**Home `/`**
- Hero: "질문이 진로가 되는 대구 진로교육". Unified search box ("과목, 학과, 직업 검색 (예: 컴퓨터, 미적분, 로봇)") with 8 popular chips: #컴퓨터공학과, #미적분Ⅱ, #의예과, #인공지능 수학, #로봇공학자, #생명과학, #경영학, #서울대 권장과목.
- Search runs live as you type and also on submit. Results open in an overlay "통합 검색 결과" with category tabs: 전체 / 🎓 대학 학과 / 📚 교과목 / 💼 직업 백과 / 🏫 권장이수.
  - Each category shows 4 cards plus "전체보기 (n) →", which deep-links to the page with `?q=`.
  - Card fields: 학과 = name, 계열, summary, 핵심 권장. 과목 = name, 교과, 유형, desc, 학점·평가. 직업 = name, field, desc. 권장이수 = university, unit, 핵심/권장.

  | Query | Total | Breakdown |
  |---|---|---|
  | 컴퓨터 | 25 | 학과 9, 과목 0, 직업 5, 권장 11 |
  | 미적분 | 128 | 과목 3, 권장 125 |
  | 간호 | 7 | |
  | 로봇 (typed) | 19 | |
  | 대구과학고 | 0 | Schools, tests and admissions data are not indexed |

- Nine menu cards, each with a feature tagline.
- "학생 맞춤형 이용 순서" 3 steps: 진로&전공 탐색 → 과목&권장과목 매칭 → 학점 시뮬레이션. The buttons go to /majors, /recommendations and /planner.
- "인기 학과별 필수 권장과목" with 6 sample majors.
- "192학점 졸업 요건" summary cards: 192 = 교과174 + 창체18; 국영수 상한 81; 필수 84; 학기당 28+. Short note on the 5등급제.

**Screenshots:** `home_search_컴퓨터.png`, `home_typeahead.png`

---

## 2. `/career-design`: 대구 진로·학업설계 E-Book

**Frame**
- Collapsible intro banner, progress bar (20/40/60/80/100%) and font size toggle (보통 A / 크게 A+).
- "E-Book 전체 목차" card grid for chapters 1-5, with states 현재 읽는 중 / 본문 읽기.
- Prev/next chapter buttons and a floating "목차(1~5장) 이동" button.

**Ch.1 진로·학업설계란? (개념과 3대 핵심 원리)**
- 3-column comparison:
  - CAREER EXPLORATION (나의 꿈과 진로 탐색)
  - CAREER-ACADEMIC DESIGN (핵심): 편제표-based 192학점 plan, backward mapping, 세특 탐구, Plan B
  - COLLEGE ADMISSION
  - Each column has activities and a "성장 포인트".
- 3 principles, each with 실천 & 응원 포인트:
  - 원리1 "진로 가설" (verb-type questions, not job titles)
  - 원리2 "학생 주도성" (Career Narrative)
  - 원리3 "회복탄력성 (Plan B)"

**Ch.2 대구 5단계 실천 로드맵 (질문이 진로가 되는 길)**

The five steps:

| Step | Name | Sub-title |
|---|---|---|
| 1단계 | 진로 탐색 (나를 알고 진로 가설 세우기) | 질문으로 여는 나의 진로 |
| 2단계 | 과목 탐색 (희망 전공과 고교 과목 연결) | 희망 전공과 고교 교과의 만남 |
| 3단계 | 시간표 설계 (192학점 나만의 학업계획) | 192학점 나만의 시간표 구축 |
| 4단계 | 깊이 있는 배움 (수업 속 질문과 세특 탐구) | 질문 중심 세특 탐구와 성취 관리 |
| 5단계 | 진로 재설계 (유연한 성장과 Plan B) | 유연한 회복과 Plan B 구축 |

- Each step's detail panel has: 핵심 배움 목표, 학생 실천 활동 (numbered), 나에게 던지는 진로 질문, 선생님의 지도와 조언, 학부모님의 따뜻한 응원, 산출물. For example, step 1's 산출물 is "자기이해 프로파일 & 1차 진로 탐구 가설서".
- Step navigation: "← 이전 단계 / 다음 N단계 읽기".

**Ch.3 학년별 성장 & 학교생활 (중·고 연계 4단계 성장 로드맵)**
- 전환기 (중3 2학기~입학 전): 교육과정 문해력, 계통 이해
- 1단계 고1: 자기이해·탐색, 공통과목, 검사, 편제표 초안
- 2단계 고2: 심화·실행, 위계 (대수→미적분Ⅰ→미적분Ⅱ), 세특
- 3단계 고3: 탐구·확장, 융합선택, 포트폴리오
- Each stage has 핵심 활동 and a 💡꿀팁.
- 창체 section: 자율·자치 / 동아리 / 진로, each with a "❌ 아쉬운 활동 기록" vs "돋보이는 활동 기록" example and a 핵심 차별점.

**Ch.4 나만의 과목 설계법 (거꾸로 설계 Backward Design)**
- 5 clickable steps:
  - Step01 목적지 정의 (가치 중심)
  - Step02 전공 커리큘럼 분석
  - Step03 요구역량 확인 (대학 권장이수과목 대조)
  - Step04 개설 현황 매핑 (우리 학교 편제표)
  - Step05 192학점 로드맵 확정 (대안 설계)
- Each step has 핵심 질문, 실천 가이드 and 💡 사례.
- Explains the 3 선택과목군: 일반선택 / 진로선택 (5등급+성취도) / 융합선택 (국영수 5등급 + 성취도; 사회·과학·체육·예술 성취도만).

**Ch.5 꿈이 바뀌었을 때 (Plan B)**
- "5대 진로 변경 유형별 재설계 매트릭스". Each type has 대표 사례, BRIDGE STORY 전략 and a 3-item 생활기록부/재설계 guide.

  | Type | 대표 사례 |
  |---|---|
  | 유형1 유사 계열 내 변경 | 의학→생명과학연구, 컴공→AI데이터 |
  | 유형2 다른 계열로 변경 | 공학→예술연출/경영, 인문→SW |
  | 유형3 학교 전출 및 유형 변경 | 외고/자사고→일반고, 일반고→특성화고 |
  | 유형4 진학-취업 방향 변경 | |
  | 유형5 학업 중단 위기 극복 | Wee 클래스, 대안교실, 작은 성공 |

- GROW 진로 대화 모델 (Goal / Reality / Options / Will) tabs, each with 3 conversation questions for home or classroom.

The E-Book is static text. There are no quizzes, worksheets or links into the tools.

**Screenshots:** `cd_ch1.png` … `cd_ch5.png` (full page)

---

## 3. `/highschool`: 고교 선택 가이드

**Header**
- External links: 고입정보포털 (hischool.go.kr), 하이파이브 (hifive.go.kr).
- 3 tabs: 대구 고교 지도 탐색 / 고입 전형 체계 / 고교 유형별 심층 분석.

**Map tech**
- No Kakao, Leaflet or Naver map SDK. The map is a **hand-drawn SVG schematic per 구·군** ("실제 지형도: 도로망·도시철도·신천 및 하천 기반").
- Toggles: "현실 도시맵" / "거점역". Map controls: 지도 접기, 크게.
- District chips with counts plus 전체 모아보기 (97). Pins are color-coded by type (일반고 / 자율고 / 특목고 / 마이스터 / 특성화).
- Naver geocoding is used only for the commute origin address.

**School detail panel** (shown on the right)
- Type badge, e.g. 일반고(IB 운영학교), 국립/사립, 공학, 구.
- 주요 특색 교육과정 및 강점 chips (IB 운영, 중점, 학과 list for 특성화).
- 학교알리미 주요정보 (live, "2026 공시 기준"): 학생수 (남/여), 교원수, 설립일자, 대표 전화, 도로명 주소.
- CTA: 스마트 통학길 조회하기.
- Buttons: 학교알리미 상세보기 (external), 학교 공식 홈페이지, 학교급식 (NEIS week view with kcal, menu and allergen numbers, plus 알레르기 안내 expand), 학교시간표 (NEIS, 학년/반 selectors, this week).
- Link "이 학교 2027 기준 고교학점설계 바로가기", which goes to `/school-credit?school={id}`.

**School list**
- District select and name search.
- Cards show type, 구, 성별 and "학교정보 · 길찾기".
- Second list with keyword search ("학교명, 프로그램(과학중점, IB), 주소").
- Filters:
  - 유형: 전체 / 일반고 / 자율고(자공고/자사고) / 특목고(과고/외고/국제고/예체) / 마이스터고 / 특성화고 / 영재학교
  - 성별: 전체 / 남녀공학 / 남고 / 여고

**스마트 통학길 mechanics**
- Origin: text input (default "대구 수성구 범어동"), "내 위치" (geolocation) and 8 quick neighbourhoods (범어동, 상인동, 칠곡, 반월당, 율하동, 평리동, 봉덕동, 다사읍). Destination: school select. Badge: "학생 참고용이며 배정과는 무관".
- Origin is geocoded via `/api/naver/geocode`, then local-search, then fallback. Routes are computed **client-side** from embedded subway and bus data. No live transit API is used.
- 3 mode tabs with ranges:
  - **대중교통**: subway route ("범어역(2호선) → 경대병원역(2호선) · 환승 없음", 17~21분), a segmented bar (도보/대기/지하철/도보), and "단계별 안내" (First-mile walk m/min, exit numbers, 승차역 direction, 하차역, Last-mile). Step "3" is missing in the numbering.
  - **시내버스 추천 노선**: real route numbers with board/alight stops, walk minutes, stop count, 배차 간격, a 💡 best-route tip, and links to Kakao bus search.
  - **도보**: distance km, steps, kcal and a verdict ("다소 멈 (대중교통 권장)").
  - **승용차**: time range.
- Deep links: "카카오맵 길찾기", "네이버 지도 길찾기" (Google and OSM URLs are also built). There is special handling for KakaoTalk's in-app browser.

**고입 전형 체계 tab**
- 3 필수 원칙 (전기고 1개교만; 전기 합격 시 후기 지원 불가; 자사고·외고·국제고 지원자의 일반고 동시지원).
- 전기 고등학교 (5~11월 전형):
  - 영재학교: 대구과학고
  - 특수목적고: 대구일과학고, 마이스터 5교, 경북예고, 대구체고
  - 특성화고: 대구공고 외 14교, 대안 특성화 달구벌고
  - 각종학교: 해올고
- 후기 고등학교 (12~1월): 일반고·자공고2.0 (선지원 후추첨), 자사고 (전국/광역 계성고), 외고·국제고.
- "실패 없는 고등학교 선택 3단계 로드맵": 적성 분석 → 학교별 교육과정 확인 → 통학거리 (40~50분 이상 피로 경고).

**고교 유형별 심층 분석 tab**
- Filter: 전체 / 전기 / 후기.
- 6 types: 과학고/영재학교, 마이스터고, 특성화고, 일반고, 외고/국제고, 자사고.
- Each type has: tagline, 개요, 주요 특장점 (4), 추천 학생상, 지원 전 유의사항 (e.g. 과학고 의약계열 진학 시 교육비 환수), 시그니처 교육과정, 대입·진로 전략.

**Screenshots:** `hs_01_initial.png`, `hs_05_location.png`, `hs_map_all.png`, `hs_03_meal.png`, `hs_04_timetable.png`, `hs_06_walk.png`, `hs_tab_고입전형체계.png`, `hs_tab_고교유형별심층분석.png`

---

## 4. `/subjects`: 2022 개정 과목 선택 백과

There are three tabs.

**Tab 1: 과목 위계도 & 계통도 Map**
- 9 교과군 buttons with counts (total 227).
- Each 교과군 shows a 계통도 headline and a 3-stage column layout:
  - 1단계 (1학년) 공통과목 (기초, 필수 이수)
  - 2단계 일반선택 (기본소양, 수능/내신)
  - 3단계 진로선택 (전공심화)
  - Plus 융합선택
- **Card fields**: name, badges (수능출제과목, 소개 영상), 기본 학점, 선수 과목, one-line content, 평가 (5등급+성취도 / 성취도만 / P), "상세".
- **Detail modal fields**:
  - 교과군, 유형, 기본 학점 (range, e.g. 3~5학점), name, description
  - 공식 과목소개 영상 (YouTube, "[진로학업설계] NN. …" series by 진로학업설계컨설팅 교과 전문교사진)
  - 성취평가 & 내신 (e.g. 5등급제+성취도; 기재: 원점수·과목평균·성취도·수강자수)
  - 2028 수능 출제 여부 (출제/미출제 plus explanation)
  - 이수 위계 / 선수 이수 권장 과목
  - 성취기준 키워드 hashtags and 단원별 핵심 개념 list
  - 연계 추천 대학 전공, 연계 진출 직업군
  - 진로·학업설계 탐구 연계 팁 (세특 가이드, 3 bullets)
- **Video modal**: "No.N" plus title, YouTube iframe, a templated "3줄 서머리" (shows grammar glitches such as "대수은(는)"), related majors, and "과목 정보 전체보기".

**Tab 2: 내신성적 산출 방법**

Section nav: 전체 보기 / 시뮬레이터 / 1~4.

- **Real-time 5등급 simulator.** Inputs:
  - 과목 유형 select (5 types: 공통, 일반·진로선택, 사회·과학 융합선택 9과목, 체육·예술·과탐실험 ABC, 교양 P)
  - 수강자 수 slider (10~400, step 5)
  - 석차 (number) with "상위 x%" display
  - 원점수, 과목평균
- Outputs:
  - 5등급, 성취도 (A~E)
  - Old 9등급 equivalent and "등급 완화 효과" text
  - 학생부 기재 preview row (원점수/평균, 성취도(수강자수), 분포비율 A~E, 석차등급)
  - Cutoff table for the chosen cohort (1등급 20등까지 …)
- Boundary tests were correct: 20/200 is 1등급, 21/200 is 2등급, 68 is 2등급, 69 is 3등급.
- Limitations: ties (동석차) and the ≤5-student rule are not simulated, and the 분포비율 shown is synthetic.
- Static sections:
  1. 9등급 vs 5등급 table with 200-person counts
  2. 성취도 기준: A~E 90/80/70/60; ABC 80/60; P
  3. 성적표 기재 변화, with old and new example tables (표준편차 removed, 분포비율 added)
  4. 교과별 제공 매트릭스: 공통 / 선택 / 사회·과학 융합 9과목 (listed) / 체육·예술·과탐실험 / 교양 / 전문교과; special cases ≤5명 소인수 and 공동교육과정·온라인학교
- "2028 대입 3대 전략 포인트".

**Tab 3: 192학점 이수 기준표**
- 카드형 (모바일추천) / 표 전체보기 toggle.
- Structure: 필수84 + 자율90 + 창체18 (288시간).
- Full 교과 영역 table (국/수/영 8 each; 사회 14 incl. 한국사 6; 과학 10 incl. 과탐실험; 체육 10; 예술 10; 생활·교양 16) with ±1 증감 rules.
- 국영수 81 cap explanation (174×50% − 한국사6). 최소 성취수준 보장지도 (40%, 출석 2/3).

**Screenshots:** `subj_math.png`, `subj_detail_modal.png`, `subj_video.png`, `subj_tab_내신성적산출방법.png`, `subj_tab_192학점이수기준표.png`

---

## 5. `/school-credit`: 고교별 학점 설계 simulator (core tool)

**Tabs:** 고교별 학점 설계 / 192학점 이수 기준표 (same as subjects tab 3) / 고교학점제 안내.

고교학점제 안내 sections:
1. 고교학점제란?
2. 도입 배경 및 기대효과
3. 7단계 운영 절차
4. 192학점과 졸업
5. 평가
6. 대구 특화 & 공동교육
7. FAQ

It also has links to 종합지원센터 and the 대구 지원센터, and a 기존 vs 변화 comparison.

**Header and notices**
- Buttons: 임시저장, 인쇄/PDF출력.
- Badges: "학교별 교육과정 연동", "2027 편제표 직접 매칭".
- 3 disclaimers: curriculum may change; recommendations are generic; consult a teacher.

**Flow**
1. **구·군 chips** with counts (중3 동6 서5 남3 북15 수성14 달서17 달성8 군위1 = 72), then the school list. Each card shows 유형, 특성화/중점, "IB과정 선택 가능" and track names. A URL param `?school=id` preselects a school.
2. **School summary card**: 총 이수, 학교지정 N과목(학점), 학생선택 학점, 창체 18. Example 경신고: 192 = 지정 24과목 60학점 + 선택 114 + 창체 18.
   - Multi-track schools show a "과정 선택" card. For example 대구중앙고 has 일반 194 / AI중심 194 / IB 192, each with its own 지정/선택 counts, and selections are stored separately per track.
   - Button "학교 다시 고르기".
3. **계열 selection (⭐ recommendation):** 인문, 사회과학, 상경, 자연, 공학(1) AI·SW, 공학(2) 전자·반도체·기계, 의약학·보건, 예체능, 기타 직접 구성. There is a 계열 선택 해제 button.
   - Once a 계열 is chosen, each semester card shows "N학기 선택과목 군 (k과목 택)" with "⭐ {계열} 추천과목 부각".
   - Example ⭐ for 공학(1): 미적분Ⅰ, 미적분Ⅱ, 물리학, 정보, 기하, 역학과 에너지, 인공지능 기초, 창의융합 과제연구, 고급 물리학.
   - "기타" still shows the "⭐ 기타 추천과목 부각" label but stars nothing.
4. **Six semester cards (1-1 … 3-2).** Each card has:
   - "편성과목: N학점" counter
   - **Selection groups**: "선택군k · m과목 선택 (x학점)", a live "선택 a / m" counter, and option chips showing name, credits and 교과 or ⭐추천
   - Groups can span semesters. A subject already chosen in another semester shows **"중복불가"** and is disabled.
   - The pick cap is enforced: an extra click is ignored and the counter stays at m/m. There is no toast or feedback.
   - **Locked school subjects**: rows with "🔒 지정", optional "고정" badge, 교과·유형 and 학점.
   - **"+ 소인수과목&공동교육과정" select** (1-2 onward) with 6 slots: 🤝 [1~3순위] 공동교육과정 직접 입력 and 🔍 [1~3순위] 소인수과목 직접 입력. Choosing one opens a free-text input ("예: 고급 생명과학, 인공지능 윤리 등").
   - With no school selected, a generic national template appears with **−/+ credit adjusters** (±1) on adjustable subjects.

**Live validator panel ("고교학점제 실시간 검증 · 3개년 192학점 진단기", sticky right column)**
- 총 취득 학점 x / 192, a badge "N학점 설계" (actually means remaining credits), and "교과 n + 창체 18(고정)".
- 필수 이수학점 검증: tiles for 체육 (incl. "매학기 편성" check), 예술, 생활·교양 (16), 기초 국/수/영 ≥8 each, plus a bullet list of shortfalls.
- 국·영·수 이수 상한: x / 81, per-subject breakdown, and on overflow "상한 초과 (+9학점) … 총 9학점을 줄이셔야".
- 선수과목 위계성: e.g. "[2학년 1학기] 미적분Ⅱ → '미적분Ⅰ' 선이수 필요". This flags same-semester and out-of-order picks.
- 대학 권장이수과목 점검: ✓ or 미이수 per 계열 list (공학1: 미적분Ⅱ, 기하, 정보, 인공지능 수학). It flags subjects the school does not offer and gives no alternative.
- 영역별 이수 학점 분포: stacked bar by 교과.

**Walkthrough (경신고 + 공학계열(1), all groups filled)**
- 1-1 and 1-2: 27 학점 locked + 선택군1 (일본어/중국어/심화…, 택1).
- 2-1: 선택군2 (택3, 4학점 options incl. ⭐미적분Ⅰ/Ⅱ) + 선택군3 (택6, 3학점 incl. ⭐물리학/⭐정보) + 🔒스포츠 문화.
- 2-2: 선택군2 + 선택군4 (⭐기하, ⭐역학과 에너지, ⭐인공지능 기초, ⭐창의융합 과제연구 …).
- 3-1: 선택군2 (택2) + 선택군5 (택6, incl. ⭐고급 물리학).
- 3-2: 선택군2 (택1) + 선택군6 (택6).
- Result: 192/192, but the 국영수 cap was exceeded (90/81), 생활·교양 was 15/16 and there were 3 위계 violations. The header says "필수조건 점검필요" while the print says "✓ 192학점 졸업 요건 충족", which is inconsistent.

**임시저장**
- Writes `dg-academic-plan-v1` and shows a toast ("'경신고등학교' 학점 설계 내용이 브라우저에 임시 저장되었습니다").
- State survives reload.

**인쇄/PDF출력** (`window.print`, dedicated print layout "2027년 기준 {학교} 고교학점 설계서")
- Info table: 학교명, 지역/구분, 적용 교육과정, 학교 기준 학점, 참고 희망계열.
- 192학점 진단 (총, 교과, 창체, 국영수 상한, 선택과목 설계수).
- 6 semester lists, with 🔒 for school-designated subjects.
- 선수과목 위계성 점검 안내 and a disclaimer.

**Planner context.** This page is also step 3 of the 진로·학업설계 portfolio. Bottom buttons "이전 단계 / 다음 단계 (4단계 자기성찰 & 메모)" appear even when the page is opened standalone.

**Screenshots:** `sc_00_fresh.png`, `sc_01_school_track.png`, `sc_07_semester_groups.png`, `sc_08_validator.png`, `sc_02_filled.png`, `sc_06_multitrack.png`, `sc_05_printmedia.png`, `sc_print.pdf`, `mobile_school-credit.png`

---

## 6. `/majors`: 전국 대학 학과 & 권장이수과목

**Search and filters**
- Search box ("전국 학과명, 키워드 검색") with 11 tag chips: #컴퓨터 #반도체 #인공지능 #의예 #간호 #경영 #미디어 #로봇 #화학 #심리 #사범. Keyword search is fuzzy: "반도체" returns 7, including 물리학과 and 전기전자공학과.
- Link "대학 권장이수과목 상세 안내 바로가기".
- 계열 filter: 전체 400 / 공학 96 / 자연 53 / 의약·보건 31 / 인문 50 / 사회 74 / 교육·사범 36 / 예체능 60 / "기타 교수님의 전공소개 135건". The 135 are interview-only cards: major, professor, university/college.
- Buttons: "필터 초기화", "데이터 동기화" (re-fetches; no visible change), "학과 더보기 (36 / 400개 표시 중)" (paged by 36).

**Card fields:** 계열, name, summary, 2022 핵심 권장이수과목 (3 chips), 교수님의 전공소개 (name) 인터뷰 보기, "개설 대학 · 경북대, 영남대, 경희대 외 62곳", 상세보기.

**Detail modal fields**
- 학과 개요 & 소개
- 2022 핵심 권장이수과목 (e.g. 물리학, 미적분Ⅰ, 미적분Ⅱ, 기하)
- 2022 일반 권장이수과목
- 대학 입학 후 주요 전공 교과목 (curriculum)
- 졸업 후 주요 진출 직업군
- 교수님의 전공소개: list with professor, date (e.g. 2013년 10월), university/dept, "정보창에서 Q&A 열기"
- 개설 대학 ("대교협 2025정보공시 기준"):
  - 대구·경북 N chips
  - 주요 대학 (규모순); a "·과목" mark means that university has 권장 data
  - "전국 65곳 모두 보기" (expands with "+47개 더 보기", "요약으로 보기")
  - "이름이 다른 유사 학과 N곳" (e.g. 동양대 스마트기계공학과)
- "대학별 권장이수과목 N건" expands per-university cards. Example 경북대 공과대학: 핵심 물리학·미적분Ⅱ, 권장 기하·역학과 에너지·화학, plus a note. Also covers 부산대, 성균관대, 서울대 (유형2), 한양대, 아주대.
- 관련·유사 학과.

**Professor interview modal** (stacks on top of the detail modal)
- Header: "교수진 전공소개 목록 (n편)", professor, university, "Q&A 12문항".
- Full Q&A text (Q01-Q12) loaded live from `/api/careernet/interview-detail`, with an 출처 line.
- Repeats the 학과 상세 sections and adds 진로 및 활동 분야 (employers) and 관련 자격 (e.g. 일반기계기사).

**Screenshots:** `mj_01_detail.png`, `mj_02_interview.png`, `mj_m_대학별권장이수과목6.png`, `mj_m_전국65곳모두보기.png`, `mj_03_search_rare.png`

---

## 7. `/jobs`: 직업 백과

**Mode tabs:** 🌟 미래 유망 직업 80선 / 직업 사전 500개 전체탐색. Counter banner: "전문 직업인 영상 1,009건 · 인터뷰 1,091건 탑재".

**80선**
- Search over job name, competencies and HS subjects (e.g. "퀀트" returns 1).
- 12 field filters plus 2 extra: IT·AI·SW 13, 반도체 6, 로봇·모빌리티 6, 의료·보건·약학 11, 바이오 7, 에너지·신소재 5, 경영·금융 7, 법률·공공·외교 7, 교육·연구·상담 5, 미디어 6, 디자인·건축·UX 5, 기능직(비학위) 2, plus "분류 외 영상멘토링 145개" and "분류 외 인터뷰 80개" (thumbnail grid, 고용24/커리어넷 브이로그).
- Shows 24 of 80 with "전체 한 번에 보기". There is a "직업 열람 진행률: x / N개 (% 열람 완료)" tracker and "전체 직업 한 번에 펼치기". A banner sends users to the 500 사전.
- **Card fields:** field, 직업인 인터뷰(n건) / 영상멘토링(n건) buttons, name, 하는 일, 핵심 요구 역량 (3), 고교 추천 과목 (up to 7), 상세보기.
- **Detail modal fields:**
  - 미래 전망 (e.g. 매우 밝음; 500-dict shows a score like "96/100 · 디지털 혁신 핵심")
  - 직업인 인터뷰 list: source (커리어넷 직업인 / 고용24), name (job), date, "일치/유사" match label, quote, "인터뷰 전문보기"
  - 원격영상 진로멘토링 list: mentor, "정보창에서 시청 ▶"
  - Inline video player with prev/next ("2 / 9"), "다음영상보기", "커리어넷 공식 사이트에서 시청 ↗" and "멘토링 강연 대본 및 해설 펼쳐보기"
  - 기타 직업 관련 동영상 (커리어넷 직업백과 clips)
  - 직업 개요, 필요 핵심 역량, 고등학교 연계 권장 과목, 관련 대학 학과
  - Close: "직업창 닫기" / 닫기

**500 사전**
- 18 categories: IT 66, 반도체 37, 로봇 37, 의료 25, 바이오 26, 에너지 27, 스마트팜·농림 22, 경영 31, 법률 32, 교육 34, 미디어 34, 문화·예술 9, 스포츠 4, 디자인 18, 기능직 52, 외식·호텔·뷰티·관광 25, 인문사회 21, plus the 분류 외 groups.
- Card adds "연계 추천 학과". Subjects and majors are "지능형 추론" (category templates).
- Search queries the local list and falls back to the live CareerNet API (e.g. 조향사 returns the CareerNet description text). 고용24 is a further fallback.
- Interview matching is loose. For example 풀스택 웹 앱 개발자 lists 한국화학연구원 나노소재 interviews.

**Screenshots:** `jb_01_detail.png`, `jb_02_video.png`, `jb_04_dict.png`, `jb_05_dict_detail.png`

---

## 8. `/counseling`: 진로검사·진로상담

Two tabs: "진로검사 20종 (커리어넷 7종, 고용24 13종)" and "진로상담 1:1 맞춤 컨설팅". There is also a CTA "1:1 맞춤 진로상담 바로가기 (무료)".

**커리어넷 7종.** Each card has a description, 3 진단 항목 & 혜택, "검사 소개 보기" and "바로 응시하기"; both link to `career.go.kr/cloud/w/inspect/{id}/intro`.
1. 직업흥미검사(K) (itrstk)
2. 직업흥미검사(H) (holland)
3. 직업적성검사 (vocation)
4. 직업가치관검사 (value2)
5. 진로개발역량검사 (able)
6. 진로실행력검사 (exc)
7. 진로성숙도 검사 (grow3)

**고용24 13종.** All link to the work24 list page; the user must find the test by name. Cards show 영역 tag, 대상, 소요시간, a "커리어넷 유사 검사" note and PC/모바일 info.

| # | Test | 영역 | 대상 / 소요 |
|---|---|---|---|
| 1 | AI 직업선호도검사 | 흥미 | 만 18세 이상, despite being listed under 중·고 |
| 2 | 직업선호도검사 S형(개정) | 흥미 | 25분 |
| 3 | 청소년 직업흥미검사(개정) | 흥미 | 20분 |
| 4 | 흥미로 알아보는 직업탐색(Job아드림) | 흥미 | 2분 |
| 5 | 직업흥미탐색검사(간편형) | 흥미 | 5분 |
| 6 | 중학생 진로적성검사 | 적성 | 63분 |
| 7 | 고등학생 적성검사 | 적성 | 65분 |
| 8 | 청소년 인성검사 | 성격 | 25분 |
| 9 | 청소년 직업가치관검사 | 가치 | 20분 |
| 10 | 중학생 진로발달검사(커리어UP) | 진로준비도 | 15분 |
| 11 | 고등학생 진로발달검사(커리어UP) | 진로준비도 | 15분 |
| 12 | 진로준비진단검사(찾아Dream) | 진로준비도 | 2분 |
| 13 | 초등학생 진로인식검사 | 진로인식 | 예비 중학생용, 30분 |

Other links on the tab: 청소년 비회원 검사 입구 (work.go.kr) and 고용24 회원 검사 목록. Usage notes: members have results saved; non-members can view results for 7 days; PC-only tests are flagged.

Results are not imported back into the platform, and nothing links test results to majors or subjects.

**1:1 상담 tab** ("PC에 최적화")
- 3 channel cards with "선택하기":
  1. 커리어넷 일대일 상담: 170여 명 진로전담교사; needs a CareerNet login to post
  2. EBS 진로학업설계 컨설팅 (중앙지원단 정밀상담)
  3. EBSi 일대일 대입상담
- Selected channel 1 shows:
  - **Embedded iframe** of the career.go.kr public 상담보기 list, header cropped by 195px, with "전체 헤더 표시하기" and "상담목록 새로고침"
  - "진로상담 새창에서 신청 ↗" and "원본 페이지 ↗"

**Screenshots:** `cs_01_consult.png`, `an/counseling.png` (earlier full list)

---

## 9. `/career-experience`: 진로체험·진로자료

Two tabs.

**진로자료 자료실 (진로·학업설계 가이드)**
- External web app "미래 신산업 연계 진로 탐색 시스템 [내일의 내 일 탐색]" (tomorrow-career-hub.vercel.app). It supports the 교육감 승인과목 "신산업과 내일 탐색" and offers a 20-question quiz, a 15-item 미래 트렌드 친화도 test and a 커리어&학업설계 로드맵.
- "고3 수능 이후 진로 전환기 10차시 프로그램": PPTX lessons on Google Drive plus a 교사용 매뉴얼 PDF. The list can be collapsed or expanded.

  | 차시 | Topics |
  |---|---|
  | 1 | 수고했다 19살의 나 |
  | 2·3 | 자격증·문화생활·독서·여행 |
  | 4 | 장학금·교환학생·다전공·학점교류 |
  | 5 | 전과·편입·군복무·N수 |
  | 6 | 수강신청·대인관계·조별과제 |
  | 7 | 만18세 권리와 책임 |
  | 8 | 아르바이트·근로계약 |
  | 9 | 경제금융·금융사기·전세계약 |
  | 10 | 도박·마약·우울·자살예방 |

**진로체험 꿈길 (국가 진로체험망)**
- "꿈길 바로가기 (새 창)" and a CTA to write an activity portfolio.
- Quick links: 프로그램 검색 / 체험 가이드 / 안전 매뉴얼 / 지원 사업.
- **Embedded ggoomgil iframe** (`/front/mypage/schlProgramList.do`) with "사이트 너비 맞춤 / 원본 100% / 상단메뉴 제외 / 새로고침 / 새 창 열기" controls.
- Info on 대구 진로체험지원센터 (5 교육지원청, 꿈버스, 학과탐방) and the 꿈길 phone number 1566-9915.
- The home card claims "꿈길과 연동하여 … 검색하고 신청", but there is no API integration; it is an iframe and links only.

**Screenshots:** `ce_01.png`, `ce_02_ggoomgil.png`

---

## 10. `/portfolio` (also `/planner`): 대구 디지털 진로 포트폴리오

**Common toolbar**
- 초기화 (confirm), 예시 불러오기 (confirm dialog replaces content), 제출용 보고서 (switches to a report view; button becomes "작성 화면"), 인쇄 / PDF, 저장 / 이어쓰기 (backup file, restore, link copy).
- Auto-save to localStorage. There is a banner warning that school PCs reset.

### 10.1 진로활동 포트폴리오: 중학 (4단계) / 고교 (5단계) toggle
- Step tabs with an "n / 4단계" pager and prev/next.
- Each step has a guiding question:
  - 기본: "어떤 진로활동에 참여했나요?"
  - 조사: "무엇을, 왜 알고 싶은가?"
  - 계획/준비: "어떻게 알아낼 것인가?"
  - 실행/행동: "현장에서 무엇을 보고, 묻고, 해냈는가?"
  - 성찰: "무엇이 달라졌는가?"
  - 입증 (고교): "성장을 무엇으로 보여줄 것인가?"
  - 자기평가

**기본 정보 (both levels)**
- 학교명, 학년, 반, 번호, 성명, 희망 직업, 관심 분야와 희망 계열.
- 창체 영역 (one of 6 buttons: 자율활동, 자치활동 / 학술·문화 및 여가 활동, 봉사활동 / 진로 탐색 활동, 진로 설계 및 실천 활동).
- 프로그램명/동아리명*.
- 활동/사업 영역* (select: 창의적 체험활동 / 학교 자체 / 자유학기 진로체험 (중) or 신산업 진로체험 (고) / 교육청 / 기타, plus free text).
- 체험 유형 (꿈길 분류)* (현장직업체험 / 직업실무체험 / 현장견학 / 학과체험 / 진로캠프 / 강연·대화).
- 체험 기관·장소*, 체험 일시 (date), 시작/종료 시각 (time).

**1단계 조사**
- 1-1 참여 동기 (sentence frame "나는 ___에 관심이 생겼는데…").
- 1-2 사전 조사 (4 textareas: 분야의 동향 / 관련 직업과 하는 일 / 우리 지역(대구)과의 연결 / 참고 출처).
- 1-3 지역사회·공동체 문제 (중; 학교-대구-우리나라-세계) or "이 분야와 공동체 문제" (고).
- 1-4 탐구 질문 3개 (Q1 직무·기술, Q2 학업·과목, Q3 공동체), each with a "💡 예시 질문 추천" select (직무·기술 / 학업·과목 / 사회·윤리).
- 1-5 키워드 3개 (중: "지금의 나") or "활동 전 나의 모습" (고).

**2단계 계획 (중) / 준비 (고)**
- 2-1 목표 3개 (frame "___을 알게 된다 / 할 수 있다").
- 중 2-2 실천 계획표: rows with "실천 계획 추가", each row = text + select (목표1/2/3/공통 계획).
- 고 2-2 전문가·멘토 인터뷰 질문표 (Q1~Q3).
- 2-3 예상 어려움과 대처.

**3단계 실행 (중) / 행동 (고)**
- 3-1 현장 활동 기록표 (rows: 시간대 / 활동 내용 / 관찰 및 배운 점, "행 추가").
- 3-2 탐구 질문 추적 ×3: question (editable), 현장에서 찾은 답, 출처·멘토, 해결 정도 (해결/부분 해결/미해결), 새로 생긴 질문.
- 3-3 멘토 인터뷰 핵심 (가장 중요했던 질문 / 답변 / 나의 해석).
- 3-4 주도적 행동, 3-5 협력과 공동체, 3-6 가장 인상 깊은 장면.

**4단계 성찰**
- 4-1 생각의 변화.
- 4-2 연결 교과:
  - 중: chips 역사, 국어, 사회, 도덕, 수학, 과학, 기술·가정, 정보, 영어, 음악, 미술, 체육, plus a reason
  - 고: chips 대수, 미적분Ⅰ, 확률과 통계, 기하, 미적분Ⅱ, 인공지능 수학, 물리학, 화학, 생명과학, 지구과학, 역학과 에너지, 정보, 인공지능 기초, 데이터 과학, 사회와 문화, 경제, 윤리와 사상, 현대사회와 윤리, 미술 창작, 음악 연주와 창작, plus a plan
- 중 only: 4-3 산출물 소개, 4-4 성장 한 문장.
- 4-5 (중) / 4-3 (고) 후속 실천 계획: rows of text + date + type chips (동아리 / 독서 / 주제탐구 / 봉사 / 수업), "계획 추가".

**5단계 입증 (고교 only)**
- 5-1 산출물 소개, 5-2 성장 한 문장 (100자), 5-3 핵심 성장 키워드 (max 3 of 11: 탐구력, 주도성, 협업, 소통, 배려, 끈기, 창의성, 윤리의식, 융합적 사고, 자기이해, 공동체 기여).

**자기 평가**
- 중 "6대 목표": 조사, 계획, 실행, 성찰, 협력, 나눔과 배려. Each is rated 잘했어요 / 보통이에요 / 더 노력할래요.
- 고 "7대 학습성과" (mirrors IB CAS outcomes): 강점과 성장 영역 인식, 새로운 도전과 기술 습득, 주도적 기획과 추진, 끈기와 헌신, 협업, 사회적 문제 참여, 윤리적 선택. Each is rated 매우 그렇다 / 그렇다 / 보통 / 노력 필요.
- Final button "작성 완료! 제출용 보고서 보기".

**예시 불러오기**
- 중학: "우리 마을 지명·역사 탐구": 김민서, OO중 2-3-14, 역사문화 큐레이터, 대구 근대역사관·골목길 (경상감영·약전골목), 현장견학, 2026-05-18; goals include a 탐방 지도 카드뉴스.
- 고교: "바이오헬스 유전자교정": 정하윤, OO고 2-5-19, 유전자교정 치료제 연구원, 대구경북첨단의료산업진흥재단, 직업실무체험, 2026-08-21. Full timeline, CRISPR questions, keywords 탐구력·끈기·윤리의식.

**제출용 보고서**
- Formatted A4-style report: "진로활동 포트폴리오 · 고등학교 | 5단계(조사-준비-행동-성찰-입증) 학생주도 탐구 보고서".
- Contains: 인적사항 table, 활동 개요 table, [1단계]…[5단계] sections with question labels and answers, 질문 tags, the timeline table, and sign lines "학생 확인 (인) / 지도교사 확인 (인)".
- Bugs: section numbers do not match the form (report says 4-2/4-4/4-10/5-2/5-5/5-6 where the form has 4-1/4-2/4-3/5-1/5-2/5-3). 3-3 and the self-assessment are not shown.

### 10.2 진로·학업설계 192학점 로드맵 (5 steps, with the live validator panel)
1. **진로 비전 설정**: 학생 성명, 학교 및 학년/반, 희망 계열 (9-option select), 목표 학과/전공, 목표 직업, 진로 사명 (한 줄 다짐).
2. **핵심 질문 & 역량 (백워드)**: 핵심 탐구 질문; 요구 역량 3개; 대학 권장이수과목 chips (+경제, +기하, +미적분Ⅱ, +물리학, … 28 options) feed the step-3 check; 이수 전략 메모.
3. **192학점 설계**: the full `/school-credit` simulator embedded.
4. **자기성찰 & 메모**: "질문이 진로가 되는 탐구 메모" textarea.
5. **창체 & 세특 연계**: 창체 계획 (자율/동아리/진로 template), 세특 연계 (교과 연계 탐구 보고서 계획), 학기별 성찰 ×6 (1-1 … 3-2).

There is no 예시 for the roadmap, although the "예시 불러오기" hint text still appears. The print layout is "나의 진로·학업설계 포트폴리오: 3개년 종합 계획서": 인적 table, [1·2단계], [3단계] semester lists, [5단계] and a 서명 line.

### 10.3 진로연계 독서 포트폴리오 (5 steps)
1. **기본 정보**: 성명, 학교/학년/반, 관심 진로·희망 직업, 진로 키워드 (max 3 of 15: 인공지능, 빅데이터·SW, 로봇, 미래자동차·모빌리티, 바이오헬스, 에너지·환경, 반도체, 문화콘텐츠·미디어, 공연·예술, 교육·상담, 보건·의료, 경영·경제, 법률·행정, 언론·미디어, 기타), 도서명, 저자, 출판사, 읽기 시작/다 읽은 날, 책 분야 (max 2 of 10), 독서 계기 (6 options), 고른 이유.
2. **독서 전**: 질문 Q1~Q3, 표지·목차 예측, 기대.
3. **독서 중**: 장면 rows (+기록 행 추가): 페이지·구간, 내 언어 요약, 인상 깊은 이유, 진로와의 연결점. 인물 탐구 (이름, 직업·활동, 배울 점).
4. **독서 후**: per-question 해결도 (답을 찾음 / 부분적으로 / 아직) and 책에서 찾은 답; 새로 알게 된 직업·분야 정보; 이전 생각 / 변화된 생각; 비판적 성찰; 후속 질문.
5. **확장 활동**: 심화 활동 rows (유형: 주제탐구 보고서 / 발표·토론 / 서평·글쓰기 / 카드뉴스·영상 / 기타; 내용; 결과물); 연계 후속 도서 (도서명, 이유); 나눔 (공유한 곳 select, 공유 대상, 피드백); 교과 세특 연계 아이디어; 한 줄 총평; 별점 1~5; 성장 한 문장.

Example: 정하윤 reading 『김대식의 인간 vs 기계』 (동아시아, 2026-08-01~20). It has its own 제출용 보고서.

**Screenshots:** `pf_중학_기본기본.png` … `pf_중학_자기평가.png`, `pf_고교_last.png`, `pf_고교_report.png`, `pf_tab_진로학업설.png`, `pf_진로학_3단계.png` (embedded simulator), `pf_roadmap_print.png`, `pf_reading_step1.png` … `pf_reading_step5.png`, `pf_reading_report.png`

---

## 11. `/admission-2028`: 2028 대입정보

Four main tabs, each with sub-tabs.

**Tab A: 2028 핵심체제**

Sub-tab "2028수능 시행 안내" has a 5-item quick TOC:
1. 평가원 PDFs: 2028 예시문항 안내자료집; 통합사회·통합과학 예시문항 (direct suneung.re.kr downloads).
2. 3대 핵심 변화: 통합형 수능 / 5등급 내신·정성평가 / 정시 변화.
3. **Exam-day timetable** (2027-11-18 목): per 교시, time, minutes, 문항/배점, 출제범위 (국어 공통 화법과 언어·독서와 작문·문학; 수학 대수·미적분Ⅰ·확통; 영어Ⅰ·Ⅱ; 한국사; 통합사회; 통합과학; 제2외/한문) and 평가방식.
4. 영역별 문항 구성 cards.
5. 핵심 변경 포인트 4가지.

Sub-tab "내신성적 산출 방법 (5등급제)" is the same simulator and content as `/subjects` tab 2.

**Tab B: 시행계획·수시·정시 (대입전형 상세안내)**

Sub-tab "대학별 시행계획 (PDF)"
- 214 universities.
- 지역 filter (서울 40, 경기·인천 37, 대구·경북 21, 부울경 23, 대전·충청·세종 41, 광주·전라 29, 강원·제주 11, 특수목적대 12).
- 초성 filter (ㄱ~ㄷ …).
- Card: 2028시행계획 (PDF), 전공안내, 학종안내, 입학처, "수시 n개 · 정시 m개 전형 보기".
- That button opens a university modal, e.g. 경북대: "수시 22개 전형 (4,552명) · 정시 4개 전형 (1,034명)". 수시/정시 tabs list 전형 by type with 정원내/외, 수능최저 있음/없음, 인원, 모집단위 수 and "+ 비교".

Sub-tab "수시 수능최저·전형 검색" (**faceted search over 2,594 전형**)
- Facets: 지역; 전형유형 (학생부교과 1285, 학생부종합 800, 논술 69, 실기/실적 391, 특수목적대 27, 재외 1, 기타 21); 계열 (인문/자연/예체능/통합).
- Text fields: 대학명, 모집단위·단과대학, 전형명.
- 세부: 정원내/외, 일괄합산/단계별, 수능최저 없음/있음.
- View: 전형별 / 대학별. Sort: 가나다순 / 모집인원 많은 순.
- Card: 대학, 지역, 전형, 유형, 정원, 수능최저 (없음/일부/있음), 인원·모집단위, 전형방법 (e.g. "단계별 · 1단계 서류 100% → 2단계 70%+면접 30%"), 모집단위 chips, "전형 상세", "+ 비교" (comparison tray).

Sub-tab "정시 반영비율·전형 검색"
- Same UI. Facets 가군 535 / 나군 576 / 다군 456 / 군 미구분 220.
- Data includes 수능 활용지표, 국/수/영/탐 %, 탐구 과목수, 영어·한국사 환산, 가산점, 1단계 비율.

**Tab C: 고교-대학 연계 (대학 권장이수과목)**

Sub-tab "대학별 전공 핵심과목" (header says "32개교 · 143개 전공"; the list says 162)
- 핵심 권장 vs 권장 definitions.
- University group filter: 전체 32 / 서울 주요대 18 / 거점국립대 7 / 수도권·특성화대 7, plus individual university chips.
- 계열/단과대 filter (공대/IT, 의약, 자연, 상경, 사회·인문·사범).
- Card list: university, college, unit, note, 핵심 권장이수과목 (필수 권장), 권장 이수과목 (일반 권장). "전체 목록 한 번에 보기".

Sub-tab "2028 계열별 반영과목" (7 계열 · 40 전공 · 35개교)
- Views: 전공별 매트릭스 표 / 과목 중심 역추적 / 대학별 모아보기.
- 대계열 → 세부 중분류 chips → per-major matrix of universities × subjects (국어, 대수, 확통, 미적Ⅰ, 미적Ⅱ, 기하, 일반사회, 역사, 지리, 윤리, 물리, 화학, 생명, 지구, 기타). ● marks 지정/필수 and ⁎ marks 참고. Has a search box.

**Tab D: EBS 입시전략 (EBSi 학습전략설명회)**
- An outbound link card to the EBSi 설명회 site with 3 benefit bullets. No content is embedded.

**Interactive tools here:** the 내신 calculator, the university PDF directory, 수시/정시 faceted search with comparison, the 권장과목 matrix and the reverse lookup. There is no 수능 score calculator, no 합격 가능성 tool, and nothing that links a student's own 내신 to 전형 eligibility.

**Screenshots:** `ad_수능내신개편안.png`, `ad_naesin.png`, `ad_대입전형상세안내.png`, `ad_univ_jeonhyung.png`, `ad_수시.png`, `ad_수시_search.png`, `ad_정시.png`, `ad_대학권장이수과목.png`, `ad_gyeyeol.png`

---

## 12. Cross-cutting findings: weaknesses, bugs and UX friction

**Product and feature gaps (opportunities)**
1. **No accounts, no teacher dashboard, no class management.** Everything is in localStorage. Hand-in is a printout, a backup file or a base64 link, and teachers cannot review or comment.
2. **Tools are isolated:**
   - The 20 psych-test results are not imported.
   - 학과 and 직업 favorites do not feed the 계열 ⭐ in the simulator. The simulator uses 9 generic 계열, not the chosen major or university.
   - 권장이수 for a target university is only checked through a coarse 계열 list.
   - Nothing feeds into the 수시/정시 search.
3. **Simulator logic gaps:**
   - Lets you pick 미적분Ⅰ and Ⅱ in the same semester (flagged only afterwards).
   - Exceeding a 택N cap is silently ignored.
   - The 81 cap overflow does not block anything, and the print still says "졸업 요건 충족".
   - The "N학점 설계" badge actually means remaining credits.
   - Required subjects the school does not offer (e.g. 인공지능 수학) get no 공동교육과정 or 온라인학교 suggestion.
   - The 공동교육과정 slot is free text only; there is no catalogue of Daegu 공동교육과정 or 온라인학교 courses.
4. **Coverage:** 72 of 97 schools have curricula, and 특성화/마이스터 tracks are absent from the simulator. The home page says 69, which does not match. The 권장이수 DB covers only 32 universities and 162 units. The 수시/정시 DB counts disagree (214 / 226 / 233 universities in different places).
5. **Middle-school support is thin.** There is only the 중학 4단계 portfolio. There is no 고입 decision helper that ties schools to the student's 진로, and no 중학 subject or 자유학기 content.
6. **Search** covers only majors, subjects, jobs and 권장. It misses schools, tests, admissions and E-Book content.
7. **Content quality:**
   - Many job descriptions in the 500 dictionary are templated ("…은(는) IT·인공지능 분야에서 … 국가공인 직무입니다").
   - Subject video summaries are auto-generated ("대수은(는)").
   - Interview matching is loose ("유사" interviews from unrelated fields).
   - Professor interviews date from about 2013.
   - The examples use 2015-curriculum subject names (생명과학Ⅰ).
   - Some 2028 claims are speculative ("수능최저 강화 확대"), and "등급 상승 효과" compares 9- and 5-grade scales as if they were equivalent.
8. **External dependencies.** Tests, counselling, 꿈길 and EBS are links or iframes (career.go.kr counsel list cropped at 195px; ggoomgil iframe). The site labels them "PC에 최적화".

**Bugs observed**
- No 404 page: any URL renders home with HTTP 200.
- Some `/data/*.json` paths return the SPA HTML; the code works around this with fallback paths.
- Commute 단계별 안내 numbering skips step 3.
- Portfolio report numbering does not match the form, and self-assessment and 3-3 are missing from the report.
- The roadmap shows the "예시 불러오기" hint with no button.
- The validator shows "114학점 설계 / 78/192" before any school is chosen.
- "⭐ 기타 추천과목 부각" appears but stars nothing.
- "다음 단계 (4단계 자기성찰 & 메모)" appears on standalone `/school-credit`.
- The 권장 header count (143) disagrees with the list (162).
- 고용24 "AI 직업선호도검사" (만 18세 이상) is listed among the 중·고 13종.
- Mentor video playback errored in headless Chromium (possibly codec related; not confirmed in a real browser).

**Accessibility**
- Modals are plain `div.fixed` elements with no `role="dialog"` or `aria-modal`. Focus does not move into the modal and **Escape does not close it**. Stacked modals (detail → interview) block the background.
- Tabs and toggles are plain buttons with no `role=tab`, `aria-selected` or `aria-pressed`, so screen readers cannot tell which item is selected.
- Many inputs have no programmatic label: portfolio 15 per step, highschool 5, school-credit 5.
- Pages have one h1 and almost no h2 (majors, jobs and highschool have 0 h2).
- No skip link.
- Positives: `lang="ko"`, focus outline visible (auto 3px), font-size toggle on the E-Book only, and images have alt text.
- Heavy emoji used as meaning (⭐, 🔒, 🤝).

**Performance**
- 1.7 MB brotli (about 9.7 MB raw) of JS is loaded on every route, including about 7.5 MB of data even for text pages.
- No immutable caching on hashed assets.
- 수시 JSON is 397 KB br and 정시 is about 250 KB br on first use.
- Majors DOM is about 1,600 nodes; the majors page is about 11,400 px tall on mobile.
- FCP was about 0.9 s on a fast connection; slow school networks and phones would suffer.

**Mobile**
- Responsive (390 px wide, no horizontal scroll) with a hamburger menu.
- Very long pages: majors 11.4k px, admission 8.6k px.
- Several features say "PC에 최적화" (counselling iframe, 꿈길).
- Dense chip grids in the simulator.

**SEO and sharing**
- noindex plus `robots Disallow: /`, so content cannot be found via search.
- `/manifest.json` returns HTML, so the PWA claim is broken even though there are apple/mobile-web-app meta tags.

---

## 13. Screenshots

Kept in `docs/reference/screenshots/`: 01-home-search, 02-ebook-ch2, 03-highschool-map, 04-subject-modal, 05-credit-semester, 06-credit-validator, 07-major-detail, 08-portfolio-report, 09-admission-susi.
