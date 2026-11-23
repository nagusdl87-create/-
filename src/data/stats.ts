import cn from "./careernet/summary.json"; // 커리어넷 자료로 매주 갱신되는 작은 요약(5KB)

// 화면에 보이는 숫자 모음. 값을 바꾸면 scripts/check-stats.ts가 실제 데이터와 맞는지 매일 검사한다(npm run check:stats).
// (Nav·홈 같은 모든 페이지 코드에서 큰 데이터 파일을 불러오지 않도록 숫자만 적어 둔다)
export const STATS = {
  schools: 203, // 경남 고교: 입학포털 고교현황 = 나이스 고등학교 197 + 각종학교(고) 7 + 고등기술학교 1 − 고입포털 목록 밖 2(경남온라인학교·창원예술학교)
  subjects: 290, // 2022 개정 고교 과목(src/data/subjects.ts)
  univ: 444, // 전국 대학·캠퍼스(public/data/univ-index.json, 대교협 전국대학별학과정보)
  jobs: 51, // 마이로드 심화 직업(src/data/jobs.ts)
  majors: 56, // 마이로드 심화 학과(src/data/majors.ts)
  jobsAll: cn.jobs.total, // 직업 백과 전체 = 심화 + 커리어넷 공식 직업(이어진 것은 한 번만)
  majorsAll: cn.majors.total, // 학과 백과 전체
  tests: 20, // 공식 진로검사: 커리어넷 + 고용24
} as const;
