// 데이터 무결성 검사: npx tsx scripts/validate-data.ts
import { SUBJECT_MAP, TRACKS, SUBJECTS } from "../src/data/subjects";
import { JOBS, JOB_MAP } from "../src/data/jobs";
import { MAJORS } from "../src/data/majors";
import { JOB_DETAILS } from "../src/data/jobDetails";
import { MAJOR_DETAILS } from "../src/data/majorDetails";
import { JOB_DEEP, MAJOR_DEEP } from "../src/data/deep";
import { SAMPLE_CURRICULUM, SEM_KEYS } from "../src/data/curriculum";
import { GN_INDUSTRIES, GN_SCHOOLS, EXPERIENCE_SCHOOLS, GENERAL_WITH_VOC } from "../src/data/gn";
import { readdirSync } from "node:fs";
import { join } from "node:path";
const errs: string[] = [];
const subj = (s: string, w: string) => { if (!SUBJECT_MAP[s] && !/전문교과|희망 교과/.test(s)) errs.push(`과목 없음: ${s} (${w})`); };
SUBJECTS.forEach((s) => s.prereq?.forEach((p) => subj(p, "선수:" + s.name)));
Object.entries(TRACKS).forEach(([k, t]) => [...t.core, ...t.rec].forEach((s) => subj(s, "계열:" + k)));
JOBS.forEach((j) => j.hsSubjects.forEach((s) => subj(s, "직업:" + j.id)));
MAJORS.forEach((m) => { [...m.core, ...m.rec].forEach((s) => subj(s, "학과:" + m.id)); m.jobs.forEach((j) => JOB_MAP[j] || errs.push(`직업 없음: ${j} (학과:${m.id})`)); });
const names = new Set(GN_SCHOOLS.map((s) => s.name));
GN_INDUSTRIES.forEach((i) => { i.schools.forEach((s) => names.has(s) || errs.push(`학교 없음: ${s}`)); i.jobs.forEach((j) => JOB_MAP[j] || errs.push(`직업 없음: ${j}`)); });
[...EXPERIENCE_SCHOOLS, ...GENERAL_WITH_VOC.map((g) => g.school)].forEach((s) => names.has(s) || errs.push(`학교 없음: ${s}`));
SEM_KEYS.forEach((s) => { const c = SAMPLE_CURRICULUM.sems[s]; [...c.fixed, ...c.groups.flatMap((g) => g.options)].forEach((i) => subj(i.name, "예시편제표:" + s)); });
const ids = JOBS.map((j) => j.id); ids.forEach((id, i) => ids.indexOf(id) !== i && errs.push("중복 직업 " + id));
JOBS.forEach((j) => JOB_DETAILS[j.id] || errs.push(`직업 상세 없음: ${j.id}`));
MAJORS.forEach((m) => MAJOR_DETAILS[m.id] || errs.push(`학과 상세 없음: ${m.id}`));
// 콘텐츠 기준(docs/content-standard.md) 검사
const need = (who: string, ok: boolean, what: string) => { if (!ok) errs.push(`${who}: ${what}`); };
const NUM = /\d{2,}\s*(만\s*원|원|%|퍼센트|명 중)/; // 지어낸 수치 의심(임금·비율)
JOBS.forEach((j) => {
  const d = JOB_DEEP[j.id]; const w = `직업 ${j.id}`;
  if (!d) return errs.push(`${w}: 상세 콘텐츠 없음`);
  need(w, d.intro.length >= 40, "소개 짧음"); need(w, d.work.length >= 5 && d.work.length <= 7, "하는 일 5~7개");
  need(w, d.day.length === 4, "하루 흐름 4단계"); need(w, d.skills.length >= 4, "지식·능력 4개 이상");
  need(w, !!d.env && !!d.edu && !!d.growth && !!d.future, "환경·학력·경력·기술 변화"); need(w, d.hs.length >= 3, "고교 활동 3개 이상"); need(w, d.faq.length >= 2, "FAQ 2개 이상");
  if (NUM.test(JSON.stringify(d))) errs.push(`${w}: 수치 표현 확인 필요(임금·비율)`);
});
MAJORS.forEach((m) => {
  const d = MAJOR_DEEP[m.id]; const w = `학과 ${m.id}`;
  if (!d) return errs.push(`${w}: 상세 콘텐츠 없음`);
  need(w, d.intro.length >= 40, "소개 짧음"); need(w, d.questions.length === 3, "질문 3개"); need(w, d.tracks.length >= 3, "세부 전공 3개 이상");
  need(w, d.years.length === 4, "학년별 4단계"); need(w, d.skills.length >= 3, "능력 3개 이상"); need(w, d.compare.length >= 1, "비교 1개 이상");
  need(w, !!d.after, "졸업 후"); need(w, d.hs.length === 3, "탐구 주제 3개"); need(w, d.faq.length >= 2, "FAQ 2개 이상");
  if (NUM.test(JSON.stringify(d))) errs.push(`${w}: 수치 표현 확인 필요(임금·비율)`);
});
console.log(`과목 ${SUBJECTS.length} · 직업 ${JOBS.length} · 학과 ${MAJORS.length} · 경남 고교 ${GN_SCHOOLS.length}`);
console.log(errs.length ? errs.join("\n") : "OK");
process.exit(errs.length ? 1 : 0);
