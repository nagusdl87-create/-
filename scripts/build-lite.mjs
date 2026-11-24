// 직업·학과 목록 화면용 얇은 요약을 만든다. 전체 자료(src/data/gen/jobs.json·majors.json)는 크기가 커서,
// 목록 첫 화면에는 카드에 보이는 항목만 담은 요약(src/data/lite/*.json)을 쓰고 전체는 검색어를 입력할 때 불러온다.
// npm run build 직전에 자동 실행된다(prebuild). 직접 실행: node scripts/build-lite.mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => JSON.parse(readFileSync(join(root, p), "utf8"));
mkdirSync(join(root, "src/data/lite"), { recursive: true });

function write(p, data) {
  const out = JSON.stringify(data);
  const f = join(root, p);
  if (!existsSync(f) || readFileSync(f, "utf8") !== out) writeFileSync(f, out);
  console.log(`${p}: ${data.length}개, ${(out.length / 1024).toFixed(1)}KB`);
}

write("src/data/lite/jobs-gen.json", read("src/data/gen/jobs.json").map((j) => ({ id: j.id, name: j.name, emoji: j.emoji, field: j.field, riasec: j.riasec, values: j.values, summary: j.summary })));
write("src/data/lite/majors-gen.json", read("src/data/gen/majors.json").map((m) => ({ id: m.id, name: m.name, track: m.track, desc: m.desc, core: m.core.slice(0, 4), jobs: m.jobs })));

const names = Object.fromEntries(read("src/data/gen/jobs.json").map((j) => [j.id, j.name]));
const nf = join(root, "src/data/lite/job-names-gen.json");
const nout = JSON.stringify(names);
if (!existsSync(nf) || readFileSync(nf, "utf8") !== nout) writeFileSync(nf, nout);
console.log(`src/data/lite/job-names-gen.json: ${Object.keys(names).length}개`);
