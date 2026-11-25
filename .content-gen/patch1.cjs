const fs=require("fs");let s=fs.readFileSync("scripts/video-match.mjs","utf8");
const rep=(a,b)=>{ if(!s.includes(a)) throw new Error("missing "+a.slice(0,60)); s=s.split(a).join(b); };
rep("const jobKw = { ...BASE_JOB_KW }, majorKw = { ...BASE_MAJOR_KW }, names = {};","const jobKw = { ...BASE_JOB_KW }, majorKw = { ...BASE_MAJOR_KW }, jobNames = {}, majorNames = {};");
rep("    names[id] = c.name;\n","    jobNames[id] = c.name;\n");
rep("    names[g.id] = g.name;\n    const base","    jobNames[g.id] = g.name;\n    const base");
rep("  for (const k of Object.keys(jobKw)) names[k] ??= k;\n  for (const k of Object.keys(majorKw)) names[k] ??= k;\n  return { jobKw, majorKw, names };","  for (const k of Object.keys(jobKw)) jobNames[k] ??= k;\n  for (const k of Object.keys(majorKw)) majorNames[k] ??= k;\n  return { jobKw, majorKw, jobNames, majorNames };");
rep('const sameStem = (a, b) => a === b || (a.length >= 2 && b.length >= 2 && (a + "학" === b || b + "학" === a || a + "공학" === b || b + "공학" === a));',
'const sameStem = (a, b, loose) => a === b || (a.length >= 2 && b.length >= 2 && (a + "학" === b || b + "학" === a || (loose && (a + "공학" === b || b + "공학" === a))));');
rep("  let raw = null;\n  if (m) raw = m[1];","  let raw = null, loose = false;\n  if (m) { raw = m[1]; loose = true; } // KEIS 학과정보는 계열 묶음이라 \"전기ㆍ전자공학\"이 전기공학과도 가리킨다");
rep('  return raw.split(/[ㆍ·,\/]/).map((x) => stem(norm(x.replace(/\([^)]*\)/g, "")))).filter(Boolean);','  const ps = raw.split(/[ㆍ·,\/]/).map((x) => stem(norm(x.replace(/\([^)]*\)/g, "")))).filter(Boolean);\n  ps.loose = loose;\n  return ps;');
rep("parts.some((p) => sameStem(p, stem(kk)))","parts.some((p) => sameStem(p, stem(kk), parts.loose))");
rep("    if (best > 0) scored.push({ v, s: best + v.bonus - Math.min(n.length, 60) / 200 });",
"    // 같은 점수면 회차·요약·VR판보다 본편 소개 영상을 먼저\n    const minor = /요약|\bvr\b|^\s*\d+회|\d+회\s|\s\d\s*$|final/i.test(v.title) ? 0.15 : 0;\n    if (best > 0) scored.push({ v, s: best + v.bonus - minor - Math.min(n.length, 60) / 200 });");
fs.writeFileSync("scripts/video-match.mjs",s);
let t=fs.readFileSync(".content-gen/test-match.mjs","utf8");
t=t.replace("const { jobKw, majorKw, names } = mod","const { jobKw, majorKw, jobNames, majorNames } = mod").replace("jobIds: Object.keys(jobKw), majorIds: Object.keys(majorKw), names };","jobIds: Object.keys(jobKw), majorIds: Object.keys(majorKw), names: jobNames, majorNames };");
t=t.replace("const { jobs, majors, jobIds, majorIds, names } = res;","const { jobs, majors, jobIds, majorIds, names } = res; const mn = res.majorNames ?? names;").replace('console.log("M", k, names[k]','console.log("M", k, mn[k]');
fs.writeFileSync(".content-gen/test-match.mjs",t);
