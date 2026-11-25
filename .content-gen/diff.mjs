import { readFileSync } from "node:fs";
const R = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), "utf8"));
const auto = R("../src/data/videos-auto.json");
const pool = new Map();
for (const m of [auto.jobs, auto.majors, ...Object.values(auto.jobsRelated).map((r) => ({ x: r.videos }))]) for (const vs of Object.values(m)) for (const v of vs) pool.set(v.id, v);
const bonus = { "한국고용정보원 직업진로동영상": 0.5, "한국고용정보원": 0.2, "교육부": 0.4 };
const all = [...pool.values()].map((v) => ({ ...v, bonus: bonus[v.channel] ?? 0.3 }));
const o = (await import("./old-match.mjs")).run(all, { R });
const n = await import("../scripts/video-match.mjs");
const { jobKw, majorKw, jobNames, majorNames } = n.buildKeywords(R);
const ok = all.filter((v) => !n.EXCLUDE.test(v.title));
const nj = Object.fromEntries(Object.entries(jobKw).map(([id, kw]) => [id, n.pick(ok, kw)]));
const nm = Object.fromEntries(Object.entries(majorKw).map(([id, kw]) => [id, n.pick(ok, kw, true)]));
const mode = process.argv[2];
for (const [label, a, b, nm_] of [["J", o.jobs, nj, jobNames], ["M", o.majors, nm, majorNames]]) {
  for (const k of Object.keys(a)) {
    const x = a[k].map((v) => v.title), y = (b[k] ?? []).map((v) => v.title);
    if (mode === "lost" && x.length && !y.length) console.log(label, "LOST", k, nm_[k] ?? "", "|", x.slice(0, 2).join(" / "));
    if (mode === "set") { const rem = x.filter((t) => !y.includes(t)), add = y.filter((t) => !x.includes(t)); if (x.length && y.length && (rem.length || add.length)) console.log(label, k, nm_[k] ?? "", "- ", rem.join(" / "), " + ", add.join(" / ")); }
  }
}
