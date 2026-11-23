"use client";

import { Heart } from "lucide-react";

import { useMemo, useState } from "react";
import { CnDirectory, CnStats } from "@/components/CnDirectory";
import { CN_SUMMARY } from "@/data/careernet-summary";
import Link from "next/link";
import { toggleIn, useStore } from "@/lib/store";
import { MAJORS } from "@/data/majors";
import { TRACKS, type TrackId } from "@/data/subjects";
import { JOB_MAP } from "@/data/jobs";
import { NextStep, PageHead } from "@/components/ui";
import { TRACK_HUE } from "@/lib/colors";
import { NationalMajors } from "@/components/NationalMajors";
import { useEnData, useT } from "@/lib/i18n";
import { useNames } from "@/i18n/names";

export default function MajorsPage() {
  const { state, update, ready } = useStore();
  const t = useT();
  const { subject: subjectLabel, job: jobLabel } = useNames();
  const en = useEnData(() => import("@/i18n/data/majors.en"), "majors");
  const [view, setView] = useState<"guide" | "national">("guide");
  const [q, setQ] = useState("");
  const [track, setTrack] = useState<TrackId | "all" | "fav">("all");
  const [grp, setGrp] = useState<string | null>(null); // 커리어넷 계열
  const list = useMemo(
    () =>
      MAJORS.filter((m) => {
        if (grp && (CN_SUMMARY.ourMajorGroups as Record<string, string | undefined>)[m.id] !== grp) return false;
        if (track === "fav" && !state.favMajors.includes(m.id)) return false;
        if (track !== "all" && track !== "fav" && m.track !== track) return false;
        const e = en?.MAJORS_EN[m.id];
        const hay = [m.name, m.desc, ...m.univ, ...m.core, ...m.rec, ...m.careers, ...(e ? [e.name, e.desc, ...e.univ, ...e.careers] : [])].join(" ").toLowerCase();
        if (q.trim() && !hay.includes(q.trim().toLowerCase())) return false;
        return true;
      }),
    [q, track, state.favMajors, en, grp]
  );
  const hs = state.profile.stage === "hs";

  return (
    <div>
      <PageHead tone="violet" eyebrow={t("탐색 백과")}
        step={hs ? 2 : undefined}
        title={t("학과 백과")}
        desc={t("대학 학과에서 무엇을 배우는지, 고등학교에서 어떤 과목을 들으면 좋은지, 졸업 후 어떤 일을 하는지 확인하고 관심 학과를 ❤️ 찜해 보세요.")}
      />
      <div className="mb-4 grid grid-cols-2 gap-1 rounded-xl bg-slate-200/60 p-1" role="tablist">
        <button role="tab" aria-selected={view === "guide"} onClick={() => setView("guide")} className={`rounded-lg py-2 text-sm font-semibold ${view === "guide" ? "bg-white shadow-sm" : "text-slate-500"}`}>
          {t("학과 가이드 (권장과목·진로)")}
        </button>
        <button role="tab" aria-selected={view === "national"} onClick={() => setView("national")} className={`rounded-lg py-2 text-sm font-semibold ${view === "national" ? "bg-white shadow-sm" : "text-slate-500"}`}>
          {t("전국 학과 탐색 (개설 대학)")}
        </button>
      </div>
      {view === "national" ? <NationalMajors /> : <>
      <CnStats kind="majors" group={grp} onPick={setGrp} />
      <div className="card mb-4 space-y-2 p-4">
        <input className="input" placeholder={t("학과·과목·진로 검색 (예: 반도체, 간호, 미적분Ⅱ)")} value={q} onChange={(e) => setQ(e.target.value)} aria-label={t("학과 검색")} />
        <div className="flex flex-wrap gap-1.5">
          {["컴퓨터", "반도체", "인공지능", "의예", "간호", "경영", "미디어", "로봇", "화학", "심리", "교육", "조선", "항공"].map((ko) => {
            // 영어 모드에서는 영어 태그로 검색(영어 학과 자료에서 찾음)
            const tg = en ? t(`#${ko}`).replace(/^#/, "") : ko;
            return (
              <button key={ko} className={`chip ${q === tg ? "chip-on" : ""}`} onClick={() => setQ(q === tg ? "" : tg)}>
                #{tg}
              </button>
            );
          })}
        </div>
        <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
          <button className={`chip shrink-0 ${track === "all" ? "chip-on" : ""}`} onClick={() => setTrack("all")}>{t("전체")} {MAJORS.length}</button>
          <button className={`chip shrink-0 ${track === "fav" ? "chip-on" : ""}`} onClick={() => setTrack("fav")}>❤️ {t("찜")} {ready ? state.favMajors.length : 0}</button>
          {(Object.keys(TRACKS) as TrackId[]).map((k) => (
            <button key={k} className={`chip shrink-0 ${track === k ? "chip-on" : ""}`} onClick={() => setTrack(k)}>
              {TRACKS[k].emoji} {en?.TRACK_EN[k].name ?? TRACKS[k].name} {MAJORS.filter((m) => m.track === k).length}
            </button>
          ))}
        </div>
      </div>
      <h2 className="mb-1 text-lg font-bold text-slate-900">{t("마이로드 심화 학과 {n}개", { n: MAJORS.length })}</h2>
      <p className="mb-3 text-sm text-slate-500">{t("핵심·권장 과목, 대학 생활, 진로까지 마이로드가 자세히 정리한 학과예요.")}</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((m) => {
          const on = state.favMajors.includes(m.id);
          const e = en?.MAJORS_EN[m.id];
          return (
            <Link key={m.id} href={`/majors/${m.id}`} className="card group relative flex flex-col gap-2 overflow-hidden transition hover:border-brand-300 hover:bg-slate-50/50">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className={`inline-block rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${TRACK_HUE[m.track].tile} ${TRACK_HUE[m.track].text}`}>{en?.TRACK_EN[m.track].name ?? TRACKS[m.track].name}</span>
                  <div className="font-bold group-hover:text-brand-700">{e?.name ?? m.name}</div>
                </div>
                <button
                  aria-label={on ? t("찜 해제") : t("찜하기")}
                  aria-pressed={on}
                  onClick={(e) => {
                    e.preventDefault();
                    update((s) => ({ ...s, favMajors: toggleIn(s.favMajors, m.id) }));
                  }}
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border text-lg ${on ? "border-rose-200 bg-rose-50" : "border-slate-200"}`}
                >
                  <Heart className={`h-[18px] w-[18px] ${on ? "fill-rose-500 text-rose-500" : "text-slate-400"}`} aria-hidden />
                </button>
              </div>
              <p className="line-clamp-2 text-sm text-slate-600">{e?.desc ?? m.desc}</p>
              <div className="mt-auto flex flex-wrap gap-1">
                {m.core.slice(0, 4).map((s) => (
                  <span key={s} className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[11px] font-semibold text-amber-800">★ {subjectLabel(s)}</span>
                ))}
              </div>
              <div className="text-xs text-slate-400">{t("관련 직업:")} {m.jobs.map((j) => JOB_MAP[j]?.name).filter((x): x is string => !!x).slice(0, 3).map(jobLabel).join(", ")}</div>
            </Link>
          );
        })}
      </div>
      {list.length === 0 && <p className="py-10 text-center text-sm text-slate-500">{t("조건에 맞는 학과가 없어요.")}</p>}
      <CnDirectory kind="majors" q={q} group={grp} onGroup={setGrp} />
      <p className="mt-6 text-xs text-slate-400">
        {t("핵심·권장 과목은 일반적인 안내예요. 대학·학과별 권장과목은 대학마다 다르므로 각 대학 발표 자료와")}{" "}
        <a className="underline" href="https://www.adiga.kr/" target="_blank" rel="noreferrer">{t("대입정보포털 어디가")}</a>{t("에서 꼭 확인하세요.")}
      </p>
      </>}
      {hs && <NextStep href="/path" label={t("길 잇기")} hint={t("찜한 학과까지 가는 과목 경로를 확인해 보세요")} />}
    </div>
  );
}
