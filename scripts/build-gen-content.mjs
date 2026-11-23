// 커리어넷 직업·학과 심화 글(.content-gen/output/*.json, 커리어넷 자료를 근거로 작성) → src/data/gen/*.json
// 직업 id는 `cn-커리어넷번호`, 학과 id도 `cn-커리어넷번호`. 직접 실행: node scripts/build-gen-content.mjs
// 만든 파일은 저장소에 커밋한다(.content-gen 폴더는 작업용이라 저장소 밖).
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";

const OUT = ".content-gen/output";
const CN = "src/data/careernet";
const G = "src/data/gen";
mkdirSync(G, { recursive: true });
const cnJobs = new Map(JSON.parse(readFileSync(`${CN}/jobs.json`, "utf8")).jobs.map((j) => [j.seq, j]));
const cnMajors = new Map(JSON.parse(readFileSync(`${CN}/majors.json`, "utf8")).majors.map((m) => [m.seq, m]));
// 이름을 인자로 주면(예: jobs-301 majors-301) 그 파일만 반영한다. 인자가 없으면 작업 폴더의 모든 파일을 반영한다
const only = process.argv.slice(2);
const files = existsSync(OUT) ? readdirSync(OUT).filter((f) => /^(jobs|majors)-\d+\.json$/.test(f) && (!only.length || only.includes(f.replace(/\.json$/, "")))).sort() : [];

// 이미 반영된 글(src/data/gen)을 먼저 불러와 유지하고, 작업 폴더의 새 글을 같은 id로 덮어쓰거나 더한다
const load = (f, d) => (existsSync(`${G}/${f}`) ? JSON.parse(readFileSync(`${G}/${f}`, "utf8")) : d);
const jobsMap = new Map(load("jobs.json", []).map((x) => [x.id, x]));
const majorsMap = new Map(load("majors.json", []).map((x) => [x.id, x]));
const jobDeep = load("jobs-deep.json", {}), majorDeep = load("majors-deep.json", {});
const jobs = [], majors = [];
for (const f of files) {
  const arr = JSON.parse(readFileSync(`${OUT}/${f}`, "utf8"));
  for (const x of arr) {
    if (f.startsWith("jobs-")) {
      const c = cnJobs.get(x.seq);
      if (!c) continue;
      const id = `cn-${x.seq}`;
      jobsMap.set(id, { id, name: c.name, ...x.base });
      jobDeep[id] = x.deep;
    } else {
      const c = cnMajors.get(x.seq);
      if (!c) continue;
      const id = `cn-${x.seq}`;
      majorsMap.set(id, { id, name: c.name, ...x.base });
      majorDeep[id] = x.deep;
    }
  }
}
jobs.push(...jobsMap.values());
majors.push(...majorsMap.values());

// 학과의 관련 직업(jobs: 직업 id) — 진출 분야 이름과 직업 이름이 같으면 잇는다(기존 51 + 새 직업)
const ourJobsTs = readFileSync("src/data/jobs.ts", "utf8");
const allJobNames = [
  ...[...ourJobsTs.matchAll(/id:\s*"([^"]+)",\s*name:\s*"([^"]+)"/g)].map((m) => ({ id: m[1], name: m[2] })),
  ...jobs.map((j) => ({ id: j.id, name: j.name })),
];
const norm = (s) => String(s).replace(/[\s·ㆍ()]/g, "");
const byName = new Map(allJobNames.map((j) => [norm(j.name), j.id]));
for (const m of majors) {
  m.jobs = [...new Set(m.careers.map((c) => byName.get(norm(c))).filter(Boolean))].slice(0, 6);
}

const save = (f, o) => writeFileSync(`${G}/${f}`, JSON.stringify(o) + "\n");
save("jobs.json", jobs);
save("jobs-deep.json", jobDeep);
save("majors.json", majors);
save("majors-deep.json", majorDeep);
console.log("심화 글 반영", `직업 ${jobs.length}개`, `학과 ${majors.length}개`);

// 목록 화면이 어떤 직업·학과를 "심화"로 보여 줄지는 색인(directory.json·summary.json)이 정하므로 반영 직후 색인도 다시 만든다
import { execFileSync } from "node:child_process";
execFileSync(process.execPath, ["scripts/build-careernet-index.mjs"], { stdio: "inherit" });
