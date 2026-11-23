"use client";

import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { FIELDS, JOBS, type FieldId } from "@/data/jobs";
import { RIASEC, RIASEC_ORDER, type RiasecKey } from "@/data/riasec";
import { isTestComplete, rankedJobs } from "@/lib/match";
import { JobCard, useJobsEn } from "@/components/JobCard";
import { useT } from "@/lib/i18n";
import { NextStep, PageHead } from "@/components/ui";
import { CnJobCard, GroupChips, useCnRows } from "@/components/CnDirectory";
import { CN_SUMMARY } from "@/data/careernet-summary";

type Sort = "match" | "name";

export default function JobsPage() {
  const { state, ready } = useStore();
  const tested = ready && isTestComplete(state.answers);
  const [q, setQ] = useState("");
  const [field, setField] = useState<FieldId | "all" | "fav">("all");
  const [type, setType] = useState<RiasecKey | "all">("all");
  const [sort, setSort] = useState<Sort>("match");
  const [grp, setGrp] = useState<string | null>(null); // 직업 분야(커리어넷 직업분류 대분류) — 556개 모두 같은 분류
  const [limit, setLimit] = useState(60);
  const t = useT();
  const cn = useCnRows();
  // 홈의 분야 카드에서 /jobs#group=분야 처럼 들어오면 그 분야로 거르기(예전 #field= 주소도 받음)
  useEffect(() => {
    const h = decodeURIComponent(window.location.hash);
    const g = h.match(/group=([^&]+)/)?.[1];
    if (g && g in CN_SUMMARY.jobs.groups) setGrp(g);
    const f = h.match(/field=(\w+)/)?.[1];
    if (f && f in FIELDS) setField(f as FieldId);
  }, []);
  useEffect(() => setLimit(60), [q, grp, field, type]);
  const en = useJobsEn();

  const list = useMemo(() => {
    const ranked = tested ? rankedJobs(state) : JOBS.map((job) => ({ job, score: undefined as number | undefined }));
    const kw = q.trim();
    let r = ranked.filter(({ job }) => {
      if (grp && (CN_SUMMARY.ourJobGroups as Record<string, string | undefined>)[job.id] !== grp) return false;
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
  }, [state, tested, q, field, type, sort, en, grp]);
  // 아직 심화 내용을 채우는 중인 커리어넷 직업(같은 목록에 이어서 보여 줌). 찜·흥미 유형 거르기 중에는 빠짐
  const cnList = useMemo(() => {
    if (field !== "all" || type !== "all") return [];
    const kw = q.trim().toLowerCase();
    return cn.jobs.filter((x) => (!grp || x.g === grp) && (!kw || `${x.n} ${x.f} ${x.w}`.toLowerCase().includes(kw)));
  }, [cn.jobs, q, grp, field, type]);
  const total = list.length + cnList.length;

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
        <GroupChips kind="jobs" group={grp} onPick={setGrp} />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            <button className={`chip ${field === "fav" ? "chip-on" : ""}`} aria-pressed={field === "fav"} onClick={() => setField(field === "fav" ? "all" : "fav")}>
              ❤️ {t("찜")} {ready ? state.favorites.length : 0}
            </button>
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
        <span>{t("{n}개 직업", { n: total })}{!cn.ready && " …"}</span>
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
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 [&>*]:min-w-0">
        {list.slice(0, limit).map(({ job, score }) => (
          <JobCard key={job.id} job={job} score={score} />
        ))}
        {cnList.slice(0, Math.max(0, limit - list.length)).map((x) => <CnJobCard key={x.s} x={x} />)}
      </div>
      {total === 0 && <p className="py-10 text-center text-sm text-slate-500">{t("조건에 맞는 직업이 없어요. 필터를 바꿔 보세요.")}</p>}
      {total > limit && (
        <div className="mt-4 text-center">
          <button type="button" className="btn-ghost" onClick={() => setLimit((n) => n + 90)}>{t("더 보기 ({n}개 남음)", { n: total - limit })}</button>
        </div>
      )}

      <NextStep href="/path" label={t("길 잇기")} hint={t("찜한 직업까지 가는 길(학과·고교 과목)을 확인해 보세요")} />
    </div>
  );
}
