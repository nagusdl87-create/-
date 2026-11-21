"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SEMS, useStore, type Sem } from "@/lib/store";
import { analyze, autoFill, entry, parseEntry, SEM_LABEL, TEMPLATE_Y1 } from "@/lib/credits";
import { CAT_INFO, CREDIT_RULES, GROUPS, SUBJECTS, TRACKS, type Cat, type Group, type TrackId } from "@/data/subjects";
import { MAJOR_MAP } from "@/data/majors";
import { PageHead } from "@/components/ui";
import { useEscape } from "@/components/useEscape";

export default function CreditsPage() {
  const { state, update, ready } = useStore();
  const { plan, track } = state.credits;
  const [adding, setAdding] = useState<Sem | null>(null);
  const a = useMemo(() => analyze(plan, track), [plan, track]);

  if (!ready) return <div className="h-96" />;

  const setPlan = (fn: (p: typeof plan) => typeof plan) => update((s) => ({ ...s, credits: { ...s.credits, plan: fn(s.credits.plan) } }));
  const setTrack = (t: TrackId | "") => update((s) => ({ ...s, credits: { ...s.credits, track: t } }));
  const majorHints = state.favMajors.map((id) => MAJOR_MAP[id]).filter(Boolean);
  // 계열 추천 + 찜한 학과의 핵심·권장 과목을 함께 표시
  const star = (name: string) => {
    if ((track && TRACKS[track].core.includes(name)) || majorHints.some((m) => m.core.includes(name))) return "core";
    if ((track && TRACKS[track].rec.includes(name)) || majorHints.some((m) => m.rec.includes(name))) return "rec";
    return null;
  };

  return (
    <div>
      <PageHead
        step={state.profile.stage === "hs" ? 4 : undefined}
        title="192학점 과목 설계"
        desc="고등학교 3년 동안 들을 과목을 학기별로 담아 보세요. 졸업 기준, 필수 이수 학점, 선수과목 순서, 수능 과목, 계열 적합도를 실시간으로 진단해 드려요."
      />

      <div className="card no-print mb-4">
        <div className="text-sm font-bold">① 희망 계열 고르기</div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {(Object.keys(TRACKS) as TrackId[]).map((k) => (
            <button key={k} aria-pressed={track === k} onClick={() => setTrack(track === k ? "" : k)} className={`chip px-3 py-1.5 text-sm ${track === k ? "chip-on" : ""}`}>
              {TRACKS[k].emoji} {TRACKS[k].name}
            </button>
          ))}
        </div>
        {track && (
          <p className="mt-2 text-xs text-slate-500">
            <b className="text-amber-600">★ 핵심</b> {TRACKS[track].core.join(", ")} · <b className="text-sky-600">☆ 권장</b> {TRACKS[track].rec.join(", ")}
          </p>
        )}
        {majorHints.length > 0 && (
          <p className="mt-2 text-xs text-slate-500">
            찜한 학과:{" "}
            {majorHints.map((m) => (
              <button key={m.id} className="mr-1 font-semibold text-brand-600 underline" onClick={() => setTrack(m.track)}>
                {m.name}({TRACKS[m.track].name})
              </button>
            ))}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="btn-ghost" onClick={() => setPlan((p) => ({ ...p, ...TEMPLATE_Y1 }))}>
            ② 1학년 공통과목 채우기
          </button>
          <button className="btn-primary" disabled={!track} onClick={() => track && setPlan((p) => autoFill(p, track))}>
            ✨ 계열 추천으로 2·3학년 채우기
          </button>
          <button className="btn-ghost" onClick={() => window.print()}>
            🖨️ 학업설계서 인쇄
          </button>
          <button className="btn-ghost text-rose-600" onClick={() => confirm("설계를 모두 지울까요?") && setPlan(() => Object.fromEntries(SEMS.map((s) => [s, []])) as unknown as typeof plan)}>
            초기화
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          1학년 편성과 개설 과목은 학교마다 달라요. 내 학교 교육과정 편제표(학교 누리집·
          <a className="underline" href="https://www.hscredit.kr/" target="_blank" rel="noreferrer">고교학점제 누리집</a>)를 보면서 수정하세요.
        </p>
      </div>

      <div className="hidden print:block">
        <h2 className="text-xl font-extrabold">3개년 진로·학업 설계서</h2>
        <p className="text-sm">{state.profile.name} {state.profile.school} · 희망 계열 {track ? TRACKS[track].name : "-"}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px] [&>*]:min-w-0">
        <div className="grid gap-3 sm:grid-cols-2">
          {SEMS.map((sem) => (
            <div key={sem} className="card p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="font-bold">{SEM_LABEL[sem]}</div>
                <span className={`text-sm font-extrabold ${a.semTotals[sem] >= 25 && a.semTotals[sem] <= 33 ? "text-brand-600" : "text-slate-400"}`}>{a.semTotals[sem]}학점</span>
              </div>
              <ul className="space-y-1">
                {plan[sem].map((e, i) => {
                  const { name, credits, subject } = parseEntry(e);
                  const st = star(name);
                  return (
                    <li key={e + i} className="group flex items-center gap-2 rounded-lg bg-slate-50 px-2 py-1.5 text-sm">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: subject ? CAT_INFO[subject.cat].color : "#cbd5e1" }} title={subject ? CAT_INFO[subject.cat].label : ""} />
                      <span className="flex-1 truncate">
                        {st === "core" && <b className="text-amber-500">★ </b>}
                        {st === "rec" && <b className="text-sky-500">☆ </b>}
                        {name}
                        {subject?.suneung && <span className="ml-1 rounded bg-rose-100 px-1 text-[10px] font-bold text-rose-700">수능</span>}
                      </span>
                      <select
                        aria-label={`${name} 학점`}
                        className="no-print rounded border border-slate-200 bg-white text-xs"
                        value={credits}
                        onChange={(ev) => setPlan((p) => ({ ...p, [sem]: p[sem].map((x, j) => (j === i ? entry(name, Number(ev.target.value)) : x)) }))}
                      >
                        {[1, 2, 3, 4, 5].map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <span className="hidden text-xs print:inline">{credits}</span>
                      <button className="no-print text-xs text-slate-300 hover:text-rose-500" aria-label={`${name} 빼기`} onClick={() => setPlan((p) => ({ ...p, [sem]: p[sem].filter((_, j) => j !== i) }))}>
                        ✕
                      </button>
                    </li>
                  );
                })}
              </ul>
              <button className="no-print mt-2 w-full rounded-lg border-2 border-dashed border-slate-200 py-1.5 text-sm font-semibold text-slate-500 hover:border-brand-300 hover:text-brand-600" onClick={() => setAdding(sem)}>
                + 과목 담기
              </button>
            </div>
          ))}
        </div>

        <aside className="space-y-3 lg:sticky lg:top-20 lg:self-start">
          <div className="card p-4">
            <div className="text-xs font-semibold text-slate-500">총 이수 학점</div>
            <div className="text-3xl font-extrabold">
              {a.total + CREDIT_RULES.activity}
              <span className="text-base text-slate-400"> / 192</span>
            </div>
            <div className="text-xs text-slate-500">교과 {a.total}/174 + 창체 18</div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full rounded-full ${a.total >= 174 ? "bg-emerald-500" : "bg-brand-500"}`} style={{ width: `${Math.min(100, (a.total / 174) * 100)}%` }} />
            </div>
            <div className="mt-3 text-xs font-semibold text-slate-500">국·수·영 합계 (상한 81)</div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full rounded-full ${a.basic > 81 ? "bg-rose-500" : "bg-amber-400"}`} style={{ width: `${Math.min(100, (a.basic / 81) * 100)}%` }} />
            </div>
            <div className="text-right text-xs text-slate-500">{a.basic}학점</div>
          </div>

          {a.trackFit && (
            <div className="card p-4">
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>{track && TRACKS[track].name} 계열 적합도</span>
                <span className="font-extrabold text-brand-600">{a.trackFit.pct}%</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {a.trackFit.core.map((s) => (
                  <span key={s} className={`chip ${a.trackFit!.coreHave.includes(s) ? "border-amber-300 bg-amber-50 text-amber-800" : "opacity-50"}`}>★ {s}</span>
                ))}
                {a.trackFit.rec.map((s) => (
                  <span key={s} className={`chip ${a.trackFit!.recHave.includes(s) ? "border-sky-300 bg-sky-50 text-sky-800" : "opacity-50"}`}>☆ {s}</span>
                ))}
              </div>
            </div>
          )}

          <div className="card p-4">
            <div className="text-xs font-semibold text-slate-500">교과(군)별 필수 이수 학점</div>
            <ul className="mt-2 space-y-1.5">
              {a.areaResults.map((r) => (
                <li key={r.area} className="text-xs">
                  <div className="flex justify-between">
                    <span className="truncate">{r.area}</span>
                    <span className={r.ok ? "font-bold text-emerald-600" : "text-slate-500"}>
                      {r.have}/{r.min}
                    </span>
                  </div>
                  <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${r.ok ? "bg-emerald-500" : "bg-slate-300"}`} style={{ width: `${Math.min(100, (r.have / r.min) * 100)}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-4">
            <div className="text-xs font-semibold text-slate-500">실시간 진단</div>
            <ul className="mt-2 space-y-1.5 text-xs leading-relaxed">
              {a.checks.map((c) => (
                <li key={c.text} className={c.level === "ok" ? "text-emerald-700" : c.level === "warn" ? "text-amber-700" : "text-slate-500"}>
                  {c.level === "ok" ? "✓" : c.level === "warn" ? "⚠" : "ℹ"} {c.text}
                </li>
              ))}
            </ul>
          </div>
          <Link href="/subjects" className="no-print block text-center text-sm font-semibold text-brand-600">
            과목 백과에서 자세히 보기 →
          </Link>
        </aside>
      </div>

      {adding && (
        <SubjectPicker
          sem={adding}
          track={track}
          placed={a.placed}
          majorSubjects={majorHints.flatMap((m) => [...m.core, ...m.rec])}
          onClose={() => setAdding(null)}
          onPick={(name) => setPlan((p) => ({ ...p, [adding]: [...p[adding], name] }))}
        />
      )}
    </div>
  );
}

function SubjectPicker({ sem, track, placed, majorSubjects, onClose, onPick }: { sem: Sem; track: TrackId | ""; placed: Map<string, number>; majorSubjects: string[]; onClose: () => void; onPick: (n: string) => void }) {
  const [group, setGroup] = useState<Group | "all" | "star">(track || majorSubjects.length ? "star" : "all");
  useEscape(onClose);
  const [cat, setCat] = useState<Cat | "all">("all");
  const [q, setQ] = useState("");
  const [custom, setCustom] = useState("");
  const semIdx = SEMS.indexOf(sem);
  const list = SUBJECTS.filter((s) => {
    if (group === "star") {
      const rec = [...(track ? [...TRACKS[track].core, ...TRACKS[track].rec] : []), ...majorSubjects];
      if (!rec.includes(s.name)) return false;
    } else if (group !== "all" && s.group !== group) return false;
    if (cat !== "all" && s.cat !== cat) return false;
    if (q && !(s.name + s.desc).includes(q)) return false;
    return true;
  });

  return (
    <div className="no-print fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 sm:items-center" onClick={onClose}>
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-t-3xl bg-white sm:rounded-3xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="과목 담기">
        <div className="border-b border-slate-100 p-4">
          <div className="flex items-center justify-between">
            <div className="font-bold">{SEM_LABEL[sem]}에 과목 담기</div>
            <button className="btn-ghost px-3 py-1" onClick={onClose} aria-label="닫기">완료</button>
          </div>
          <input className="input mt-3" placeholder="과목 검색" value={q} onChange={(e) => setQ(e.target.value)} autoFocus aria-label="과목 검색" />
          <form
            className="mt-2 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (custom.trim()) {
                onPick(custom.trim().replace(/\|/g, ""));
                setCustom("");
              }
            }}
          >
            <input className="input py-1.5 text-sm" placeholder="목록에 없는 과목 직접 입력 (공동교육과정·소인수·전문교과)" value={custom} onChange={(e) => setCustom(e.target.value)} maxLength={30} aria-label="직접 입력 과목" />
            <button className="btn-ghost shrink-0 py-1.5 text-xs">+ 추가</button>
          </form>
          <div className="-mx-1 mt-2 flex gap-1 overflow-x-auto px-1 pb-1">
            {(track || majorSubjects.length > 0) && (
              <button className={`chip shrink-0 ${group === "star" ? "chip-on" : ""}`} onClick={() => setGroup("star")}>
                ★ 나의 추천 (계열·찜한 학과)
              </button>
            )}
            <button className={`chip shrink-0 ${group === "all" ? "chip-on" : ""}`} onClick={() => setGroup("all")}>전체</button>
            {GROUPS.map((g) => (
              <button key={g} className={`chip shrink-0 ${group === g ? "chip-on" : ""}`} onClick={() => setGroup(g)}>{g}</button>
            ))}
          </div>
          <div className="mt-1 flex gap-1">
            {(["all", "공통", "일반", "진로", "융합"] as const).map((c) => (
              <button key={c} className={`chip ${cat === c ? "chip-on" : ""}`} onClick={() => setCat(c)}>{c === "all" ? "모든 유형" : CAT_INFO[c].label}</button>
            ))}
          </div>
        </div>
        <ul className="flex-1 divide-y divide-slate-100 overflow-y-auto p-2">
          {list.map((s) => {
            const at = placed.get(s.name);
            const missingPre = (s.prereq ?? []).filter((p) => placed.get(p) === undefined || placed.get(p)! >= semIdx);
            return (
              <li key={s.name} className="flex items-start gap-3 px-2 py-2.5">
                <div className="flex-1">
                  <div className="text-sm font-bold">
                    {s.name}
                    <span className="ml-1.5 rounded px-1 text-[10px] font-bold text-white" style={{ background: CAT_INFO[s.cat].color }}>{CAT_INFO[s.cat].label}</span>
                    {s.suneung && <span className="ml-1 rounded bg-rose-100 px-1 text-[10px] font-bold text-rose-700">수능</span>}
                  </div>
                  <div className="text-xs text-slate-500">{s.desc} · {s.credits}학점 · {s.eval}</div>
                  {missingPre.length > 0 && <div className="text-[11px] text-amber-600">선수과목: {missingPre.join(", ")}을(를) 이전 학기에 먼저 담아 주세요</div>}
                  {at !== undefined && <div className="text-[11px] text-slate-400">이미 {SEM_LABEL[SEMS[at]]}에 있어요</div>}
                </div>
                <button className="btn-ghost shrink-0 px-3 py-1.5 text-xs" onClick={() => onPick(s.name)} aria-label={`${s.name} 담기`}>
                  + 담기
                </button>
              </li>
            );
          })}
          {list.length === 0 && <li className="p-6 text-center text-sm text-slate-500">조건에 맞는 과목이 없어요.</li>}
        </ul>
      </div>
    </div>
  );
}

