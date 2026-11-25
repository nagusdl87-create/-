import { readFileSync } from "node:fs";
const R = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), "utf8"));
const auto = R("../src/data/videos-auto.json");
const n = await import("../scripts/video-match.mjs");
const titles = new Map();
for (const m of [auto.jobs, auto.majors]) for (const vs of Object.values(m)) for (const v of vs) titles.set(v.id, v.title);
const { jobKw, jobNames } = n.buildKeywords(R);
const bi = (t) => { const s = n.norm(t), r = new Set(); for (let i = 0; i < s.length - 1; i++) r.add(s.slice(i, i + 2)); return r; };
const sim = (a, b) => { const x = bi(a), y = bi(b); let c = 0; x.forEach((g) => y.has(g) && c++); return c / Math.max(1, Math.min(x.size, y.size)); };
const ok = [...titles].map(([id, title]) => ({ id, title, bonus: 0 }));
let out = 0;
for (const [id, kw] of Object.entries(jobKw)) {
  if (n.pick(ok, kw).length) continue;
  let best = null;
  for (const [, t] of titles) { const core = t.replace(/\[[^\]]*\]/g, "").split(/[_\-]/).map((x) => x.trim()).filter((x) => x.length > 1).pop() ?? t; const s = sim(jobNames[id] ?? id, core); if (s >= 0.7 && (!best || s > best.s)) best = { s, t }; }
  if (best) { console.log(id, jobNames[id], "~", best.t, best.s.toFixed(2)); out++; }
}
console.log("근접 후보", out);
