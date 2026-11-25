// 사용: node .content-gen/en-merge.mjs [이름...]  (없으면 en-output의 모든 파일). 결과: src/i18n/data/jobs.gen.en.ts, majors.gen.en.ts
import fs from "node:fs";
const only = process.argv.slice(2);
const files = fs.readdirSync(".content-gen/en-output").filter((f) => /^(jobs|majors|extras)-\d+\.json$/.test(f) && (!only.length || only.includes(f.replace(/\.json$/, "")))).sort();
const jobs = {}, majors = {}, extras = {};
for (const f of files) {
  const arr = JSON.parse(fs.readFileSync(`.content-gen/en-output/${f}`, "utf8"));
  for (const x of arr) {
    if (f.startsWith("jobs-")) jobs[x.id] = { name: x.name, summary: x.summary, tasks: x.tasks, msActions: x.msActions };
    else if (f.startsWith("majors-")) majors[x.id] = { name: x.name, desc: x.desc, univ: x.univ, careers: x.careers };
    else extras[x.id] = x.name;
  }
}
const J = (o, ind = "  ") => Object.entries(o).map(([k, v]) => `${ind}${JSON.stringify(k)}: ${JSON.stringify(v)},`).join("\n");
fs.writeFileSync("src/i18n/data/jobs.gen.en.ts", `// 영어 자료: 커리어넷 심화 직업(id: cn-번호) 이름·요약·할 일·중학생 활동. scripts 아님 — .content-gen/en-merge.mjs가 만든 파일(손으로 고쳐도 됨)\nimport type { JobEn } from "./jobs.en";\n\nexport const JOBS_EN_GEN: Record<string, JobEn> = {\n${J(jobs)}\n};\n`);
fs.writeFileSync("src/i18n/data/majors.gen.en.ts", `// 영어 자료: 커리어넷 심화 학과(id: cn-번호) 이름·설명·대학 교과목·진출 분야, 직업 화면에만 나오는 학과 이름\nimport type { MajorEn } from "./majors.en";\n\nexport const MAJORS_EN_GEN: Record<string, MajorEn> = {\n${J(majors)}\n};\n\nexport const EXTRA_MAJOR_NAMES_GEN: Record<string, string> = {\n${J(extras)}\n};\n`);
console.log("직업", Object.keys(jobs).length, "학과", Object.keys(majors).length, "이름 목록", Object.keys(extras).length);
