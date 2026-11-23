// 커리어넷 자료(src/data/careernet/*.json) → 화면용 가벼운 색인
//   summary.json  : 전체 개수, 분야(직업)·계열(학과)별 개수 — 메뉴·홈·백과 머리에 쓰는 작은 파일
//   directory.json: 목록 화면용(번호·이름·분야·한 줄 설명·우리 백과 id) — 직업·학과 백과에서 필요할 때만 불러옴
// fetch-careernet.mjs가 끝날 때 자동 실행. 직접 실행: node scripts/build-careernet-index.mjs
import { readFileSync, writeFileSync } from "node:fs";

const D = "src/data/careernet";
const read = (f) => JSON.parse(readFileSync(`${D}/${f}`, "utf8"));
const jobs = read("jobs.json").jobs;
const majors = read("majors.json").majors;
const jd = read("job-detail.json");
const md = read("major-detail.json");

// 우리 직업 백과(51)·학과 백과(56)
const jobsTs = readFileSync("src/data/jobs.ts", "utf8");
const OUR_JOBS = [...jobsTs.matchAll(/id:\s*"([^"]+)",\s*name:\s*"([^"]+)"/g)].map((m) => ({ id: m[1], name: m[2] }));
const majorsTs = readFileSync("src/data/majors.ts", "utf8");
const OUR_MAJORS = [...majorsTs.matchAll(/M\(\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)"/g)].map((m) => ({ id: m[1], name: m[2], track: m[3] }));

// 커리어넷과 이어지지 않은 우리 직업·학과의 분류(커리어넷 분류에 맞춰 직접 지정)
const JOB_GROUP_FALLBACK = {
  "youth-leader": "교육·법률·사회복지·경찰·소방직 및 군인",
  entrepreneur: "경영·사무·금융·보험직",
  esports: "예술·디자인·방송·스포츠직",
  elevator: "설치·정비·생산직",
};
const TRACK_TO_FIELD = { hum: "인문계열", soc: "사회계열", biz: "사회계열", nat: "자연계열", ai: "공학계열", eng: "공학계열", med: "의약계열", edu: "교육계열", art: "예체능계열" };

const jobOur = Object.fromEntries(Object.entries(jd.map).map(([id, seq]) => [seq, id]));
const majorOur = Object.fromEntries(Object.entries(md.map).map(([id, seq]) => [seq, id]));
const short = (s, n = 70) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

// ── 직업
const jobDir = jobs.filter((j) => jd.detail[j.seq]).map((j) => ({ s: j.seq, n: j.name, g: j.group, f: j.field, w: short(j.work), o: jobOur[j.seq] ?? null }));
const ourUnlinked = OUR_JOBS.filter((o) => !jd.map[o.id]);
const jobGroups = {};
for (const j of jobDir) jobGroups[j.g] = (jobGroups[j.g] ?? 0) + 1;
for (const o of ourUnlinked) { const g = JOB_GROUP_FALLBACK[o.id]; if (g) jobGroups[g] = (jobGroups[g] ?? 0) + 1; }
const jobTotal = jobDir.length + ourUnlinked.length;

// ── 학과
const majorDir = majors.filter((m) => md.detail[m.seq]).map((m) => ({ s: m.seq, n: m.name, g: m.field, a: short(m.alias, 60), o: majorOur[m.seq] ?? null }));
const ourMajorUnlinked = OUR_MAJORS.filter((o) => !md.map[o.id]);
const majorGroups = {};
for (const m of majorDir) majorGroups[m.g] = (majorGroups[m.g] ?? 0) + 1;
for (const o of ourMajorUnlinked) { const g = TRACK_TO_FIELD[o.track]; if (g) majorGroups[g] = (majorGroups[g] ?? 0) + 1; }
const majorTotal = majorDir.length + ourMajorUnlinked.length;

const order = (o) => Object.fromEntries(Object.entries(o).sort((a, b) => b[1] - a[1]));
const summary = {
  fetchedAt: jd.fetchedAt,
  jobs: { total: jobTotal, deep: OUR_JOBS.length, careernet: jobDir.length, linked: Object.keys(jd.map).length, groups: order(jobGroups) },
  majors: { total: majorTotal, deep: OUR_MAJORS.length, careernet: majorDir.length, linked: Object.keys(md.map).length, groups: order(majorGroups) },
  ourJobGroups: Object.fromEntries(OUR_JOBS.map((o) => [o.id, jd.map[o.id] ? jobs.find((j) => j.seq === jd.map[o.id])?.group : JOB_GROUP_FALLBACK[o.id]])),
  ourMajorGroups: Object.fromEntries(OUR_MAJORS.map((o) => [o.id, md.map[o.id] ? majors.find((m) => m.seq === md.map[o.id])?.field : TRACK_TO_FIELD[o.track]])),
};
writeFileSync(`${D}/summary.json`, JSON.stringify(summary, null, 1) + "\n");
writeFileSync(`${D}/directory.json`, JSON.stringify({ fetchedAt: jd.fetchedAt, jobs: jobDir, majors: majorDir }) + "\n");
console.log("색인", `직업 ${jobTotal}개(심화 ${OUR_JOBS.length} + 커리어넷만 ${jobDir.length - Object.keys(jd.map).length})`, `학과 ${majorTotal}개`);
