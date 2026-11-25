import fs from "node:fs";
const r = (f) => JSON.parse(fs.readFileSync(f, "utf8"));
const jobs = r("src/data/gen/jobs.json"), majors = r("src/data/gen/majors.json");
const names = fs.readFileSync("src/i18n/data/names.en.ts", "utf8") + fs.readFileSync("src/i18n/data/majors.en.ts", "utf8");
const baseMajorNames = new Set([...fs.readFileSync("src/data/majors.ts", "utf8").matchAll(/M\(\s*"([^"]+)",\s*"([^"]+)"/g)].map((m) => m[2]));
const genMajorNames = new Set(majors.map((m) => m.name));
const known = (n) => names.includes(`"${n}"`) || names.includes(`${n}:`) || baseMajorNames.has(n) || genMajorNames.has(n);
const extra = [...new Set(jobs.flatMap((j) => j.majors))].filter((n) => n && !known(n) && !/제한 없음|어떤 전공/.test(n)).sort();
const N = 25;
let jc = 0, mc = 0, ec = 0;
for (let i = 0; i < jobs.length; i += N) { jc++; fs.writeFileSync(`.content-gen/en-input/jobs-${400 + jc}.json`, JSON.stringify(jobs.slice(i, i + N).map((j) => ({ id: j.id, name: j.name, summary: j.summary, tasks: j.tasks, msActions: j.msActions })), null, 1)); }
for (let i = 0; i < majors.length; i += N) { mc++; fs.writeFileSync(`.content-gen/en-input/majors-${400 + mc}.json`, JSON.stringify(majors.slice(i, i + N).map((m) => ({ id: m.id, name: m.name, desc: m.desc, univ: m.univ, careers: m.careers })), null, 1)); }
for (let i = 0; i < extra.length; i += 80) { ec++; fs.writeFileSync(`.content-gen/en-input/extras-${400 + ec}.json`, JSON.stringify(extra.slice(i, i + 80).map((n) => ({ id: n, name: n })), null, 1)); }
console.log("jobs", jobs.length, "→", jc, "묶음 / majors", majors.length, "→", mc, "묶음 / extra major names", extra.length, "→", ec, "묶음");
