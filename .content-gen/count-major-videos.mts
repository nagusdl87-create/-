const a: any = await import("../src/data/majors");
const b: any = await import("../src/data/videos");
const MAJORS = a.MAJORS ?? a.default?.MAJORS ?? a["module.exports"]?.MAJORS;
const majorVideoSet = b.majorVideoSet ?? b.default?.majorVideoSet ?? b["module.exports"]?.majorVideoSet;
const c: Record<string, number> = {}; let zero = 0;
for (const m of MAJORS) { const r = majorVideoSet(m, MAJORS); c[r.kind] = (c[r.kind] || 0) + 1; if (!r.videos.length) zero++; }
console.log(MAJORS.length, c, "영상 0개:", zero);
