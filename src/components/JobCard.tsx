"use client";

import { Heart } from "lucide-react";

import Link from "next/link";
import { FIELDS, type Job } from "@/data/jobs";
import { RIASEC } from "@/data/riasec";
import { useStore } from "@/lib/store";
import { FIELD_HUE } from "@/lib/colors";
import { useEnData, useT } from "@/lib/i18n";

/** 영어 모드일 때만 직업 영어 자료(이름·요약·분야명 등)를 불러온다. 한국어 모드에서는 null. */
export const useJobsEn = () => useEnData(() => import("@/i18n/data/jobs.en"), "jobs");

export function FavButton({ id, className = "" }: { id: string; className?: string }) {
  const { state, update } = useStore();
  const t = useT();
  const on = state.favorites.includes(id);
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? t("찜 해제") : t("찜하기")}
      onClick={(e) => {
        e.preventDefault();
        update((s) => ({ ...s, favorites: on ? s.favorites.filter((f) => f !== id) : [...s.favorites, id] }));
      }}
      className={`grid h-9 w-9 place-items-center rounded-full border text-lg transition ${
        on ? "border-rose-200 bg-rose-50" : "border-slate-200 bg-white hover:bg-slate-50"
      } ${className}`}
    >
      <Heart className={`h-[18px] w-[18px] ${on ? "fill-rose-500 text-rose-500" : "text-slate-400"}`} aria-hidden />
    </button>
  );
}

export function JobCard({ job, score }: { job: Job; score?: number }) {
  const t = useT();
  const en = useJobsEn();
  const e = en?.JOBS_EN[job.id];
  return (
    <Link href={`/jobs/${job.id}`} className="card group relative flex flex-col gap-3 overflow-hidden transition hover:border-brand-300 hover:bg-slate-50/50">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-2xl ${FIELD_HUE[job.field].tile}`}>{job.emoji}</span>
          <div>
            <div className="font-bold text-slate-900 group-hover:text-brand-700" data-keep-ko={e ? undefined : ""}>{e?.name ?? job.name}</div>
            <div className={`text-xs font-medium ${FIELD_HUE[job.field].text}`}>{en?.FIELDS_EN[job.field] ?? FIELDS[job.field].name}</div>
          </div>
        </div>
        <FavButton id={job.id} />
      </div>
      <p className="line-clamp-2 text-sm text-slate-600" data-keep-ko={e ? undefined : ""}>{e?.summary ?? job.summary}</p>
      <div className="mt-auto flex items-center justify-between">
        <div className="flex gap-1">
          {job.riasec.slice(0, 2).map((k) => (
            <span key={k} className="rounded-md px-1.5 py-0.5 text-[11px] font-bold text-white" style={{ background: RIASEC[k].color }}>
              {t(RIASEC[k].name)}
            </span>
          ))}
        </div>
        {score !== undefined && (
          <span className={`text-sm font-extrabold ${score >= 70 ? "text-brand-600" : "text-slate-400"}`}>{t("나와 {score}% 잘 맞아요", { score })}</span>
        )}
      </div>
    </Link>
  );
}
