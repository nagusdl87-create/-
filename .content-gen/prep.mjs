import fs from "node:fs";
const r = (f) => JSON.parse(fs.readFileSync(f, "utf8"));
const jd = r("src/data/careernet/job-detail.json"), md = r("src/data/careernet/major-detail.json");
const gj = new Set(r("src/data/gen/jobs.json").map((x) => x.id)), gm = new Set(r("src/data/gen/majors.json").map((x) => x.id));
const w201 = new Set(r(".content-gen/output/jobs-201.json").map((x) => "cn-" + x.seq));
const linkedJ = new Set(Object.values(jd.map)), linkedM = new Set(Object.values(md.map || {}));
const jobs = r("src/data/careernet/jobs.json").jobs.filter((j) => !gj.has("cn-" + j.seq) && !w201.has("cn-" + j.seq) && !linkedJ.has(j.seq));
const majors = r("src/data/careernet/majors.json").majors.filter((m) => !gm.has("cn-" + m.seq) && !linkedM.has(m.seq));
const cut = (s, n) => (s && s.length > n ? s.slice(0, n) + "…" : s);
const jobItem = (j) => { const d = jd.detail[j.seq] || {}; return { seq: j.seq, name: j.name, 분류: j.group, 하는일: d.work, 적성: d.aptitude, 흥미: d.interest, 능력: d.abilities, 탐색활동: d.research, 학력: d.curriculum, 자격설명: d.certificate, 관련학과: d.majors, 자격: d.certs, 전망: (d.forecast || []).map((x) => cut(x, 350)) }; };
const majorItem = (m) => { const d = md.detail[m.seq] || {}; return { seq: m.seq, name: m.name, 계열: m.field, 개요: cut(d.summary, 500), 흥미적성: cut(d.interest, 300), 관련직업: d.jobs, 자격: d.qualifications, 고교과목2022: d.subjects2022, 진출분야: (d.fields || []).map((x) => x.name + ": " + cut(x.desc, 120)), 탐색활동: (d.activities || []).map((x) => x.name), 주요교과목: (d.mainSubjects || []).map((x) => x.name) }; };
const N = 20; let jc = 0, mc = 0;
for (let i = 0; i < jobs.length; i += N) { jc++; fs.writeFileSync(`.content-gen/input/jobs-${String(300 + jc).padStart(3, "0")}.json`, JSON.stringify(jobs.slice(i, i + N).map(jobItem), null, 1)); }
for (let i = 0; i < majors.length; i += N) { mc++; fs.writeFileSync(`.content-gen/input/majors-${String(300 + mc).padStart(3, "0")}.json`, JSON.stringify(majors.slice(i, i + N).map(majorItem), null, 1)); }
console.log("jobs", jobs.length, "→", jc, "chunks; majors", majors.length, "→", mc, "chunks");
