"use client";

import { Heart } from "lucide-react";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toggleIn, useStore } from "@/lib/store";
import { MAJORS } from "@/data/majors";
import { TRACKS, type TrackId } from "@/data/subjects";
import { JOB_MAP } from "@/data/jobs";
import { NextStep, PageHead } from "@/components/ui";

export default function MajorsPage() {
  const { state, update, ready } = useStore();
  const [q, setQ] = useState("");
  const [track, setTrack] = useState<TrackId | "all" | "fav">("all");
  const list = useMemo(
    () =>
      MAJORS.filter((m) => {
        if (track === "fav" && !state.favMajors.includes(m.id)) return false;
        if (track !== "all" && track !== "fav" && m.track !== track) return false;
        if (q.trim() && ![m.name, m.desc, ...m.univ, ...m.core, ...m.rec, ...m.careers].join(" ").includes(q.trim())) return false;
        return true;
      }),
    [q, track, state.favMajors]
  );
  const hs = state.profile.stage === "hs";

  return (
    <div>
      <PageHead
        step={hs ? 2 : undefined}
        title="학과 백과"
        desc="대학 학과에서 무엇을 배우는지, 고등학교에서 어떤 과목을 들으면 좋은지, 졸업 후 어떤 일을 하는지 확인하고 관심 학과를 ❤️ 찜해 보세요."
      />
      <div className="card mb-4 space-y-2 p-4">
        <input className="input" placeholder="학과·과목·진로 검색 (예: 반도체, 간호, 미적분Ⅱ)" value={q} onChange={(e) => setQ(e.target.value)} aria-label="학과 검색" />
        <div className="flex flex-wrap gap-1.5">
          {["컴퓨터", "반도체", "인공지능", "의예", "간호", "경영", "미디어", "로봇", "화학", "심리", "교육", "조선", "항공"].map((tg) => (
            <button key={tg} className={`chip ${q === tg ? "chip-on" : ""}`} onClick={() => setQ(q === tg ? "" : tg)}>
              #{tg}
            </button>
          ))}
        </div>
        <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
          <button className={`chip shrink-0 ${track === "all" ? "chip-on" : ""}`} onClick={() => setTrack("all")}>전체 {MAJORS.length}</button>
          <button className={`chip shrink-0 ${track === "fav" ? "chip-on" : ""}`} onClick={() => setTrack("fav")}>❤️ 찜 {ready ? state.favMajors.length : 0}</button>
          {(Object.keys(TRACKS) as TrackId[]).map((k) => (
            <button key={k} className={`chip shrink-0 ${track === k ? "chip-on" : ""}`} onClick={() => setTrack(k)}>
              {TRACKS[k].emoji} {TRACKS[k].name} {MAJORS.filter((m) => m.track === k).length}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((m) => {
          const on = state.favMajors.includes(m.id);
          return (
            <Link key={m.id} href={`/majors/${m.id}`} className="card group flex flex-col gap-2 transition hover:border-brand-200 hover:shadow-md">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs text-slate-500">{TRACKS[m.track].emoji} {TRACKS[m.track].name}</div>
                  <div className="font-bold group-hover:text-brand-700">{m.name}</div>
                </div>
                <button
                  aria-label={on ? "찜 해제" : "찜하기"}
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
              <p className="line-clamp-2 text-sm text-slate-600">{m.desc}</p>
              <div className="mt-auto flex flex-wrap gap-1">
                {m.core.slice(0, 4).map((s) => (
                  <span key={s} className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[11px] font-semibold text-amber-800">★ {s}</span>
                ))}
              </div>
              <div className="text-xs text-slate-400">관련 직업: {m.jobs.map((j) => JOB_MAP[j]?.name).filter(Boolean).slice(0, 3).join(", ")}</div>
            </Link>
          );
        })}
      </div>
      {list.length === 0 && <p className="py-10 text-center text-sm text-slate-500">조건에 맞는 학과가 없어요.</p>}
      <p className="mt-6 text-xs text-slate-400">
        핵심·권장 과목은 일반적인 안내예요. 대학·학과별 권장과목은 대학마다 다르므로 각 대학 발표 자료와{" "}
        <a className="underline" href="https://www.adiga.kr/" target="_blank" rel="noreferrer">대입정보포털 어디가</a>에서 꼭 확인하세요.
      </p>
      {hs && <NextStep href="/path" label="길 잇기" hint="찜한 학과까지 가는 과목 경로를 확인해 보세요" />}
    </div>
  );
}
