"use client";

import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { FIELDS, JOBS, type FieldId } from "@/data/jobs";
import { RIASEC, RIASEC_ORDER, type RiasecKey } from "@/data/riasec";
import { isTestComplete, rankedJobs } from "@/lib/match";
import { JobCard, useJobsEn } from "@/components/JobCard";
import { useT } from "@/lib/i18n";
import { NextStep, PageHead } from "@/components/ui";

type Sort = "match" | "name";

export default function JobsPage() {
  const { state, ready } = useStore();
  const tested = ready && isTestComplete(state.answers);
  const [q, setQ] = useState("");
  const [field, setField] = useState<FieldId | "all" | "fav">("all");
  const [type, setType] = useState<RiasecKey | "all">("all");
  const [sort, setSort] = useState<Sort>("match");
  const t = useT();
  // 홈의 분야 카드에서 /jobs#field=it 처럼 들어오면 그 분야로 거르기
  useEffect(() => {
    const f = window.location.hash.match(/field=(\w+)/)?.[1];
    if (f && f in FIELDS) setField(f as FieldId);
  }, []);
  const en = useJobsEn();

  const list = useMemo(() => {
    const ranked = tested ? rankedJobs(state) : JOBS.map((job) => ({ job, score: undefined as number | undefined }));
    const kw = q.trim();
    let r = ranked.filter(({ job }) => {
      if (field === "fav" && !state.favorites.includes(job.id)) return false;
      if (field !== "all" && field !== "fav" && job.field !== field) return false;
      if (type !== "all" && !job.riasec.slice(0, 2).includes(type)) return false;
      if (kw) {
        const e = en?.JOBS_EN[job.id];
        const hay = [job.name, job.summary, ...job.majors, ...job.hsSubjects, ...job.tasks, ...(e ? [e.name, e.summary, ...e.tasks] : [])].join(" ");
        if (!hay.toLowerCase().includes(kw.toLowerCase())) return false;
      }
      return true;
    });
    const nm = (id: string, ko: string) => en?.JOBS_EN[id]?.name ?? ko;
    if (sort === "name" || !tested) r = [...r].sort((a, b) => nm(a.job.id, a.job.name).localeCompare(nm(b.job.id, b.job.name), en ? "en" : "ko"));
    return r;
  }, [state, tested, q, field, type, sort, en]);

  return (
    <div>
      <PageHead tone="amber" eyebrow={t("탐색 백과")}
        step={2}
        title={t("직업 찾기")}
        desc={
          tested
            ? t("흥미 탐색 결과와 가치관을 바탕으로 잘 맞는 순서대로 보여 드려요. 마음에 드는 직업을 ❤️ 찜해 두면 다음 단계에서 길을 이어 드려요.")
            : t("관심 있는 직업을 둘러보고 ❤️ 찜해 보세요. 1단계 흥미 탐색을 하면 나와 맞는 정도도 알려 드려요.")
        }
      />

      <div className="card mb-4 space-y-3 p-4">
        <input className="input" placeholder={t("직업, 학과, 과목으로 검색 (예: 로봇, 간호학과, 정보)")} value={q} onChange={(e) => setQ(e.target.value)} aria-label={t("직업 검색")} />
        <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
          <button className={`chip shrink-0 ${field === "all" ? "chip-on" : ""}`} onClick={() => setField("all")}>
            {t("전체")}
          </button>
          <button className={`chip shrink-0 ${field === "fav" ? "chip-on" : ""}`} onClick={() => setField("fav")}>
            ❤️ {t("찜")} {ready ? state.favorites.length : 0}
          </button>
          {(Object.keys(FIELDS) as FieldId[]).map((f) => (
            <button key={f} className={`chip shrink-0 ${field === f ? "chip-on" : ""}`} onClick={() => setField(f)}>
              {FIELDS[f].emoji} {en?.FIELDS_EN[f] ?? FIELDS[f].name}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            <button className={`chip ${type === "all" ? "chip-on" : ""}`} onClick={() => setType("all")}>
              {t("모든 유형")}
            </button>
            {RIASEC_ORDER.map((k) => (
              <button key={k} className={`chip ${type === k ? "chip-on" : ""}`} onClick={() => setType(k)}>
                {RIASEC[k].emoji} {t(RIASEC[k].name)}
              </button>
            ))}
          </div>
          {tested && (
            <select className="input w-auto py-1.5 text-xs" value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label={t("정렬")}>
              <option value="match">{t("잘 맞는 순")}</option>
              <option value="name">{t("가나다 순")}</option>
            </select>
          )}
        </div>
      </div>

      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
        <span>{t("{n}개 직업", { n: list.length })}</span>
        {ready && (() => {
          let v: string[] = [];
          try { v = JSON.parse(state.portfolio["viewed.jobs"] ?? "[]"); } catch {}
          const n = JOBS.filter((j) => v.includes(j.id)).length;
          return (
            <span className="flex items-center gap-2">
              {t("직업 열람 진행률 {n} / {total} ({pct}%)", { n, total: JOBS.length, pct: Math.round((n / JOBS.length) * 100) })}
              <span className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-200"><span className="block h-full bg-brand-500" style={{ width: `${(n / JOBS.length) * 100}%` }} /></span>
            </span>
          );
        })()}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map(({ job, score }) => (
          <JobCard key={job.id} job={job} score={score} />
        ))}
      </div>
      {list.length === 0 && <p className="py-10 text-center text-sm text-slate-500">{t("조건에 맞는 직업이 없어요. 필터를 바꿔 보세요.")}</p>}

      <NextStep href="/path" label={t("길 잇기")} hint={t("찜한 직업까지 가는 길(학과·고교 과목)을 확인해 보세요")} />
    </div>
  );
}
