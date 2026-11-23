"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { JOBS } from "@/data/jobs";
import { MAJORS } from "@/data/majors";
import { SUBJECTS } from "@/data/subjects";
import { GN_SCHOOLS, KIND_INFO } from "@/data/gn";
import { PageHead } from "@/components/ui";
import { useLang, useT } from "@/lib/i18n";
import { useCnDir } from "@/components/LiveSearch";

function Results() {
  const q = (useSearchParams().get("q") ?? "").trim();
  const tr = useT();
  const { lang, dict } = useLang();
  const cn = useCnDir(!!q);
  const r = useMemo(() => {
    if (!q) return null;
    // 영어 모드: 영어 검색어를 사전에서 찾아 그 한국어 낱말로도 검색한다(예: nurse → 간호사)
    const terms = [q];
    if (lang === "en" && dict) {
      const lq = q.toLowerCase();
      for (const [ko, en] of Object.entries(dict)) if (ko.length <= 20 && en.toLowerCase().includes(lq)) terms.push(ko);
    }
    const has = (...s: string[]) => { const txt = s.join(" "); return terms.some((x) => txt.includes(x)); };
    return {
      jobs: JOBS.filter((j) => has(j.name, j.summary, ...j.majors, ...j.hsSubjects, ...j.tasks)),
      majors: MAJORS.filter((m) => has(m.name, m.desc, ...m.core, ...m.rec, ...m.careers)),
      subjects: SUBJECTS.filter((s) => has(s.name, s.desc)),
      schools: GN_SCHOOLS.filter((s) => has(s.name, s.region, s.addr, ...s.depts.map((d) => d.name))),
      // 커리어넷 공식 직업·학과(마이로드 심화와 이어지지 않은 것)
      cnJobs: (cn?.jobs ?? []).filter((j) => !j.o && has(j.n, j.w, j.f)),
      cnMajors: (cn?.majors ?? []).filter((m) => !m.o && has(m.n, m.a)),
    };
  }, [q, lang, dict, cn]);
  if (!r) return <p className="text-sm text-slate-500">{tr("검색어를 입력해 주세요.")}</p>;
  const total = r.jobs.length + r.majors.length + r.subjects.length + r.schools.length + r.cnJobs.length + r.cnMajors.length;
  const Section = ({ t, n, children }: { t: string; n: number; children: React.ReactNode }) =>
    n ? (
      <section className="card">
        <h2 className="mb-2 font-bold">{tr(t)} <span className="text-sm text-slate-400">{n}</span></h2>
        <div className="flex flex-wrap gap-1.5">{children}</div>
      </section>
    ) : null;
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">{tr("‘{q}’ 검색 결과 {total}건", { q, total })}</p>
      <Section t="💼 직업" n={r.jobs.length}>{r.jobs.map((j) => <Link key={j.id} href={`/jobs/${j.id}`} className="chip px-3 py-1.5 text-sm hover:border-brand-300">{j.emoji} {tr(j.name)}</Link>)}</Section>
      <Section t="🎓 학과" n={r.majors.length}>{r.majors.map((m) => <Link key={m.id} href={`/majors/${m.id}`} className="chip px-3 py-1.5 text-sm hover:border-brand-300">{tr(m.name)}</Link>)}</Section>
      <Section t="💼 커리어넷 공식 직업" n={r.cnJobs.length}>{r.cnJobs.slice(0, 60).map((j) => <Link key={j.s} href={`/jobs/cn/${j.s}`} className="chip px-3 py-1.5 text-sm hover:border-brand-300" data-keep-ko>{j.n}</Link>)}</Section>
      <Section t="🎓 커리어넷 공식 학과" n={r.cnMajors.length}>{r.cnMajors.slice(0, 60).map((m) => <Link key={m.s} href={`/majors/cn/${m.s}`} className="chip px-3 py-1.5 text-sm hover:border-brand-300" data-keep-ko>{m.n}</Link>)}</Section>
      <Section t="📚 과목" n={r.subjects.length}>{r.subjects.map((s) => <Link key={s.name} href={`/subjects#${encodeURIComponent(s.name)}`} className="chip px-3 py-1.5 text-sm hover:border-brand-300">{tr(s.name)}</Link>)}</Section>
      <Section t="🏫 경남 고교" n={r.schools.length}>{r.schools.slice(0, 40).map((s) => <Link key={s.id} href={`/schools#${s.id}`} className="chip px-3 py-1.5 text-sm hover:border-brand-300"><span data-keep-ko>{s.name}</span> · {tr(KIND_INFO[s.kind].name)}</Link>)}</Section>
      {total === 0 && <p className="py-10 text-center text-sm text-slate-500">{tr("결과가 없어요. 다른 낱말로 검색해 보세요.")}</p>}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div>
      <PageHead tone="brand" eyebrow="검색" title="통합 검색" />
      <Suspense fallback={null}>
        <Results />
      </Suspense>
    </div>
  );
}
