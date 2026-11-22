// 나이스 교육정보 개방 포털 연동 (GitHub Actions에서 NEIS_API_KEY로 실행, 매일 새벽 빌드)
// 출력: public/data/neis/subjects.json (고교별 이번 학기 시간표에 나온 과목, 방학 중에는 배포된 자료를 이어받음)
//       public/data/neis/codes.json   (경남 중·고 학교명 → 학교코드)
//       public/data/neis/meal/{학교코드}.json (오늘부터 7일 중식, 커밋하지 않음)
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";

const KEY = process.env.NEIS_API_KEY;
if (!KEY) {
  console.log("NEIS_API_KEY 없음 → 건너뜀");
  process.exit(0);
}
const ROOT = new URL("../public/data/neis/", import.meta.url);
mkdirSync(new URL("meal/", ROOT), { recursive: true });
const OFC = "S10"; // 경상남도교육청

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function hub(svc, params) {
  const rows = [];
  for (let page = 1; page <= 30; page++) {
    const u = new URL(`https://open.neis.go.kr/hub/${svc}`);
    Object.entries({ KEY, Type: "json", pIndex: String(page), pSize: "1000", ATPT_OFCDC_SC_CODE: OFC, ...params }).forEach(([k, v]) => u.searchParams.set(k, v));
    let j;
    for (let t = 0; t < 3; t++) {
      try {
        const r = await fetch(u);
        j = await r.json();
        break;
      } catch (e) {
        if (t === 2) throw e;
        await sleep(1000 * (t + 1));
      }
    }
    const body = j[svc];
    if (!body) {
      const code = j.RESULT?.CODE;
      if (code !== "INFO-200") console.log(svc, code, j.RESULT?.MESSAGE);
      break;
    }
    const total = body[0].head[0].list_total_count;
    rows.push(...(body[1]?.row ?? []));
    if (rows.length >= total) break;
  }
  return rows;
}
async function pool(items, n, fn) {
  const out = [];
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => {
    while (i < items.length) {
      const k = i++;
      try { out[k] = await fn(items[k]); } catch (e) { console.log("실패", items[k], e.message); }
    }
  }));
  return out;
}
const ymd = (d) => d.toISOString().slice(0, 10).replace(/-/g, "");
// 한국 시간 기준 오늘
const now = new Date(Date.now() + 9 * 3600e3);
const today = ymd(now);
const addDays = (n) => ymd(new Date(now.getTime() + n * 86400e3));

// 1) 학교 코드 (경남 중·고)
const codes = {};
for (const kind of ["중학교", "고등학교"]) {
  for (const r of await hub("schoolInfo", { SCHUL_KND_SC_NM: kind })) codes[r.SCHUL_NM] = r.SD_SCHUL_CODE;
}
writeFileSync(new URL("codes.json", ROOT), JSON.stringify(codes));
console.log("학교 코드", Object.keys(codes).length);

// 2) 고교 개설 과목 (최근 3주 시간표 → 학년별 과목 목록)
const hs = JSON.parse(readFileSync(new URL("../src/data/gn-schools.json", import.meta.url), "utf8"));
const m = now.getUTCMonth() + 1;
const AY = String(m >= 3 ? now.getUTCFullYear() : now.getUTCFullYear() - 1);
const SEM = m >= 3 && m <= 8 ? "1" : "2";
const NOISE = /^(자율|동아리|봉사|진로활동|창의적|창체|자율·자치|자치|토요|방과후|보충|자습|점심|조회|종례|-|\s*)$/;
// 학사 일정·행사로 들어간 칸 제외
const EVENT = /휴업|휴일|휴무|시험|고사|대청소|체험학습|현장학습|행사|축제|졸업|입학|방학|기념일|수련|수학여행|체육대회|평가|학예|발표회|자습|대비|특강|연수|안전교육|교육활동|^수능|원격|등교|선거|검사|결석|예비소집/;
// "[보강]기하A" → "기하" (보강 표시, 분반 기호 제거)
const subjName = (t) => t.replace(/^\*+/, "").replace(/\[[^\]]*\]|\([^)]*반\)/g, "").trim().replace(/(?<=[가-힣ⅠⅡⅢ\d)])\s*[A-Z]\d?$/, "").trim();
const subjPath = new URL("subjects.json", ROOT);
// 방학 중에는 시간표가 비므로 지금 배포된 자료를 이어받는다 (저장소 커밋 불필요)
let prev = { schools: {} };
try {
  const r = await fetch("https://my-job-c1e50.web.app/data/neis/subjects.json");
  if (r.ok) prev = await r.json();
} catch {}
if (!Object.keys(prev.schools ?? {}).length && existsSync(subjPath)) prev = JSON.parse(readFileSync(subjPath, "utf8"));
const subjects = { ...prev.schools };
let fresh = 0;
await pool(hs, 6, async (s) => {
  const rows = await hub("hisTimetable", { SD_SCHUL_CODE: s.id, AY, SEM, TI_FROM_YMD: addDays(-21), TI_TO_YMD: today });
  if (!rows.length) return;
  const by = {};
  for (const r of rows) {
    const name = subjName(r.ITRT_CNTNT || "");
    if (!name || NOISE.test(name) || EVENT.test(name) || /활동$/.test(name)) continue;
    (by[r.GRADE] ??= new Set()).add(name);
  }
  if (!Object.keys(by).length) return;
  subjects[s.id] = { ay: AY, sem: SEM, grades: Object.fromEntries(Object.entries(by).map(([g, set]) => [g, [...set].sort((a, b) => a.localeCompare(b, "ko"))])) };
  fresh++;
});
writeFileSync(subjPath, JSON.stringify({ asOf: today, source: "나이스 교육정보 개방 포털 고등학교시간표", schools: subjects }));
console.log(`개설 과목: 이번 실행 ${fresh}곳 갱신, 전체 ${Object.keys(subjects).length}곳`);

// 3) 급식 (오늘부터 7일, 중식)
const clean = (s) => s.split(/<br\s*\/?>/).map((x) => x.replace(/\([\d.\s]+\)/g, "").replace(/\((점심|중식|석식|조식|중|소|대)\)/g, "").replace(/[*#]+/g, "").replace(/\s+/g, " ").trim()).filter(Boolean);
let meals = 0;
await pool(Object.entries(codes), 8, async ([, code]) => {
  const rows = await hub("mealServiceDietInfo", { SD_SCHUL_CODE: code, MLSV_FROM_YMD: today, MLSV_TO_YMD: addDays(7) });
  const days = {};
  for (const r of rows) {
    if (r.MMEAL_SC_CODE !== "2") continue; // 중식
    days[r.MLSV_YMD] = { dish: clean(r.DDISH_NM || ""), kcal: r.CAL_INFO || "" };
  }
  if (!Object.keys(days).length) return;
  writeFileSync(new URL(`meal/${code}.json`, ROOT), JSON.stringify({ asOf: today, days }));
  meals++;
});
console.log("급식 파일", meals);
