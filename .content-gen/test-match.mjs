// 오프라인 매칭 시뮬레이션: videos-auto.json의 영상 제목 풀로 직접 매칭 수를 센다
import { readFileSync } from "node:fs";
const R = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), "utf8"));
const auto = R("../src/data/videos-auto.json");
const pool = new Map();
for (const m of [auto.jobs, auto.majors, ...Object.values(auto.jobsRelated).map((r) => ({ x: r.videos }))])
  for (const vs of Object.values(m)) for (const v of vs) pool.set(v.id, v);
const bonus = { "한국고용정보원 직업진로동영상": 0.5, "한국고용정보원": 0.2, "교육부": 0.4 };
const all = [...pool.values()].map((v) => ({ ...v, bonus: bonus[v.channel] ?? 0.3 }));
const mod = await import(process.argv[2] ?? "../scripts/video-match.mjs");
let res;
if (mod.run) res = mod.run(all, { R });
else {
  const { jobKw, majorKw, jobNames, majorNames } = mod.buildKeywords(R, { rich: process.env.RICH !== "0" });
  const ok = all.filter((v) => !mod.EXCLUDE.test(v.title));
  res = { jobs: Object.fromEntries(Object.entries(jobKw).map(([id, kw]) => [id, mod.pick(ok, kw)])), majors: Object.fromEntries(Object.entries(majorKw).map(([id, kw]) => [id, mod.pick(ok, kw, true)])), jobIds: Object.keys(jobKw), majorIds: Object.keys(majorKw), names: jobNames, majorNames };
}
const { jobs, majors, jobIds, majorIds, names } = res; const mn = res.majorNames ?? names;
const j = Object.keys(jobs).filter((k) => jobs[k].length), m = Object.keys(majors).filter((k) => majors[k].length);
console.log(`풀 ${all.length}개 / 직업 직접 ${j.length}/${jobIds.length} / 학과 직접 ${m.length}/${majorIds.length}`);
if (process.argv[3]) {
  const base = JSON.parse(readFileSync(process.argv[3], "utf8"));
  const nj = j.filter((k) => !base.jobs.includes(k)), nm = m.filter((k) => !base.majors.includes(k));
  console.log("새 직업", nj.length, "새 학과", nm.length);
  for (const k of nj) console.log("J", k, names[k], "=>", jobs[k].map((v) => v.title).join(" / "));
  for (const k of m.filter((k) => !base.majors.includes(k))) console.log("M", k, mn[k], "=>", majors[k].map((v) => v.title).join(" / "));
  // 기존 직업에서 달라진 첫 영상
  for (const k of j.filter((k) => base.jobs.includes(k) && base.first[k] !== jobs[k][0].title)) console.log("CHG", k, names[k], base.first[k], "->", jobs[k][0].title);
}
import { writeFileSync } from "node:fs";
if (process.env.DUMP) writeFileSync(process.env.DUMP, JSON.stringify({ jobs: j, majors: m, first: Object.fromEntries(j.map((k) => [k, jobs[k][0].title])) }));
