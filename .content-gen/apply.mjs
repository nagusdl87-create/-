import { readFileSync, writeFileSync } from "node:fs";
import { buildKeywords, buildRelated, pick, EXCLUDE } from "../scripts/video-match.mjs";
const R = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), "utf8"));
const auto = R("../src/data/videos-auto.json");
const pool = new Map();
for (const m of [auto.jobs, auto.majors, ...Object.values(auto.jobsRelated).map((r) => ({ x: r.videos }))]) for (const vs of Object.values(m)) for (const v of vs) pool.set(v.id, v);
const bonus = { "한국고용정보원 직업진로동영상": 0.5, "한국고용정보원": 0.2, "교육부": 0.4 };
const all = [...pool.values()].filter((v) => !EXCLUDE.test(v.title)).map((v) => ({ ...v, bonus: bonus[v.channel] ?? 0.3 }));
const { jobKw, majorKw } = buildKeywords(R);
const strip = ({ id, title, channel }) => ({ id, title, channel });
const upd = (old, kws, isMajor) => {
  const out = {};
  for (const [id, kw] of Object.entries(kws)) {
    const nw = pick(all, kw, isMajor).map(strip);
    const keep = (old[id] ?? []).filter((v) => nw.some((n) => n.id === v.id));
    const list = old[id] ? keep : nw.slice(0, 3);
    if (list.length) out[id] = list;
  }
  return out;
};
const jobs = upd(auto.jobs, jobKw, false), majors = upd(auto.majors, majorKw, true);
const related = buildRelated(jobs, Object.keys(jobKw), R("../src/data/careernet/jobs.json").jobs, R("../src/data/careernet/job-detail.json").map);
const cnt = (o) => Object.keys(o).length;
console.log("직업 직접", cnt(auto.jobs), "->", cnt(jobs), "| 같은 분야", cnt(auto.jobsRelated), "->", cnt(related), "| 학과", cnt(auto.majors), "->", cnt(majors));
if (process.argv[2] === "write") writeFileSync(new URL("../src/data/videos-auto.json", import.meta.url), JSON.stringify({ ...auto, jobs, jobsRelated: related, majors }, null, 1) + "\n");
