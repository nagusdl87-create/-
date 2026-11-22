"use client";

import { Award, Heart, Lightbulb, Sparkles } from "lucide-react";
import { MAJOR_DETAILS } from "@/data/majorDetails";
import { MAJOR_DEEP } from "@/data/deep";
import { Faq, MajorDeepMain } from "@/components/Deep";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MAJOR_MAP, MAJORS } from "@/data/majors";
import { SUBJECT_MAP, TRACKS } from "@/data/subjects";
import { JOB_MAP } from "@/data/jobs";
import { OFFICIAL } from "@/data/gn";
import { MAJOR_MATCH } from "@/data/majorMatch";
import { UniversityList } from "@/components/UniversityList";
import { useUniv } from "@/lib/univ";
import { majorVideos, relatedJobVideos } from "@/data/videos";
import { Videos } from "@/components/Videos";
import { toggleIn, useStore } from "@/lib/store";

export function MajorDetail({ id }: { id: string }) {
  const m = MAJOR_MAP[id];
  const router = useRouter();
  const { state, update } = useStore();
  const on = state.favMajors.includes(m.id);
  const more = MAJOR_DETAILS[m.id];
  const deep = MAJOR_DEEP[m.id];
  const similar = MAJORS.filter((x) => x.track === m.track && x.id !== m.id).slice(0, 6);
  const placed = new Set(Object.values(state.credits.plan).flat().map((e) => e.split("|")[0]));

  const Subj = ({ name, core }: { name: string; core?: boolean }) => (
    <Link
      href={`/subjects#${encodeURIComponent(name)}`}
      className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-sm font-semibold ${core ? "border-amber-200 bg-amber-50 text-amber-900" : "border-sky-200 bg-sky-50 text-sky-900"}`}
    >
      {core ? "★" : "☆"} {name}
      {SUBJECT_MAP[name]?.suneung && <span className="text-[11px] text-rose-600">수능</span>}
      {placed.has(name) && <span className="text-[11px] text-emerald-600">✓담음</span>}
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
            <Heart className={`h-[18px] w-[18px] ${on ? "fill-rose-500 text-rose-500" : "text-slate-400"}`} aria-hidden />
          </button>
        </div>
        <p className="mt-3 text-lg font-medium leading-relaxed text-slate-800">{m.desc}</p>
        {deep && <p className="mt-2 leading-relaxed text-slate-600">{deep.intro}</p>}
      </div>

      <MajorDeepMain d={deep} />

      <div className="card">
        <h2 className="font-bold">고등학교에서 들으면 좋은 과목</h2>
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
            이 학과 기준으로 192학점 설계하기
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-400">일반적인 안내예요. 지원할 대학의 학과별 권장과목은 반드시 대학 발표 자료로 확인하세요.</p>
      </div>

      {more && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card">
            <h2 className="flex items-center gap-1.5 font-bold"><Sparkles className="h-4 w-4 text-brand-600" aria-hidden /> 이런 학생에게 잘 맞아요</h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {more.aptitude.map((t) => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>
            <h3 className="mt-4 text-sm font-bold text-slate-800">고등학교에서 해 볼 활동</h3>
            <ul className="mt-1.5 space-y-1.5 text-sm text-slate-700">
              {more.activities.map((t) => (
                <li key={t}>✓ {t}</li>
              ))}
            </ul>
          </div>
          <div className="card space-y-4">
            <div>
              <h2 className="flex items-center gap-1.5 font-bold"><Lightbulb className="h-4 w-4 text-violet-600" aria-hidden /> 알아 두면 좋은 점</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{more.tip}</p>
            </div>
            <div>
              <h2 className="flex items-center gap-1.5 font-bold"><Award className="h-4 w-4 text-amber-600" aria-hidden /> 관련 자격·면허</h2>
              {more.certs.length ? (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {more.certs.map((c) => (
                    <span key={c} className="rounded-lg bg-amber-50 px-2 py-1 text-xs font-medium text-amber-900">{c}</span>
                  ))}
                </div>
              ) : (
                <p className="mt-1.5 text-sm text-slate-500">특정 자격보다 전공 지식과 경험이 중요한 학과예요.</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="card">
        {majorVideos(m.id).length > 0 ? (
          <>
            <h2 className="mb-3 font-bold">학과 소개 영상</h2>
            <Videos videos={majorVideos(m.id)} query={m.name} />
          </>
        ) : (
          <>
            <h2 className="font-bold">관련 직업 영상</h2>
            <p className="mb-3 mt-0.5 text-xs text-slate-500">공식 채널에 이 학과 소개 영상이 아직 없어, 졸업 후 진출하는 직업의 영상을 보여 줘요.</p>
            <Videos videos={relatedJobVideos(m.jobs)} query={m.name} />
          </>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <h2 className="font-bold">대학에서 배우는 과목</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">{m.univ.map((u) => <li key={u}>• {u}</li>)}</ul>
        </div>
        <div className="card">
          <h2 className="font-bold">졸업 후 진로</h2>
          <div className="mt-2 flex flex-wrap gap-1.5">{m.careers.map((c) => <span key={c} className="chip">{c}</span>)}</div>
          <div className="mt-3 text-xs font-semibold text-slate-500">관련 직업</div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {m.jobs.map((j) => JOB_MAP[j] && <Link key={j} href={`/jobs/${j}`} className="chip hover:border-brand-300">{JOB_MAP[j].emoji} {JOB_MAP[j].name}</Link>)}
          </div>
        </div>
      </div>

      {MAJOR_MATCH[m.id] && (
        <div className="card">
          <h2 className="mb-1 font-bold">전국 개설 대학 (경남 먼저)</h2>
          <OfficialMajorInfo match={MAJOR_MATCH[m.id]} />
          <div className="mt-4">
            <UniversityList match={MAJOR_MATCH[m.id]} title={`${m.name} 및 유사 학과`} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <a className="btn-ghost" href={OFFICIAL.academy.url} target="_blank" rel="noreferrer">대학알리미 ↗</a>
            <a className="btn-ghost" href={OFFICIAL.adiga.url} target="_blank" rel="noreferrer">어디가 (전형·권장과목) ↗</a>
            <a className="btn-ghost" href={OFFICIAL.career.url} target="_blank" rel="noreferrer">커리어넷 학과정보 ↗</a>
          </div>
        </div>
      )}

      <Faq items={deep?.faq ?? []} />

      <div className="card">
        <h2 className="font-bold">같은 계열의 다른 학과</h2>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {similar.map((x) => <Link key={x.id} href={`/majors/${x.id}`} className="chip px-3 py-1.5 text-sm hover:border-brand-300">{x.name}</Link>)}
        </div>
      </div>
    </div>
  );
}

// 전국 학과 데이터에서 이 학과와 비슷한 학과들의 주요 교과목·관련 직업 모아 보기
function OfficialMajorInfo({ match }: { match: { inc: RegExp; exc?: RegExp } }) {
  const { data } = useUniv();
  if (!data) return null;
  const subj = new Map<string, number>();
  const jobs = new Map<string, number>();
  for (const g of data.groups) {
    const n = g.depts.filter((d) => match.inc.test(d[1]) && !(match.exc && match.exc.test(d[1]))).length;
    if (!n) continue;
    g.subjects.forEach((s, i) => subj.set(s, (subj.get(s) ?? 0) + n * (12 - i)));
    g.jobs.forEach((s, i) => jobs.set(s, (jobs.get(s) ?? 0) + n * (12 - i)));
  }
  const top = (m: Map<string, number>) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([k]) => k);
  if (!subj.size) return null;
  return (
    <div className="mt-2 grid gap-3 md:grid-cols-2">
      <div className="rounded-xl bg-slate-50 p-3">
        <div className="text-xs font-semibold text-slate-500">전국 대학에서 많이 가르치는 교과목</div>
        <div className="mt-1.5 flex flex-wrap gap-1">{top(subj).map((s) => <span key={s} className="chip bg-white">{s}</span>)}</div>
      </div>
      <div className="rounded-xl bg-slate-50 p-3">
        <div className="text-xs font-semibold text-slate-500">대학이 밝힌 관련 직업</div>
        <div className="mt-1.5 flex flex-wrap gap-1">{top(jobs).map((s) => <span key={s} className="chip bg-white">{s}</span>)}</div>
      </div>
    </div>
  );
}
