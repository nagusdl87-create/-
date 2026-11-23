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
const files = existsSync(OUT) ? readdirSync(OUT).filter((f) => /^(jobs|majors)-\d+\.json$/.test(f)).sort() : [];

const jobs = [], jobDeep = {}, majors = [], majorDeep = {};
for (const f of files) {
  const arr = JSON.parse(readFileSync(`${OUT}/${f}`, "utf8"));
  for (const x of arr) {
    if (f.startsWith("jobs-")) {
      const c = cnJobs.get(x.seq);
      if (!c) continue;
      const id = `cn-${x.seq}`;
      jobs.push({ id, name: c.name, ...x.base });
      jobDeep[id] = x.deep;
    } else {
      const c = cnMajors.get(x.seq);
      if (!c) continue;
      const id = `cn-${x.seq}`;
      majors.push({ id, name: c.name, ...x.base });
      majorDeep[id] = x.deep;
    }
  }
}

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
