"use client";

import type { Job } from "@/data/jobs";
import { useEnData, useT } from "@/lib/i18n";

export function PathFlow({ job, compact = false }: { job: Job; compact?: boolean }) {
  const tr = useT();
  const pl = useEnData(() => import("@/i18n/data/plan.en"), "plan");
  const cols = [
    { t: "중학교 지금", c: "bg-amber-50 border-amber-200", items: job.msActions.slice(0, compact ? 2 : 3).map((a) => tr(a)) },
    { t: "고교 선택과목", c: "bg-emerald-50 border-emerald-200", items: job.hsSubjects.slice(0, compact ? 4 : 6).map((s) => pl?.SUBJECT_NAMES[s] ?? s) },
    { t: "대학 학과", c: "bg-sky-50 border-sky-200", items: job.majors.slice(0, compact ? 3 : 4).map((m) => tr(m)) },
    { t: "꿈", c: "bg-brand-600 border-brand-600 text-white", items: [`${job.emoji} ${tr(job.name)}`] },
  ];
  return (
    <div className="grid gap-2 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_0.7fr] md:items-stretch">
      {cols.map((col, i) => (
        <div key={col.t} className="contents">
          <div className={`rounded-2xl border p-3 ${col.c}`}>
            <div className={`text-[11px] font-bold uppercase tracking-wide ${i === 3 ? "text-white" : "text-slate-500"}`}>{tr(col.t)}</div>
            <ul className={`mt-1.5 space-y-1 text-sm ${i === 3 ? "text-lg font-extrabold" : "text-slate-700"}`}>
              {col.items.map((x) => (
                <li key={x}>{i === 3 ? x : `· ${x}`}</li>
              ))}
            </ul>
          </div>
          {i < 3 && (
            <div className="flex items-center justify-center text-slate-300" aria-hidden>
              <span className="md:hidden">↓</span>
              <span className="hidden md:inline">→</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
