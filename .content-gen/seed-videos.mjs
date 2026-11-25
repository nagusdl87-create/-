// fetch-videos.mjs의 "같은 분야 대체" 로직을 라이브 사이트의 현재 매칭 결과로 시험한다(키 없이)
import fs from "node:fs";
const live = JSON.parse(fs.readFileSync(".content-gen/live-videos.json", "utf8"));
const cnJobList = JSON.parse(fs.readFileSync("src/data/careernet/jobs.json", "utf8")).jobs;
const jmap = JSON.parse(fs.readFileSync("src/data/careernet/job-detail.json", "utf8")).map;
const gen = JSON.parse(fs.readFileSync("src/data/gen/jobs.json", "utf8")).map((g) => g.id);
const ours = [...fs.readFileSync("src/data/jobs.ts", "utf8").matchAll(/id:\s*"([^"]+)",\s*name:\s*"([^"]+)"/g)].map((m) => m[1]);
const allJobIds = [...new Set([...ours, ...gen])];
const norm = (t) => t.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase();
const cleanJobs = live.jobs;
const seqOf = (id) => (id.startsWith("cn-") ? +id.slice(3) : jmap[id]);
const cnBySeq = new Map(cnJobList.map((j) => [j.seq, j]));
const bigrams = (t) => { const n = norm(t); const r = new Set(); for (let i = 0; i < n.length - 1; i++) r.add(n.slice(i, i + 2)); return r; };
const sim = (a, b) => { const x = bigrams(a), y = bigrams(b); let c = 0; x.forEach((g) => y.has(g) && c++); return c / Math.max(1, Math.min(x.size, y.size)); };
const related = {}; let noCn = 0;
for (const id of allJobIds) {
  if (cleanJobs[id]?.length) continue;
  const me = cnBySeq.get(seqOf(id));
  if (!me) { noCn++; continue; }
  const pool = allJobIds.filter((o) => o !== id && cleanJobs[o]?.length && cnBySeq.get(seqOf(o))?.field === me.field);
  const pool2 = pool.length ? pool : allJobIds.filter((o) => o !== id && cleanJobs[o]?.length && cnBySeq.get(seqOf(o))?.group === me.group);
  const ranked = pool2.map((o) => ({ o, s: sim(me.name, cnBySeq.get(seqOf(o)).name) })).sort((a, b) => b.s - a.s);
  const seen = new Set(); const vids = [];
  for (const { o } of ranked) { const v = cleanJobs[o][0]; if (v && !seen.has(v.id)) { seen.add(v.id); vids.push({ ...v, from: o }); } if (vids.length >= 2) break; }
  if (vids.length) related[id] = { field: me.field, videos: vids.map(({from,...v})=>v) };
}
const out = { asOf: live.asOf, source: live.source, jobs: live.jobs, jobsRelated: related, majors: live.majors };
fs.writeFileSync("src/data/videos-auto.json", JSON.stringify(out) + String.fromCharCode(10));
const direct = allJobIds.filter((id) => cleanJobs[id]?.length).length;
console.log("전체", allJobIds.length, "직접", direct, "같은 분야 대체", Object.keys(related).length, "여전히 없음", allJobIds.length - direct - Object.keys(related).length, "(커리어넷 이름 못 찾음", noCn + ")");
