"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MAJOR_MAP, MAJORS } from "@/data/majors";
import { SUBJECT_MAP, TRACKS } from "@/data/subjects";
import { JOB_MAP } from "@/data/jobs";
import { GN_UNIVERSITIES, OFFICIAL } from "@/data/gn";
import { toggleIn, useStore } from "@/lib/store";

export function MajorDetail({ id }: { id: string }) {
  const m = MAJOR_MAP[id];
  const router = useRouter();
  const { state, update } = useStore();
  const on = state.favMajors.includes(m.id);
  const similar = MAJORS.filter((x) => x.track === m.track && x.id !== m.id).slice(0, 6);
  const placed = new Set(Object.values(state.credits.plan).flat().map((e) => e.split("|")[0]));

  const Subj = ({ name, core }: { name: string; core?: boolean }) => (
    <Link
      href={`/subjects#${encodeURIComponent(name)}`}
      className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-sm font-semibold ${core ? "border-amber-200 bg-amber-50 text-amber-900" : "border-sky-200 bg-sky-50 text-sky-900"}`}
    >
      {core ? "★" : "☆"} {name}
      {SUBJECT_MAP[name]?.suneung && <span className="text-[10px] text-rose-600">수능</span>}
      {placed.has(name) && <span className="text-[10px] text-emerald-600">✓담음</span>}
    </Link>
  );

  return (
    <div className="space-y-4">
      <Link href="/majors" className="text-sm font-semibold text-slate-500 hover:text-brand-600">← 학과 목록</Link>
      <div className="card">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-slate-500">{TRACKS[m.track].emoji} {TRACKS[m.track].name} 계열 · {TRACKS[m.track].desc}</div>
            <h1 className="text-2xl font-extrabold">{m.name}</h1>
          </div>
          <button
            aria-pressed={on}
            aria-label={on ? "찜 해제" : "찜하기"}
            onClick={() => update((s) => ({ ...s, favMajors: toggleIn(s.favMajors, m.id) }))}
            className={`grid h-11 w-11 place-items-center rounded-full border text-xl ${on ? "border-rose-200 bg-rose-50" : "border-slate-200"}`}
          >
            {on ? "❤️" : "🤍"}
          </button>
        </div>
        <p className="mt-3 leading-relaxed text-slate-700">{m.desc}</p>
      </div>

      <div className="card">
        <h2 className="font-bold">🏫 고등학교에서 들으면 좋은 과목</h2>
        <div className="mt-3 text-xs font-semibold text-slate-500">핵심 과목</div>
        <div className="mt-1 flex flex-wrap gap-1.5">{m.core.map((s) => <Subj key={s} name={s} core />)}</div>
        <div className="mt-3 text-xs font-semibold text-slate-500">권장 과목</div>
        <div className="mt-1 flex flex-wrap gap-1.5">{m.rec.map((s) => <Subj key={s} name={s} />)}</div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            className="btn-primary"
            onClick={() => {
              update((s) => ({ ...s, credits: { ...s.credits, track: m.track }, favMajors: s.favMajors.includes(m.id) ? s.favMajors : [...s.favMajors, m.id] }));
              router.push("/credits");
            }}
          >
            🧮 이 학과 기준으로 192학점 설계하기
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-400">일반적인 안내예요. 지원할 대학의 학과별 권장과목은 반드시 대학 발표 자료로 확인하세요.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <h2 className="font-bold">🎓 대학에서 배우는 과목</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">{m.univ.map((u) => <li key={u}>• {u}</li>)}</ul>
        </div>
        <div className="card">
          <h2 className="font-bold">💼 졸업 후 진로</h2>
          <div className="mt-2 flex flex-wrap gap-1.5">{m.careers.map((c) => <span key={c} className="chip">{c}</span>)}</div>
          <div className="mt-3 text-xs font-semibold text-slate-500">관련 직업</div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {m.jobs.map((j) => JOB_MAP[j] && <Link key={j} href={`/jobs/${j}`} className="chip hover:border-brand-300">{JOB_MAP[j].emoji} {JOB_MAP[j].name}</Link>)}
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="font-bold">📍 경남 소재 대학에서 찾아보기</h2>
        <p className="mt-1 text-xs text-slate-500">같거나 비슷한 이름의 학과가 개설되어 있는지 대학 누리집이나 대학알리미에서 확인하세요.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {GN_UNIVERSITIES.map((u) => (
            <a key={u.name} href={u.url} target="_blank" rel="noreferrer" className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:border-brand-300">
              <b>{u.name}</b> <span className="text-xs text-slate-500">{u.region}</span>
            </a>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <a className="btn-ghost" href={OFFICIAL.academy.url} target="_blank" rel="noreferrer">대학알리미 학과 정보 ↗</a>
          <a className="btn-ghost" href={OFFICIAL.adiga.url} target="_blank" rel="noreferrer">어디가 (전형·권장과목) ↗</a>
          <a className="btn-ghost" href={OFFICIAL.career.url} target="_blank" rel="noreferrer">커리어넷 학과정보 ↗</a>
        </div>
      </div>

      <div className="card">
        <h2 className="font-bold">같은 계열의 다른 학과</h2>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {similar.map((x) => <Link key={x.id} href={`/majors/${x.id}`} className="chip px-3 py-1.5 text-sm hover:border-brand-300">{x.name}</Link>)}
        </div>
      </div>
    </div>
  );
}
