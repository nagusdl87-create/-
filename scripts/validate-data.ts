// 데이터 무결성 검사: npx tsx scripts/validate-data.ts
import { SUBJECT_MAP, TRACKS, SUBJECTS } from "../src/data/subjects";
import { JOBS, JOB_MAP } from "../src/data/jobs";
import { MAJORS } from "../src/data/majors";
import { GN_INDUSTRIES, GN_SCHOOLS, EXPERIENCE_SCHOOLS, GENERAL_WITH_VOC } from "../src/data/gn";
const errs: string[] = [];
const subj = (s: string, w: string) => { if (!SUBJECT_MAP[s] && !/전문교과|희망 교과/.test(s)) errs.push(`과목 없음: ${s} (${w})`); };
SUBJECTS.forEach((s) => s.prereq?.forEach((p) => subj(p, "선수:" + s.name)));
Object.entries(TRACKS).forEach(([k, t]) => [...t.core, ...t.rec].forEach((s) => subj(s, "계열:" + k)));
JOBS.forEach((j) => j.hsSubjects.forEach((s) => subj(s, "직업:" + j.id)));
MAJORS.forEach((m) => { [...m.core, ...m.rec].forEach((s) => subj(s, "학과:" + m.id)); m.jobs.forEach((j) => JOB_MAP[j] || errs.push(`직업 없음: ${j} (학과:${m.id})`)); });
const names = new Set(GN_SCHOOLS.map((s) => s.name));
GN_INDUSTRIES.forEach((i) => { i.schools.forEach((s) => names.has(s) || errs.push(`학교 없음: ${s}`)); i.jobs.forEach((j) => JOB_MAP[j] || errs.push(`직업 없음: ${j}`)); });
[...EXPERIENCE_SCHOOLS, ...GENERAL_WITH_VOC.map((g) => g.school)].forEach((s) => names.has(s) || errs.push(`학교 없음: ${s}`));
const ids = JOBS.map((j) => j.id); ids.forEach((id, i) => ids.indexOf(id) !== i && errs.push("중복 직업 " + id));
console.log(`과목 ${SUBJECTS.length} · 직업 ${JOBS.length} · 학과 ${MAJORS.length} · 경남 고교 ${GN_SCHOOLS.length}`);
console.log(errs.length ? errs.join("\n") : "OK");
process.exit(errs.length ? 1 : 0);
