// 커리어넷 Open API → src/data/careernet/*.json (주 1회, GitHub Actions에서 실행해 저장소에 커밋)
// - 직업백과(새 API): 목록 jobs.json + 모든 직업의 상세 job.json?seq=(job_cd). 우리 직업 백과와 이어지는 것은 map에 기록
// - 학과정보: 목록 getOpenApi svcCode=MAJOR(대학교) + 모든 학과의 상세 MAJOR_VIEW. 우리 학과 백과와 이어지는 것은 map에 기록
// 출처: 커리어넷(www.career.go.kr) 오픈API. 키는 GitHub Secrets(CAREERNET_API_KEY)에서만 읽는다.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const KEY = process.env.CAREERNET_API_KEY;
if (!KEY) { console.log("CAREERNET_API_KEY가 없어 건너뜀"); process.exit(0); }
const B = "https://www.career.go.kr/cnet";
const OUT = "src/data/careernet";
mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function getJSON(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": "myroad-gyeongnam/1.0 (career education, non-commercial)" } });
      if (r.ok) return await r.json();
    } catch { /* 다시 */ }
    await sleep(1000 * (i + 1));
  }
  throw new Error("요청 실패: " + url.replace(KEY, "***"));
}
const strip = (s) => String(s ?? "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
const norm = (s) => strip(s).replace(/[\s·ㆍ・,()（）\-]/g, "").toLowerCase();

// 우리 직업·학과 이름(데이터 파일을 직접 읽어 정규식으로 뽑음: 빌드 없이 실행)
const jobsTs = readFileSync("src/data/jobs.ts", "utf8");
const OUR_JOBS = [...jobsTs.matchAll(/id:\s*"([^"]+)",\s*name:\s*"([^"]+)"/g)].map((m) => ({ id: m[1], name: m[2] }));
const majorsTs = readFileSync("src/data/majors.ts", "utf8");
const OUR_MAJORS = [...majorsTs.matchAll(/M\(\s*"([^"]+)",\s*"([^"]+)"/g)].map((m) => ({ id: m[1], name: m[2] }));
// 이름이 달라 자동으로 못 찾는 것은 여기서 직접 이어 준다(우리 id → 커리어넷 이름)
const JOB_ALIAS = JSON.parse(readFileSync("scripts/careernet-alias.json", "utf8")).jobs ?? {};
const MAJOR_ALIAS = JSON.parse(readFileSync("scripts/careernet-alias.json", "utf8")).majors ?? {};

// ── 1. 직업 목록 (상세 요청 job.json?seq= 에는 목록의 seq가 아니라 job_cd를 넣어야 한다)
const jobs = [];
for (let page = 1; page < 200; page++) {
  const d = await getJSON(`${B}/front/openapi/jobs.json?apiKey=${KEY}&pageIndex=${page}`);
  const list = d.jobs ?? [];
  for (const j of list) {
    jobs.push({ seq: +j.job_cd, name: strip(j.job_nm), field: strip(j.aptit_name), group: strip(j.top_nm), work: strip(j.work), rel: strip(j.rel_job_nm), wage: strip(j.wage), wlb: strip(j.wlb), social: strip(j.social) });
  }
  if (!list.length || jobs.length >= +(d.count ?? 0)) break;
  await sleep(150);
}
console.log("직업 목록", jobs.length);
if (jobs.length < 300) throw new Error("직업 목록이 너무 적어요(응답 이상) — 저장하지 않음");

// ── 2. 우리 직업 ↔ 커리어넷 직업 잇기
const byNorm = new Map(jobs.map((j) => [norm(j.name), j]));
const jobMap = {};
for (const o of OUR_JOBS) {
  const want = JOB_ALIAS[o.id];
  if (want === null) continue; // 일부러 잇지 않음
  const hit = want ? byNorm.get(norm(want)) : byNorm.get(norm(o.name)) ?? jobs.find((j) => j.rel.split(",").some((r) => norm(r) === norm(o.name)));
  if (hit) jobMap[o.id] = hit.seq;
}
console.log("이어진 직업", Object.keys(jobMap).length, "/", OUR_JOBS.length, "· 못 찾음:", OUR_JOBS.filter((o) => !jobMap[o.id]).map((o) => o.name).join(", "));

// ── 3. 직업 상세(전체). 상세 이름이 목록 이름과 다르면 저장하지 않는다
// 응답 배열에 빈 칸(null)이 섞여 올 때가 있어 걸러 낸다
const A = (a) => (Array.isArray(a) ? a : []).filter((x) => x && typeof x === "object");
const list = (arr, k) => A(arr).map((x) => strip(x[k])).filter(Boolean);
const jobDetail = {};
let jobMiss = 0;
for (const j of jobs) {
  let d;
  try { d = await getJSON(`${B}/front/openapi/job.json?apiKey=${KEY}&seq=${j.seq}`); } catch { jobMiss++; continue; }
  const b = d?.baseInfo ?? {};
  if (!b.job_nm || norm(b.job_nm) !== norm(j.name)) { jobMiss++; continue; }
  const edu = A(d.eduChart)[0];
  jobDetail[j.seq] = {
    seq: j.seq, name: strip(b.job_nm), updated: strip(b.edit_dt),
    work: list(d.workList, "work"),
    aptitude: list(d.aptitudeList, "aptitude"),
    interest: list(d.interestList, "interest"),
    abilities: list(d.abilityList, "ability_name"),
    research: list(d.researchList, "research"),
    curriculum: list(d.jobReadyList?.curriculum, "curriculum"),
    certificate: list(d.jobReadyList?.certificate, "certificate"),
    training: list(d.jobReadyList?.training, "training"),
    majors: A(d.departList).map((x) => strip(x.depart_name ?? x.major_nm ?? x.depart)).filter(Boolean),
    certs: A(d.certiList).map((x) => strip(x.certi ?? x.certi_name)).filter(Boolean),
    forecast: list(d.forecastList, "forecast"),
    orgs: A(d.jobRelOrgList).map((x) => ({ name: strip(x.rel_org), url: strip(x.rel_org_url) })).filter((x) => x.name),
    wage: strip(b.wage), wageNote: strip(b.wage_source), satisfaction: b.satisfication ?? null, satisfactionNote: strip(b.satisfi_source),
    wlb: strip(b.wlb), social: strip(b.social),
    edu: edu ? { labels: strip(edu.chart_name).split(","), values: strip(edu.chart_data).split(",").map(Number), source: strip(edu.source) } : null,
  };
  await sleep(120);
}
for (const [id, seq] of Object.entries(jobMap)) if (!jobDetail[seq]) delete jobMap[id];
console.log("직업 상세", Object.keys(jobDetail).length, "· 못 받음", jobMiss);
if (Object.keys(jobDetail).length < jobs.length * 0.8) throw new Error("직업 상세를 너무 적게 받았어요 — 저장하지 않음");

// ── 4. 학과 목록(대학교)
const majors = [];
for (let page = 1; page < 100; page++) {
  const d = await getJSON(`${B}/openapi/getOpenApi?apiKey=${KEY}&svcType=api&svcCode=MAJOR&contentType=json&gubun=univ_list&thisPage=${page}&perPage=100`);
  const list = d.dataSearch?.content ?? [];
  for (const m of list) majors.push({ seq: +m.majorSeq, name: strip(m.mClass), field: strip(m.lClass), alias: strip(m.facilName) });
  if (!list.length || majors.length >= +(list[0]?.totalCount ?? 0)) break;
  await sleep(150);
}
console.log("학과 목록", majors.length);

// ── 5. 우리 학과 ↔ 커리어넷 학과 잇기 + 상세
const mByNorm = new Map(majors.map((m) => [norm(m.name), m]));
const majorMap = {};
for (const o of OUR_MAJORS) {
  const want = MAJOR_ALIAS[o.id];
  if (want === null) continue;
  const hit = want ? mByNorm.get(norm(want)) : mByNorm.get(norm(o.name));
  if (hit) majorMap[o.id] = hit.seq;
}
console.log("이어진 학과", Object.keys(majorMap).length, "/", OUR_MAJORS.length, "· 못 찾음:", OUR_MAJORS.filter((o) => !majorMap[o.id]).map((o) => o.name).join(", "));
const majorDetail = {};
let majorMiss = 0;
for (const mm of majors) {
  let d;
  try { d = await getJSON(`${B}/openapi/getOpenApi?apiKey=${KEY}&svcType=api&svcCode=MAJOR_VIEW&contentType=json&gubun=univ_list&majorSeq=${mm.seq}`); } catch { majorMiss++; continue; }
  const c = d.dataSearch?.content?.[0] ?? {};
  if (!c.major || norm(c.major) !== norm(mm.name)) { majorMiss++; continue; }
  const subj = A(c.relate_subject_2022).map((x) => ({ kind: strip(x.subject_name), names: strip(x.subject_description) })).filter((x) => x.names);
  majorDetail[mm.seq] = {
    seq: mm.seq, name: strip(c.major), summary: strip(c.summary), interest: strip(c.interest), property: strip(c.property),
    salary: strip(c.salary), employment: strip(c.employment),
    jobs: strip(c.job), qualifications: strip(c.qualifications),
    subjects2022: subj,
    fields: A(c.enter_field).map((x) => ({ name: strip(x.gradeuate), desc: strip(x.description) })).filter((x) => x.name),
    activities: A(c.career_act).map((x) => ({ name: strip(x.act_name), desc: strip(x.act_description) })).filter((x) => x.name),
    mainSubjects: A(c.main_subject).map((x) => ({ name: strip(x.SBJECT_NM), desc: strip(x.SBJECT_SUMRY) })).filter((x) => x.name).slice(0, 12),
    univCount: A(c.university).length,
  };
  await sleep(120);
}
for (const [id, seq] of Object.entries(majorMap)) if (!majorDetail[seq]) delete majorMap[id];
console.log("학과 상세", Object.keys(majorDetail).length, "· 못 받음", majorMiss);
if (Object.keys(majorDetail).length < majors.length * 0.8) throw new Error("학과 상세를 너무 적게 받았어요 — 저장하지 않음");

const meta = { source: "커리어넷(www.career.go.kr) 오픈API", fetchedAt: new Date().toISOString().slice(0, 10) };
const save = (f, o) => writeFileSync(`${OUT}/${f}`, JSON.stringify(o, null, 0) + "\n");
save("jobs.json", { ...meta, jobs });
save("majors.json", { ...meta, majors });
save("job-detail.json", { ...meta, map: jobMap, detail: jobDetail });
save("major-detail.json", { ...meta, map: majorMap, detail: majorDetail });
console.log("저장 완료", OUT);
await import("./build-careernet-index.mjs");
