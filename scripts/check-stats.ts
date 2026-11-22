// 홈·메뉴에 보이는 숫자 검사 (매일 배포 전 GitHub Actions에서 실행, 로컬: npm run check:stats)
// 1) 화면 숫자(src/data/stats.ts)가 실제 데이터 개수와 같은지  2) 졸업 학점 규칙이 서로 맞는지
// 3) 나이스 공식 학교 수와 비교(달라지면 경고: 신설·폐교 반영 필요)
import { readFileSync } from "node:fs";
import { STATS } from "../src/data/stats";
import { GN_SCHOOLS } from "../src/data/gn";
import { SUBJECTS, CREDIT_RULES } from "../src/data/subjects";
import { JOBS } from "../src/data/jobs";
import { MAJORS } from "../src/data/majors";
import { CAREERNET_TESTS, WORK24_TESTS } from "../src/data/tests";

const errs: string[] = [];
const warns: string[] = [];
const eq = (label: string, shown: number, real: number) => { if (shown !== real) errs.push(`${label}: 화면 ${shown} ≠ 실제 ${real}`); };

const univ = JSON.parse(readFileSync("public/data/univ-index.json", "utf8"));
eq("경남 고교", STATS.schools, GN_SCHOOLS.length);
eq("고교 과목", STATS.subjects, SUBJECTS.length);
eq("전국 대학·캠퍼스", STATS.univ, univ.schools.length);
eq("직업", STATS.jobs, JOBS.length);
eq("학과", STATS.majors, MAJORS.length);
eq("공식 진로검사", STATS.tests, CAREERNET_TESTS.length + WORK24_TESTS.length);

// 졸업 학점(2022 개정 교육과정 총론): 192 = 교과 174 + 창의적 체험활동 18
const R = CREDIT_RULES as unknown as { total: number; required: number; basicCap: number; requiredByArea: { min: number }[] };
if (R.total !== 192) errs.push(`졸업 학점 ${R.total} ≠ 192`);
const reqSum = R.requiredByArea.reduce((a, x) => a + x.min, 0);
if (R.required !== reqSum) errs.push(`필수 이수 ${R.required} ≠ 교과(군)별 합 ${reqSum}`);
if (R.required !== 84) errs.push(`필수 이수 ${R.required} ≠ 84`);
if (R.basicCap !== 174 / 2 - 6) errs.push(`국·수·영 상한 ${R.basicCap} ≠ 교과 174의 50%(87) − 한국사 6 = 81`);

// 나이스에는 있지만 경남교육청 고입포털 고교현황 목록에 없는 학교(사이트 목록에서 제외하는 것이 맞음)
// - 경남온라인학교: 온라인 공동교육과정 학교 / - 창원예술학교: 공립 각종학교(고입포털 일반 전형 목록에 없음)
const NOT_ADMISSION = new Set(["경남온라인학교", "창원예술학교"]);

// 나이스 공식 학교 수 (키 없이 개수만 조회 가능, 키가 있으면 학교 이름까지 대조)
async function neisCount(kind: string) {
  const u = `https://open.neis.go.kr/hub/schoolInfo?Type=json&pIndex=1&pSize=1&ATPT_OFCDC_SC_CODE=S10&SCHUL_KND_SC_NM=${encodeURIComponent(kind)}`;
  const j = await (await fetch(u)).json();
  return j.schoolInfo ? (j.schoolInfo[0].head[0].list_total_count as number) : 0;
}
async function main() {
try {
  const [hs, misc, tech] = await Promise.all([neisCount("고등학교"), neisCount("각종학교(고)"), neisCount("고등기술학교")]);
  const official = hs + misc + tech;
  const key = process.env.NEIS_API_KEY;
  if (key) {
    const names = new Set<string>();
    for (const kind of ["고등학교", "각종학교(고)", "고등기술학교"]) {
      const u = `https://open.neis.go.kr/hub/schoolInfo?KEY=${key}&Type=json&pIndex=1&pSize=1000&ATPT_OFCDC_SC_CODE=S10&SCHUL_KND_SC_NM=${encodeURIComponent(kind)}`;
      const j = await (await fetch(u)).json();
      for (const r of j.schoolInfo?.[1]?.row ?? []) names.add(r.SCHUL_NM);
    }
    const ours = new Set(GN_SCHOOLS.map((x) => x.name));
    const extra = [...names].filter((n) => !ours.has(n) && !NOT_ADMISSION.has(n));
    const missing = [...ours].filter((n) => !names.has(n));
    if (extra.length) warns.push(`나이스에만 있는 학교: ${extra.join(", ")}`);
    if (missing.length) warns.push(`사이트에만 있는 학교: ${missing.join(", ")}`);
    if (!extra.length && !missing.length) console.log(`나이스 이름 대조: 모두 일치(고입 대상 아님 제외: ${[...NOT_ADMISSION].join(", ")})`);
  }
  const notAdm = NOT_ADMISSION.size;
  if (official - notAdm !== STATS.schools) warns.push(`나이스 경남 고교 ${official}곳(고등학교 ${hs} + 각종학교 ${misc} + 고등기술학교 ${tech}) ≠ 사이트 ${STATS.schools}곳 + 고입 대상 아님 ${notAdm}곳 → 신설·폐교·교명 변경 확인`);
  else console.log(`나이스 대조: ${official}곳(고입 대상 아님 ${notAdm}곳 포함) 일치`);
} catch (e) {
  warns.push(`나이스 조회 실패(네트워크): ${(e as Error).message}`);
}

}

main().then(() => {
for (const w of warns) console.log(`::warning title=숫자 점검::${w}`);
for (const e of errs) console.log(`::error title=숫자 점검::${e}`);
console.log(errs.length ? `숫자 점검 실패 ${errs.length}건` : `숫자 점검 통과 (경고 ${warns.length}건)`);
process.exit(errs.length ? 1 : 0);
});
