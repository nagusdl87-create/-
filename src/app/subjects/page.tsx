"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CAT_INFO, CREDIT_RULES, GRADE5, GROUPS, SUBJECTS, SUBJECT_MAP, TRACKS, type Cat, type Group, type Subject, type TrackId } from "@/data/subjects";
import { MAJORS } from "@/data/majors";
import { JOBS } from "@/data/jobs";
import { PageHead } from "@/components/ui";
import { useEscape } from "@/components/useEscape";
import { GROUP_HUE } from "@/lib/colors";
import { NaesinGuide, NaesinSimulator } from "@/components/Naesin";
import { CreditStandards, CreditSystemGuide } from "@/components/CreditGuide";

type Tab = "list" | "tree" | "eval" | "rules" | "system";

export default function SubjectsPage() {
  const [tab, setTab] = useState<Tab>("list");
  const [group, setGroup] = useState<Group>("수학");
  const [cat, setCat] = useState<Cat | "all">("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    const h = decodeURIComponent(window.location.hash.slice(1));
    if (SUBJECT_MAP[h]) setOpen(h);
  }, []);

  const list = useMemo(
    () => SUBJECTS.filter((s) => (q ? (s.name + s.desc).includes(q.trim()) : s.group === group) && (cat === "all" || s.cat === cat)),
    [group, cat, q]
  );

  return (
    <div>
      <PageHead tone="sky" eyebrow="탐색 백과"
        title="과목 백과"
        desc={`2022 개정 교육과정 고등학교 보통교과 ${SUBJECTS.length}과목의 내용, 학점, 평가 방식, 선수과목, 2028 수능 출제 여부와 관련 학과·직업을 한곳에서 확인하세요.`}
      />
      <div className="mb-4 flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1" role="tablist">
        {(
          [
            ["list", "과목 찾기"],
            ["tree", "과목 위계도"],
            ["eval", "내신 산출 방법"],
            ["rules", "192학점 기준표"],
            ["system", "고교학점제 안내"],
          ] as const
        ).map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`flex-1 shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold ${tab === k ? "bg-white shadow-sm" : "text-slate-500"}`}>
            {l}
          </button>
        ))}
      </div>

      {(tab === "list" || tab === "tree") && (
        <div className="card mb-4 space-y-2 p-4">
          {tab === "list" && <input className="input" placeholder="과목 이름·내용 검색 (예: 미적분, 인공지능, 기후)" value={q} onChange={(e) => setQ(e.target.value)} aria-label="과목 검색" />}
          <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
            {GROUPS.map((g) => (
              <button key={g} className={`chip shrink-0 ${group === g && !q ? "chip-on" : ""}`} onClick={() => { setGroup(g); setQ(""); }}>
                {g} {SUBJECTS.filter((s) => s.group === g).length}
              </button>
            ))}
          </div>
          {tab === "list" && (
            <div className="flex flex-wrap gap-1.5">
              {(["all", "공통", "기본", "일반", "진로", "융합"] as const).map((c) => (
                <button key={c} className={`chip ${cat === c ? "chip-on" : ""}`} onClick={() => setCat(c)}>
                  {c === "all" ? "모든 유형" : CAT_INFO[c].label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "list" && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => (
            <SubjectCard key={s.name} s={s} onOpen={() => setOpen(s.name)} />
          ))}
          {list.length === 0 && <p className="text-sm text-slate-500">검색 결과가 없어요.</p>}
        </div>
      )}

      {tab === "tree" && <Tree group={group} onOpen={setOpen} />}
      {tab === "rules" && <CreditStandards />}
      {tab === "eval" && (
        <div className="space-y-6">
          <section>
            <h2 className="mb-3 text-lg font-bold">실시간 5등급 내신 시뮬레이터</h2>
            <NaesinSimulator />
          </section>
          <NaesinGuide />
        </div>
      )}
      {tab === "system" && <CreditSystemGuide />}

      {open && SUBJECT_MAP[open] && <SubjectModal s={SUBJECT_MAP[open]} onClose={() => setOpen(null)} onOpen={setOpen} />}
    </div>
  );
}

function Badges({ s }: { s: Subject }) {
  return (
    <span className="inline-flex flex-wrap gap-1">
      <span className="rounded px-1.5 py-0.5 text-[11px] font-bold text-white" style={{ background: CAT_INFO[s.cat].color }}>{CAT_INFO[s.cat].label}</span>
      {s.suneung && <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[11px] font-bold text-rose-700">2028 수능</span>}
    </span>
  );
}

function SubjectCard({ s, onOpen }: { s: Subject; onOpen: () => void }) {
  return (
    <button onClick={onOpen} className="card relative overflow-hidden text-left transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5">
      <span className={`absolute inset-y-0 left-0 w-1 ${GROUP_HUE[s.group].bar}`} aria-hidden />
      <div className="flex items-start justify-between gap-2">
        <div className="font-bold">{s.name}</div>
        <Badges s={s} />
      </div>
      <p className="mt-1 text-sm text-slate-600">{s.desc}</p>
      <div className="mt-2 text-xs text-slate-500">
        {s.group} · 기본 {s.credits}학점 · {s.eval}
        {s.prereq && ` · 선수: ${s.prereq.join(", ")}`}
      </div>
    </button>
  );
}

function Tree({ group, onOpen }: { group: Group; onOpen: (n: string) => void }) {
  const cols: Cat[] = ["공통", "일반", "진로", "융합"];
  const items = SUBJECTS.filter((s) => s.group === group && s.cat !== "기본");
  return (
    <div className="card overflow-x-auto">
      <p className="mb-3 text-sm text-slate-500">왼쪽에서 오른쪽으로 갈수록 심화돼요. 과목을 누르면 선수과목과 이어지는 과목을 볼 수 있어요.</p>
      <div className="grid min-w-[720px] grid-cols-4 gap-3">
        {cols.map((c, i) => (
          <div key={c}>
            <div className="mb-2 rounded-lg px-2 py-1 text-center text-xs font-bold text-white" style={{ background: CAT_INFO[c].color }}>
              {i + 1}단계 · {CAT_INFO[c].label}
            </div>
            <ul className="space-y-2">
              {items.filter((s) => s.cat === c).map((s) => {
                const next = SUBJECTS.filter((x) => x.prereq?.includes(s.name));
                return (
                  <li key={s.name}>
                    <button onClick={() => onOpen(s.name)} className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-left text-sm hover:border-brand-300">
                      <div className="font-semibold">
                        {s.name} {s.suneung && <span className="text-[11px] font-bold text-rose-600">수능</span>}
                      </div>
                      {s.prereq && <div className="text-[11px] text-slate-400">← {s.prereq.join(", ")}</div>}
                      {next.length > 0 && <div className="text-[11px] text-brand-600">→ {next.map((n) => n.name).join(", ")}</div>}
                    </button>
                  </li>
                );
              })}
              {items.filter((s) => s.cat === c).length === 0 && <li className="text-center text-xs text-slate-300">—</li>}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function SubjectModal({ s, onClose, onOpen }: { s: Subject; onClose: () => void; onOpen: (n: string) => void }) {
  const next = SUBJECTS.filter((x) => x.prereq?.includes(s.name));
  const majors = MAJORS.filter((m) => m.core.includes(s.name) || m.rec.includes(s.name));
  const jobs = JOBS.filter((j) => j.hsSubjects.includes(s.name));
  useEscape(onClose);
  const tracks = (Object.keys(TRACKS) as TrackId[]).filter((k) => TRACKS[k].core.includes(s.name) || TRACKS[k].rec.includes(s.name));
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 sm:items-center" onClick={onClose}>
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-5 sm:rounded-3xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={`${s.name} 상세`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs text-slate-500">{s.group}</div>
            <h2 className="text-xl font-extrabold">{s.name}</h2>
            <Badges s={s} />
          </div>
          <button className="btn-ghost px-3 py-1" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <p className="mt-3 text-slate-700">{s.desc}</p>
        <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
          <div className="rounded-lg bg-slate-50 p-2"><dt className="text-[11px] text-slate-500">기본 학점</dt><dd className="font-semibold">{s.credits}학점</dd></div>
          <div className="col-span-2 rounded-lg bg-slate-50 p-2"><dt className="text-[11px] text-slate-500">평가</dt><dd className="font-semibold">{s.eval}</dd></div>
        </dl>
        {(s.prereq || next.length > 0) && (
          <div className="mt-3 text-sm">
            {s.prereq && (
              <div>
                <span className="text-xs font-bold text-slate-500">먼저 배우면 좋은 과목 </span>
                {s.prereq.map((p) => <button key={p} className="chip mr-1" onClick={() => onOpen(p)}>{p}</button>)}
              </div>
            )}
            {next.length > 0 && (
              <div className="mt-1">
                <span className="text-xs font-bold text-slate-500">이어서 배우는 과목 </span>
                {next.map((n) => <button key={n.name} className="chip mr-1" onClick={() => onOpen(n.name)}>{n.name}</button>)}
              </div>
            )}
          </div>
        )}
        {tracks.length > 0 && <p className="mt-3 text-sm"><span className="text-xs font-bold text-slate-500">추천 계열 </span>{tracks.map((k) => `${TRACKS[k].emoji} ${TRACKS[k].name}`).join(" · ")}</p>}
        {majors.length > 0 && (
          <div className="mt-3">
            <div className="text-xs font-bold text-slate-500">이 과목이 중요한 학과</div>
            <div className="mt-1 flex flex-wrap gap-1">
              {majors.map((m) => <Link key={m.id} href={`/majors/${m.id}`} className="chip hover:border-brand-300">{m.name}{m.core.includes(s.name) ? " ★" : ""}</Link>)}
            </div>
          </div>
        )}
        {jobs.length > 0 && (
          <div className="mt-3">
            <div className="text-xs font-bold text-slate-500">관련 직업</div>
            <div className="mt-1 flex flex-wrap gap-1">
              {jobs.map((j) => <Link key={j.id} href={`/jobs/${j.id}`} className="chip hover:border-brand-300">{j.emoji} {j.name}</Link>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
