"use client";

// 직업·학과 백과의 전체 현황(개수·분야별 개수)과 커리어넷 공식 직업·학과 목록
// 목록 자료(directory.json, 약 250KB)는 이 화면에서만 필요할 때 불러온다.
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CN_SUMMARY, JOB_GROUP_EMOJI, MAJOR_GROUP_EMOJI } from "@/data/careernet-summary";
import { useT } from "@/lib/i18n";

type Kind = "jobs" | "majors";
type Dir = { jobs: { s: number; n: string; g: string; f: string; w: string; o: string | null }[]; majors: { s: number; n: string; g: string; a: string; o: string | null }[] };
let dirP: Promise<Dir> | null = null;
const loadDir = () => (dirP ??= import("@/data/careernet/directory.json").then((m) => m.default as unknown as Dir));
export type CnJobRow = Dir["jobs"][number];
export type CnMajorRow = Dir["majors"][number];
/** 커리어넷 직업·학과 목록(마이로드 심화와 이어진 것은 뺌). 불러오기 전에는 빈 배열 */
export function useCnRows() {
  const [dir, setDir] = useState<Dir | null>(null);
  useEffect(() => { loadDir().then(setDir).catch(() => {}); }, []);
  return { ready: !!dir, jobs: dir?.jobs.filter((x) => !x.o) ?? [], majors: dir?.majors.filter((x) => !x.o) ?? [] };
}

/** 커리어넷 직업 카드(심화 내용이 채워지기 전) — 직업 카드와 같은 모양 */
export function CnJobCard({ x }: { x: CnJobRow }) {
  return (
    <Link href={`/jobs/cn/${x.s}`} className="card group flex flex-col gap-2 transition hover:border-brand-300 hover:bg-slate-50/50" data-keep-ko lang="ko">
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-100 text-2xl" aria-hidden>{JOB_GROUP_EMOJI[x.g] ?? "💼"}</span>
        <div className="min-w-0">
          <div className="truncate font-bold text-slate-900 group-hover:text-brand-700">{x.n}</div>
          <div className="truncate text-xs font-medium text-slate-500">{x.f}</div>
        </div>
      </div>
      <p className="line-clamp-2 text-sm text-slate-600">{x.w}</p>
    </Link>
  );
}

export function CnMajorCard({ x }: { x: CnMajorRow }) {
  return (
    <Link href={`/majors/cn/${x.s}`} className="card group flex flex-col gap-2 transition hover:border-brand-300 hover:bg-slate-50/50" data-keep-ko lang="ko">
      <span className="inline-block w-fit rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-700">{MAJOR_GROUP_EMOJI[x.g] ?? "🎓"} {x.g}</span>
      <div className="font-bold text-slate-900 group-hover:text-brand-700">{x.n}</div>
      <p className="line-clamp-2 text-sm text-slate-600">{x.a}</p>
    </Link>
  );
}

/** 백과 머리: 전체 개수 + 분야(계열) 버튼(개수 포함) */
export function GroupChips({ kind, group, onPick }: { kind: Kind; group: string | null; onPick: (g: string | null) => void }) {
  const t = useT();
  const s = CN_SUMMARY[kind];
  const emoji = kind === "jobs" ? JOB_GROUP_EMOJI : MAJOR_GROUP_EMOJI;
  return (
    <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1" role="group" aria-label={t(kind === "jobs" ? "분야별 직업 수 (커리어넷 직업분류)" : "계열별 학과 수")}>
      <button type="button" aria-pressed={!group} className={`chip shrink-0 ${!group ? "chip-on" : ""}`} onClick={() => onPick(null)}>{t("전체")} {s.total}</button>
      {Object.entries(s.groups).map(([g, n]) => (
        <button key={g} type="button" aria-pressed={group === g} className={`chip shrink-0 ${group === g ? "chip-on" : ""}`} onClick={() => onPick(group === g ? null : g)}>
          {emoji[g] ?? "📌"} <span data-keep-ko>{g}</span> {n}
        </button>
      ))}
    </div>
  );
}
