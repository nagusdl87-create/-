import fs from "node:fs";
const name = process.argv[2];
const out = JSON.parse(fs.readFileSync(`.content-gen/en-output/${name}.json`, "utf8"));
const inp = JSON.parse(fs.readFileSync(`.content-gen/en-input/${name}.json`, "utf8"));
const errs = []; const e = (id, m) => errs.push(`${id}: ${m}`);
const hangul = (s) => /[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(s);
const ok = (s) => typeof s === "string" && s.trim().length > 0 && !hangul(s);
if (out.length !== inp.length) e("-", `개수 ${out.length} ≠ ${inp.length}`);
inp.forEach((a, i) => {
  const b = out[i]; if (!b) return e(a.id, "빠짐");
  if (b.id !== a.id) e(a.id, `id 순서/값 다름: ${b.id}`);
  if (!ok(b.name) || b.name.length > 90) e(a.id, "name 비었거나 한글 있거나 너무 김");
  if (name.startsWith("jobs")) {
    if (!ok(b.summary)) e(a.id, "summary");
    for (const k of ["tasks", "msActions"]) { if (!Array.isArray(b[k]) || b[k].length !== a[k].length) e(a.id, `${k} 개수 ${b[k]?.length} ≠ ${a[k].length}`); else b[k].forEach((s, j) => { if (!ok(s)) e(a.id, `${k}[${j}]`); }); }
  } else if (name.startsWith("majors")) {
    if (!ok(b.desc)) e(a.id, "desc");
    for (const k of ["univ", "careers"]) { if (!Array.isArray(b[k]) || b[k].length !== a[k].length) e(a.id, `${k} 개수 ${b[k]?.length} ≠ ${a[k].length}`); else b[k].forEach((s, j) => { if (!ok(s)) e(a.id, `${k}[${j}]`); }); }
  }
});
if (errs.length) { console.log(errs.length + "건 고칠 것:\n" + errs.slice(0, 40).join("\n")); process.exit(1); } else console.log(`OK ${name}: ${out.length}건`);
