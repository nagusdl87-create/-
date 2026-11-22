"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { JOBS } from "@/data/jobs";
import { MAJORS } from "@/data/majors";
import { SUBJECTS } from "@/data/subjects";
import { GN_SCHOOLS, KIND_INFO } from "@/data/gn";
import { useLang, useT } from "@/lib/i18n";

const POPULAR = ["컴퓨터공학과", "미적분Ⅱ", "의예과", "인공지능 수학", "로봇", "생명과학", "경영학과", "항공", "간호", "마이스터고"];
type Cat = "all" | "majors" | "subjects" | "jobs" | "schools";

export function searchAll(q: string, extra: string[] = []) {
  const terms = [q.toLowerCase(), ...extra];
  const has = (...s: string[]) => { const txt = s.join(" ").toLowerCase(); return terms.some((x) => txt.includes(x)); };
  return {
    majors: MAJORS.filter((m) => has(m.name, m.desc, ...m.core, ...m.rec, ...m.careers)).map((m) => ({ href: `/majors/${m.id}`, t: m.name, s: `핵심: ${m.core.slice(0, 3).join(", ")}` })),
    subjects: SUBJECTS.filter((s) => has(s.name, s.desc)).map((s) => ({ href: `/subjects#${encodeURIComponent(s.name)}`, t: s.name, s: `${s.group} · ${s.cat} · ${s.credits}학점 · ${s.eval}` })),
    jobs: JOBS.filter((j) => has(j.name, j.summary, ...j.majors, ...j.hsSubjects)).map((j) => ({ href: `/jobs/${j.id}`, t: `${j.emoji} ${j.name}`, s: j.summary })),
    schools: GN_SCHOOLS.filter((s) => has(s.name, s.region, s.addr, ...s.depts.map((d) => d.name))).map((s) => ({ href: `/schools#${s.id}`, t: s.name, s: `${s.region} · ${KIND_INFO[s.kind].name}${s.depts.length ? ` · ${s.depts.map((d) => d.name).slice(0, 3).join(", ")}` : ""}` })),
  };
}

export function LiveSearch() {
  const router = useRouter();
  const t = useT();
  const { lang, dict } = useLang();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Cat>("all");
  const r = useMemo(() => {
    const qq = q.trim();
    if (!qq) return null;
    // 영어 모드: 영어 검색어와 뜻이 같은 한국어 낱말(사전)로도 찾는다
    const extra: string[] = [];
    if (lang === "en" && dict && qq.length >= 2) {
      const lq = qq.toLowerCase();
      for (const [ko, en] of Object.entries(dict)) if (ko.length <= 20 && en.toLowerCase().includes(lq)) extra.push(ko.toLowerCase());
    }
    return searchAll(qq, extra);
  }, [q, lang, dict]);
  const LABEL: Record<Exclude<Cat, "all">, string> = { majors: "대학 학과", subjects: "교과목", jobs: "직업", schools: "경남 고교" };
  const total = r ? r.majors.length + r.subjects.length + r.jobs.length + r.schools.length : 0;
  return (
    <div className="relative">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
        }}
        className="relative"
      >
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden />
        <input className="input rounded-2xl py-3.5 pl-12 text-base shadow-sm" placeholder={t("과목, 학과, 직업, 경남 고교 검색 (예: 컴퓨터, 미적분, 로봇)")} value={q} onChange={(e) => setQ(e.target.value)} aria-label={t("통합 검색")} />
      </form>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-semibold text-slate-500">{t("인기 검색")}</span>
        {POPULAR.map((p) => (
          <button key={p} className="chip" onClick={() => setQ(t(p))}>
            #{t(p)}
          </button>
        ))}
      </div>
      {r && (
        <div className="absolute inset-x-0 top-[3.6rem] z-20 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl" role="region" aria-label={t("통합 검색 결과")}>
          <div className="mb-2 flex flex-wrap gap-1">
            {(["all", "majors", "subjects", "jobs", "schools"] as Cat[]).map((c) => (
              <button key={c} aria-pressed={cat === c} className={`chip ${cat === c ? "chip-on" : ""}`} onClick={() => setCat(c)}>
                {c === "all" ? t("전체 {n}", { n: total }) : `${t(LABEL[c])} ${r[c].length}`}
              </button>
            ))}
            <button className="ml-auto text-xs text-slate-500" onClick={() => setQ("")}>{t("닫기")}</button>
          </div>
          <div className="max-h-[60vh] space-y-3 overflow-y-auto">
            {(Object.keys(LABEL) as Exclude<Cat, "all">[])
              .filter((c) => cat === "all" || cat === c)
              .map((c) =>
                r[c].length ? (
                  <div key={c}>
                    <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-500">
                      <span>{t(LABEL[c])}</span>
                      {cat === "all" && r[c].length > 4 && (
                        <button className="text-brand-700" onClick={() => setCat(c)}>
                          {t("전체보기 ({n}) →", { n: r[c].length })}
                        </button>
                      )}
                    </div>
                    <ul className="grid gap-1 sm:grid-cols-2">
                      {r[c].slice(0, cat === "all" ? 4 : 40).map((x) => (
                        <li key={x.href}>
                          <Link href={x.href} className="block rounded-xl px-3 py-2 hover:bg-slate-50">
                            <span className="block text-sm font-semibold text-slate-900">{x.t}</span>
                            <span className="block truncate text-xs text-slate-500">{x.s}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null
              )}
            {total === 0 && <p className="py-6 text-center text-sm text-slate-500">{t("검색 결과가 없어요.")}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
