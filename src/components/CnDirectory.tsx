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

/** 백과 머리: 전체 개수 + 분야(계열)별 개수. 누르면 아래 목록을 그 분야로 거른다 */
export function CnStats({ kind, group, onPick }: { kind: Kind; group: string | null; onPick: (g: string | null) => void }) {
  const t = useT();
  const s = CN_SUMMARY[kind];
  const emoji = kind === "jobs" ? JOB_GROUP_EMOJI : MAJOR_GROUP_EMOJI;
  const unit = kind === "jobs" ? "직업" : "학과";
  return (
    <section className="card mb-4 p-4 sm:p-5" aria-labelledby={`stats-${kind}`}>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id={`stats-${kind}`} className="text-sm font-semibold text-slate-500">{t(kind === "jobs" ? "직업 백과 전체" : "학과 백과 전체")}</h2>
          <p className="text-3xl font-extrabold text-slate-900">
            {s.total}<span className="ml-1 text-base font-semibold text-slate-500">{t(kind === "jobs" ? "개 직업" : "개 학과")}</span>
          </p>
        </div>
        <p className="text-xs text-slate-500">
          {t("마이로드 심화 {a} · 커리어넷 공식 정보 {b}", { a: s.deep, b: s.total - s.deep })}
          <br />
          {t("{date} 커리어넷 기준 · 매주 갱신", { date: CN_SUMMARY.fetchedAt })}
        </p>
      </div>
      <h3 className="mb-2 mt-4 text-xs font-bold text-slate-500">{t(kind === "jobs" ? "분야별 직업 수 (커리어넷 직업분류)" : "계열별 학과 수")}</h3>
      <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-5">
        {Object.entries(s.groups).map(([g, n]) => (
          <li key={g}>
            <button type="button" aria-pressed={group === g} onClick={() => onPick(group === g ? null : g)}
              className={`flex w-full items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition ${group === g ? "border-brand-500 bg-brand-50" : "border-slate-200 bg-surface hover:border-brand-300"}`}>
              <span className="text-lg" aria-hidden>{emoji[g] ?? "📌"}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold text-slate-800" data-keep-ko title={g}>{g}</span>
                <span className="block text-xs text-slate-500">{t("{n}개", { n })}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[11px] text-slate-500">{t("분야를 누르면 아래 {unit} 목록이 그 분야로 걸러져요.", { unit: t(unit) })}</p>
    </section>
  );
}

/** 커리어넷 공식 직업·학과 목록(마이로드 심화와 이어진 것은 심화 페이지로) */
export function CnDirectory({ kind, q, group, onGroup }: { kind: Kind; q: string; group: string | null; onGroup: (g: string | null) => void }) {
  const t = useT();
  const [dir, setDir] = useState<Dir | null>(null);
  const [limit, setLimit] = useState(60);
  useEffect(() => { loadDir().then(setDir).catch(() => {}); }, []);
  useEffect(() => setLimit(60), [q, group]);
  const list = useMemo(() => {
    if (!dir) return [];
    const k = q.trim().toLowerCase();
    const src = kind === "jobs" ? dir.jobs.filter((x) => !x.o) : dir.majors.filter((x) => !x.o);
    return src.filter((x) => (!group || x.g === group) && (!k || (x.n + " " + ("w" in x ? x.w + " " + x.f : x.a)).toLowerCase().includes(k)));
  }, [dir, kind, q, group]);
  const extra = CN_SUMMARY[kind].total - CN_SUMMARY[kind].deep;
  return (
    <section id="cn" className="mt-8 scroll-mt-24" aria-labelledby={`cn-${kind}`}>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id={`cn-${kind}`} className="text-lg font-bold text-slate-900">{t(kind === "jobs" ? "커리어넷 공식 직업 {n}개" : "커리어넷 공식 학과 {n}개", { n: extra })}</h2>
          <p className="text-sm text-slate-500">{t("커리어넷 직업백과·학과정보의 공식 자료예요. 위 검색어와 분야 선택이 함께 적용돼요.")}</p>
        </div>
        {group && (
          <button type="button" className="chip chip-on" onClick={() => onGroup(null)}>
            <span data-keep-ko>{group}</span> ✕
          </button>
        )}
      </div>
      {!dir ? (
        <p className="py-6 text-center text-sm text-slate-500">{t("목록을 불러오는 중이에요…")}</p>
      ) : (
        <>
          <p className="mb-2 text-xs text-slate-500">{t("{n}개", { n: list.length })}</p>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3" data-keep-ko lang="ko">
            {list.slice(0, limit).map((x) => (
              <li key={x.s}>
                <Link href={`/${kind}/cn/${x.s}`} className="block h-full rounded-xl border border-slate-200 bg-surface p-3 transition hover:border-brand-300">
                  <span className="block font-semibold text-slate-900">{x.n}</span>
                  <span className="block text-xs text-slate-500">{"w" in x ? x.f : x.g}</span>
                  <span className="mt-1 line-clamp-2 block text-xs text-slate-600">{"w" in x ? x.w : x.a}</span>
                </Link>
              </li>
            ))}
          </ul>
          {list.length === 0 && <p className="py-6 text-center text-sm text-slate-500">{t("찾는 항목이 없어요.")}</p>}
          {list.length > limit && (
            <div className="mt-3 text-center">
              <button type="button" className="btn-ghost" onClick={() => setLimit((n) => n + 90)}>{t("더 보기 ({n}개 남음)", { n: list.length - limit })}</button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
