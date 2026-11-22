"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SEMS, useStore, type Sem } from "@/lib/store";
import { analyze, autoFill, autoPick, entry, parseEntry, SEM_LABEL, TEMPLATE_Y1 } from "@/lib/credits";
import { curriculumToPlan, type SchoolCurriculum } from "@/data/curriculum";
import { CAT_INFO, CREDIT_RULES, GROUPS, SUBJECTS, TRACKS, type Cat, type Group, type TrackId } from "@/data/subjects";
import { MAJOR_MAP } from "@/data/majors";
import { PageHead } from "@/components/ui";
import { useEscape } from "@/components/useEscape";

export function CreditPlanner({ embedded = false }: { embedded?: boolean }) {
  const { state, update, ready } = useStore();
  const { plan, track } = state.credits;
  const [adding, setAdding] = useState<Sem | null>(null);
  const a = useMemo(() => analyze(plan, track), [plan, track]);

  if (!ready) return <div className="h-96" />;

  const setPlan = (fn: (p: typeof plan) => typeof plan) => update((s) => ({ ...s, credits: { ...s.credits, plan: fn(s.credits.plan) } }));
  const setTrack = (t: TrackId | "") => update((s) => ({ ...s, credits: { ...s.credits, track: t } }));
  const cur = state.credits.curriculum;
  // 편제표 모드: 선택·추가 과목이 바뀌면 계획을 다시 계산
  const setCurr = (fn: (c: typeof state.credits) => Partial<typeof state.credits>) =>
    update((s) => {
      const nextC = { ...s.credits, ...fn(s.credits) };
      return { ...s, credits: nextC.curriculum ? { ...nextC, plan: curriculumToPlan(nextC.curriculum, nextC.picks, nextC.extra) } : nextC };
    });
  const majorHints = state.favMajors.map((id) => MAJOR_MAP[id]).filter(Boolean);
  // 계열 추천 + 찜한 학과의 핵심·권장 과목을 함께 표시
  const star = (name: string) => {
    if ((track && TRACKS[track].core.includes(name)) || majorHints.some((m) => m.core.includes(name))) return "core";
    if ((track && TRACKS[track].rec.includes(name)) || majorHints.some((m) => m.rec.includes(name))) return "rec";
    return null;
  };

  return (
    <div>
      {!embedded && (
        <PageHead tone="brand" eyebrow="도구"
          step={state.profile.stage === "hs" ? 4 : undefined}
          title="192학점 과목 설계"
          desc="고등학교 3년 동안 들을 과목을 학기별로 담아 보세요. 졸업 기준, 필수 이수 학점, 선수과목 순서, 수능 과목, 계열 적합도를 실시간으로 진단해 드려요."
        />
      )}

      <div className="card no-print mb-4">
        <div className="text-sm font-bold">희망 계열 고르기</div>
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
        {cur ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="btn-primary" disabled={!track && !majorHints.length} onClick={() => setCurr((c) => ({ picks: autoPick(c.curriculum!, c.picks, (n) => (star(n) === "core" ? 2 : star(n) === "rec" ? 1 : 0)) }))}>
            ✨ 계열·학과 추천대로 선택군 채우기
          </button>
          <button className="btn-ghost" onClick={() => window.print()}>🖨️ 학업설계서 인쇄</button>
          <button className="btn-ghost text-rose-600" onClick={() => confirm("선택한 과목을 모두 지울까요?") && setCurr(() => ({ picks: {}, extra: Object.fromEntries(SEMS.map((s) => [s, []])) as unknown as Record<Sem, string[]> }))}>
            선택 초기화
          </button>
        </div>
        ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="btn-ghost" onClick={() => setPlan((p) => ({ ...p, ...TEMPLATE_Y1 }))}>
            1학년 공통과목 채우기
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
        )}
        <p className="mt-2 text-xs text-slate-400">
          1학년 편성과 개설 과목은 학교마다 달라요. 내 학교 교육과정 편제표(학교 누리집·
          <a className="underline" href="https://www.hscredit.kr/" target="_blank" rel="noreferrer">고교학점제 누리집</a>)를 보면서 수정하세요.
        </p>
      </div>

      <div className={`card no-print mb-4 flex flex-wrap items-center justify-between gap-3 ${cur ? "border-emerald-300 bg-emerald-50" : ""}`}>
        <div>
          <div className="text-sm font-bold">{cur ? `편제표 모드 · ${cur.school}` : "자유 설계 모드"}</div>
          <p className="text-xs text-slate-600">
            {cur
              ? `${cur.year ? cur.year + " · " : ""}학교 지정 과목은 잠겨 있고, 선택군에서 정해진 개수만큼 고를 수 있어요.`
              : "학교 편제표를 등록하면 지정 과목 잠금과 선택군(택N) 제한이 적용된 실제 수강 신청처럼 설계할 수 있어요."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/credits/school" className="btn-ghost">{cur ? "편제표 수정" : "학교 편제표 등록"}</Link>
          {cur && (
            <button className="btn-ghost" onClick={() => confirm("편제표 모드를 끄고 자유 설계로 돌아갈까요? (지금 설계는 그대로 남아요)") && update((s) => ({ ...s, credits: { ...s.credits, curriculum: null } }))}>
              자유 설계로 전환
            </button>
          )}
        </div>
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
              {cur ? (
                <CurriculumSem c={cur} sem={sem} picks={state.credits.picks} extra={state.credits.extra[sem] ?? []} star={star}
                  onToggle={(gid, name, pick) =>
                    setCurr((c) => {
                      const now = c.picks[gid] ?? [];
                      if (now.includes(name)) return { picks: { ...c.picks, [gid]: now.filter((x) => x !== name) } };
                      if (now.length >= pick) return {};
                      return { picks: { ...c.picks, [gid]: [...now, name] } };
                    })
                  }
                  onRemoveExtra={(k) => setCurr((c) => ({ extra: { ...c.extra, [sem]: (c.extra[sem] ?? []).filter((_, x) => x !== k) } }))}
                />
              ) : (
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
                        {subject?.suneung && <span className="ml-1 rounded bg-rose-100 px-1 text-[11px] font-bold text-rose-700">수능</span>}
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
              )}
              <button className="no-print mt-2 w-full rounded-lg border-2 border-dashed border-slate-200 py-1.5 text-sm font-semibold text-slate-500 hover:border-brand-300 hover:text-brand-600" onClick={() => setAdding(sem)}>
                {cur ? "+ 공동교육과정·추가 과목" : "+ 과목 담기"}
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

          <div className="card p-4">
            <div className="text-xs font-semibold text-slate-500">교과(군)별 이수 학점 분포</div>
            <div className="mt-2 flex h-3 overflow-hidden rounded-full bg-slate-100" role="img" aria-label="교과군별 학점 분포">
              {GROUPS.filter((g) => a.byGroup[g]).map((g, i) => (
                <div key={g} title={`${g} ${a.byGroup[g]}학점`} style={{ width: `${(a.byGroup[g] / Math.max(1, a.total)) * 100}%`, background: ["#127a67", "#40b199", "#79cdb9", "#f2a516", "#ffbe55", "#64748b", "#94a3b8", "#a78bfa", "#f472b6", "#cbd5e1"][i % 10] }} />
              ))}
            </div>
            <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] text-slate-600">
              {GROUPS.filter((g) => a.byGroup[g]).map((g, i) => (
                <li key={g} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: ["#127a67", "#40b199", "#79cdb9", "#f2a516", "#ffbe55", "#64748b", "#94a3b8", "#a78bfa", "#f472b6", "#cbd5e1"][i % 10] }} />
                  {g} {a.byGroup[g]}
                </li>
              ))}
            </ul>
          </div>

          {a.trackFit && (
            <div className="card p-4">
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>{track && TRACKS[track].name} 계열 적합도</span>
                <span className="font-extrabold text-brand-600">{a.trackFit.pct}%</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {a.trackFit.core.map((s) => (
                  <span key={s} className={`chip ${a.trackFit!.coreHave.includes(s) ? "border-amber-300 bg-amber-50 text-amber-800" : "border-dashed text-slate-500"}`}>★ {s}</span>
                ))}
                {a.trackFit.rec.map((s) => (
                  <span key={s} className={`chip ${a.trackFit!.recHave.includes(s) ? "border-sky-300 bg-sky-50 text-sky-800" : "border-dashed text-slate-500"}`}>☆ {s}</span>
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
          onPick={(name) => (cur ? setCurr((c) => ({ extra: { ...c.extra, [adding]: [...(c.extra[adding] ?? []), name] } })) : setPlan((p) => ({ ...p, [adding]: [...p[adding], name] })))}
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
                    <span className="ml-1.5 rounded px-1 text-[11px] font-bold text-white" style={{ background: CAT_INFO[s.cat].color }}>{CAT_INFO[s.cat].label}</span>
                    {s.suneung && <span className="ml-1 rounded bg-rose-100 px-1 text-[11px] font-bold text-rose-700">수능</span>}
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


function CurriculumSem({
  c, sem, picks, extra, star, onToggle, onRemoveExtra,
}: {
  c: SchoolCurriculum;
  sem: Sem;
  picks: Record<string, string[]>;
  extra: string[];
  star: (n: string) => "core" | "rec" | null;
  onToggle: (gid: string, name: string, pick: number) => void;
  onRemoveExtra: (i: number) => void;
}) {
  const [msg, setMsg] = useState("");
  const s = c.sems[sem];
  // 다른 학기·다른 선택군에서 이미 고른 과목
  const elsewhere = (gid: string) => {
    const set = new Set<string>();
    for (const k of Object.keys(c.sems) as Sem[]) {
      c.sems[k].fixed.forEach((i) => set.add(i.name));
      c.sems[k].groups.forEach((g) => g.id !== gid && (picks[g.id] ?? []).forEach((n) => set.add(n)));
    }
    return set;
  };
  return (
    <div className="space-y-2">
      {s.fixed.length > 0 && (
        <ul className="space-y-1">
          {s.fixed.map((i) => (
            <li key={i.name} className="flex items-center gap-2 rounded-lg bg-slate-100 px-2 py-1.5 text-sm text-slate-600">
              <span aria-hidden>🔒</span>
              <span className="flex-1 truncate">{i.name}</span>
              <span className="text-xs">{i.credits}학점</span>
            </li>
          ))}
        </ul>
      )}
      {s.groups.map((g) => {
        const chosen = picks[g.id] ?? [];
        const other = elsewhere(g.id);
        const full = chosen.length >= g.pick;
        return (
          <fieldset key={g.id} className={`rounded-xl border p-2 ${full ? "border-emerald-200 bg-emerald-50/50" : "border-amber-200 bg-amber-50/40"}`}>
            <legend className="px-1 text-xs font-bold text-slate-600">
              {g.label} · 택{g.pick} <span className={full ? "text-emerald-600" : "text-amber-600"}>({chosen.length}/{g.pick})</span>
            </legend>
            <div className="flex flex-wrap gap-1">
              {g.options.map((o) => {
                const on = chosen.includes(o.name);
                const dup = !on && other.has(o.name);
                const st = star(o.name);
                return (
                  <button
                    key={o.name}
                    aria-pressed={on}
                    disabled={dup}
                    title={dup ? "다른 학기·선택군에서 이미 골랐어요" : undefined}
                    onClick={() => {
                      if (!on && full) {
                        setMsg(`${g.label}은(는) ${g.pick}과목까지 고를 수 있어요. 다른 과목을 먼저 빼 주세요.`);
                        setTimeout(() => setMsg(""), 2500);
                        return;
                      }
                      onToggle(g.id, o.name, g.pick);
                    }}
                    className={`rounded-lg border px-2 py-1 text-xs font-semibold transition ${on ? "border-brand-500 bg-brand-600 text-white" : dup ? "border-slate-100 bg-slate-50 text-slate-300 line-through" : "border-slate-200 bg-white text-slate-700 hover:border-brand-300"}`}
                  >
                    {st === "core" && "★ "}
                    {st === "rec" && "☆ "}
                    {o.name} <span className="opacity-70">{o.credits}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        );
      })}
      {msg && <p className="text-xs font-semibold text-amber-700" role="status">{msg}</p>}
      {extra.length > 0 && (
        <ul className="space-y-1">
          {extra.map((e, k) => {
            const p = parseEntry(e);
            return (
              <li key={e + k} className="flex items-center gap-2 rounded-lg border border-dashed border-slate-300 px-2 py-1.5 text-sm">
                <span aria-hidden>➕</span>
                <span className="flex-1 truncate">{p.name}</span>
                <span className="text-xs text-slate-500">{p.credits}학점</span>
                <button className="no-print text-xs text-slate-300 hover:text-rose-500" aria-label={`${p.name} 빼기`} onClick={() => onRemoveExtra(k)}>✕</button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
