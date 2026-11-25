// 사용: node .content-gen/check.mjs jobs-301   (output/jobs-301.json 검사, input/jobs-301.json과 seq 대조)
import fs from "node:fs";
const name = process.argv[2]; const isJob = name.startsWith("jobs");
const out = JSON.parse(fs.readFileSync(`.content-gen/output/${name}.json`, "utf8"));
const inp = JSON.parse(fs.readFileSync(`.content-gen/input/${name}.json`, "utf8"));
const valid = new Set(fs.readFileSync(".content-gen/valid-subjects.txt", "utf8").split("\n"));
const FIELDS = ["life","sci","med","eng","art","media","env","law","edu","biz","it","sports"], HS = ["general","vocational","science","gifted","autonomous","meister","arts","foreign"];
const VALUES = ["stability","service","autonomy","knowledge","achievement","creativity","influence","income"], TRACKS = ["edu","soc","med","art","eng","ai","biz","hum","nat"], RI = ["R","I","A","S","E","C"];
const errs = []; const e = (s, m) => errs.push(`${s}: ${m}`);
const sset = new Set(inp.map((x) => x.seq)), got = new Set(out.map((x) => x.seq));
for (const s of sset) if (!got.has(s)) e(s, "빠짐");
for (const s of got) if (!sset.has(s)) e(s, "입력에 없는 번호");
if (out.length !== got.size) e("-", "번호 중복");
const arr = (v, a, b) => Array.isArray(v) && v.length >= a && v.length <= b;
const strs = (v) => v.every((x) => typeof x === "string" && x.trim());
const subj = (s, list) => list.forEach((x) => { if (!valid.has(x) && !/전문교과|희망 교과/.test(x)) e(s, `없는 과목 "${x}"`); });
for (const x of out) {
  const s = x.seq, b = x.base || {}, d = x.deep || {};
  if (isJob) {
    if (!b.emoji) e(s, "emoji"); if (!FIELDS.includes(b.field)) e(s, "field=" + b.field);
    if (!arr(b.riasec, 1, 3) || !b.riasec.every((v) => RI.includes(v))) e(s, "riasec 1~3개(R I A S E C)");
    if (!arr(b.values, 2, 3) || !b.values.every((v) => VALUES.includes(v))) e(s, "values 2~3개");
    if (!b.summary || b.summary.length > 80) e(s, "summary 1문장(80자 이하)");
    if (!arr(b.tasks, 3, 3) || !strs(b.tasks)) e(s, "tasks 3개"); if (!arr(b.majors, 1, 6)) e(s, "majors");
    if (!arr(b.hsSubjects, 4, 6)) e(s, "hsSubjects 4~6개"); else subj(s, b.hsSubjects);
    if (!arr(b.hsTypes, 1, 5) || !b.hsTypes.every((v) => HS.includes(v))) e(s, "hsTypes");
    if (!arr(b.msActions, 3, 3) || !strs(b.msActions)) e(s, "msActions 3개");
    if (!d.intro || d.intro.length < 40) e(s, "intro 짧음"); if (!arr(d.work, 5, 7) || !strs(d.work)) e(s, "work 5~7개");
    if (!arr(d.day, 4, 4) || !d.day.every((v) => v.t && v.d)) e(s, "day 4단계{t,d}");
    if (!arr(d.skills, 4, 5) || !d.skills.every((v) => v.k && v.why)) e(s, "skills 4~5개{k,why}");
    for (const k of ["env", "edu", "growth", "future"]) if (!d[k] || d[k].length < 20) e(s, k + " 짧음");
    if (!arr(d.hs, 3, 4) || !strs(d.hs)) e(s, "hs 3~4개"); if (!arr(d.faq, 2, 3) || !d.faq.every((v) => v.q && v.a)) e(s, "faq 2~3개{q,a}");
  } else {
    if (!TRACKS.includes(b.track)) e(s, "track=" + b.track); if (!b.desc || b.desc.length > 100) e(s, "desc 1문장(100자 이하)");
    if (!arr(b.univ, 3, 6) || !strs(b.univ)) e(s, "univ 3~6개"); if (!arr(b.core, 2, 4)) e(s, "core 2~4개"); else subj(s, b.core);
    if (!arr(b.rec, 3, 6)) e(s, "rec 3~6개"); else subj(s, b.rec); if (!arr(b.careers, 3, 6) || !strs(b.careers)) e(s, "careers 3~6개");
    if (!d.intro || d.intro.length < 40) e(s, "intro 짧음"); if (!arr(d.questions, 3, 3) || !strs(d.questions)) e(s, "questions 3개");
    if (!arr(d.tracks, 3, 5) || !d.tracks.every((v) => v.name && v.d)) e(s, "tracks 3~5개{name,d}");
    if (!arr(d.years, 4, 4) || !strs(d.years)) e(s, "years 4단계"); if (!arr(d.skills, 3, 4) || !strs(d.skills)) e(s, "skills 3~4개(문자열)");
    if (!arr(d.compare, 1, 2) || !d.compare.every((v) => v.with && v.diff)) e(s, "compare 1~2개{with,diff}");
    if (!d.after || d.after.length < 30) e(s, "after 짧음"); if (!arr(d.hs, 3, 3) || !strs(d.hs)) e(s, "hs 3개"); if (!arr(d.faq, 2, 3) || !d.faq.every((v) => v.q && v.a)) e(s, "faq 2~3개{q,a}");
  }
}
if (errs.length) { console.log(errs.length + "건 고칠 것:\n" + errs.join("\n")); process.exit(1); } else console.log(`OK ${name}: ${out.length}건`);
