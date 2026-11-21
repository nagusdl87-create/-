"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { groupLabel, useUniv } from "@/lib/univ";
import { UniversityList } from "./UniversityList";
import { useEscape } from "./useEscape";

export function NationalMajors() {
  const { data, error } = useUniv();
  const [q, setQ] = useState("");
  const [big, setBig] = useState("전체");
  const [open, setOpen] = useState<number | null>(null);
  useEscape(() => setOpen(null));
  const list = useMemo(() => {
    if (!data) return [];
    return data.groups
      .map((g, i) => ({ g, i, schools: new Set(g.depts.map((d) => d[0])).size, gn: new Set(g.depts.filter((d) => data.schools[d[0]][1] === "경남").map((d) => d[0])).size }))
      .filter(({ g }) => big === "전체" || g.big === big)
      .filter(({ g }) => !q.trim() || [g.small, g.mid, ...g.subjects, ...g.jobs, ...g.depts.map((d) => d[1])].join(" ").includes(q.trim()));
  }, [data, q, big]);
  if (error) return <p className="text-sm text-slate-500">데이터를 불러오지 못했어요.</p>;
  if (!data) return <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />;
  const bigs = ["전체", ...new Set(data.groups.map((g) => g.big))];
  const sel = open !== null ? data.groups[open] : null;
  return (
    <div>
      <div className="card mb-4 space-y-2 p-4">
        <input className="input" placeholder="학과명·교과목·직업으로 검색 (예: 간호, 반도체, 항공정비)" value={q} onChange={(e) => setQ(e.target.value)} aria-label="전국 학과 검색" />
        <div className="flex flex-wrap gap-1.5">
          {bigs.map((b) => (
            <button key={b} aria-pressed={big === b} className={`chip ${big === b ? "chip-on" : ""}`} onClick={() => setBig(b)}>
              {b}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500">
          교육부 표준분류 소계열 기준 {data.groups.length}개 분야 · 전국 {data.schools.length}개 대학(캠퍼스) {data.groups.reduce((a, g) => a + g.depts.length, 0).toLocaleString()}개 학과
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map(({ g, i, schools, gn }) => (
          <button key={i} onClick={() => setOpen(i)} className="card text-left transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5">
            <div className="text-xs text-slate-500">
              {g.big} · {g.mid}
            </div>
            <div className="mt-0.5 text-lg font-bold text-slate-900">{groupLabel(g)}</div>
            <div className="mt-1 text-sm text-slate-600">
              전국 {schools}개 대학 · 학과 {g.depts.length}개{gn ? <b className="ml-1 text-brand-700">· 경남 {gn}곳</b> : null}
            </div>
            <div className="mt-2 line-clamp-2 text-xs text-slate-500">예: {[...new Set(g.depts.map((d) => d[1]))].slice(0, 5).join(", ")}</div>
          </button>
        ))}
      </div>
      {list.length === 0 && <p className="py-10 text-center text-sm text-slate-500">검색 결과가 없어요.</p>}
      {sel && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 sm:items-center" onClick={() => setOpen(null)}>
          <div className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-white p-5 sm:rounded-3xl sm:p-6" role="dialog" aria-modal="true" aria-label={groupLabel(sel)} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-xs text-slate-500">
                  {sel.big} · {sel.mid}
                </div>
                <h2 className="text-2xl font-bold">{groupLabel(sel)}</h2>
              </div>
              <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-slate-100" onClick={() => setOpen(null)} aria-label="닫기">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="text-xs font-semibold text-slate-500">주요 교과목 (대학 공시)</div>
                <div className="mt-1.5 flex flex-wrap gap-1">{sel.subjects.map((s) => <span key={s} className="chip bg-white">{s}</span>)}</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="text-xs font-semibold text-slate-500">관련 직업 (대학 공시)</div>
                <div className="mt-1.5 flex flex-wrap gap-1">{sel.jobs.map((s) => <span key={s} className="chip bg-white">{s}</span>)}</div>
              </div>
            </div>
            <div className="mt-3 text-xs text-slate-500">이 분야의 학과 이름: {[...new Set(sel.depts.map((d) => d[1]))].slice(0, 30).join(", ")}</div>
            <div className="mt-5">
              <UniversityList groupIndex={open!} title={groupLabel(sel)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
