"use client";

import Link from "next/link";
import { useEffect } from "react";
import { FIELDS, JOBS, JOB_MAP } from "@/data/jobs";
import { HS_MAP } from "@/data/highschools";
import { RIASEC, VALUES } from "@/data/riasec";
import { useStore } from "@/lib/store";
import { isTestComplete, jobMatch, riasecScores } from "@/lib/match";
import { FavButton } from "@/components/JobCard";
import { PathFlow } from "@/components/PathFlow";
import { MAJORS } from "@/data/majors";
import { GN_INDUSTRIES } from "@/data/gn";

export function JobDetail({ id }: { id: string }) {
  const job = JOB_MAP[id];
  const { state, ready, update } = useStore();
  // 열람 기록 (직업 열람 진행률)
  useEffect(() => {
    if (!ready) return;
    update((s) => {
      const v: string[] = (() => { try { return JSON.parse(s.portfolio["viewed.jobs"] ?? "[]"); } catch { return []; } })();
      return v.includes(id) ? s : { ...s, portfolio: { ...s.portfolio, "viewed.jobs": JSON.stringify([...v, id]) } };
    });
  }, [ready, id, update]);
  const tested = ready && isTestComplete(state.answers);
  const score = tested ? jobMatch(job, riasecScores(state.answers), state.values) : null;
  const majors = MAJORS.filter((m) => m.jobs.includes(job.id));
  const inds = GN_INDUSTRIES.filter((i) => i.jobs.includes(job.id));
  const similar = JOBS.filter((j) => j.id !== job.id && (j.field === job.field || j.riasec[0] === job.riasec[0])).slice(0, 4);

  return (
    <div className="space-y-4">
      <Link href="/jobs" className="text-sm font-semibold text-slate-500 hover:text-brand-600">
        ← 직업 목록
      </Link>
      <div className="card">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-slate-100 text-4xl">{job.emoji}</span>
            <div>
              <div className="text-xs font-semibold text-slate-500">
                {FIELDS[job.field].emoji} {FIELDS[job.field].name}
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900">{job.name}</h1>
              <div className="mt-1 flex flex-wrap gap-1">
                {job.riasec.map((k) => (
                  <span key={k} className="rounded-md px-1.5 py-0.5 text-[11px] font-bold text-white" style={{ background: RIASEC[k].color }}>
                    {RIASEC[k].name}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <FavButton id={job.id} className="h-11 w-11 text-xl" />
        </div>
        <p className="mt-4 leading-relaxed text-slate-700">{job.summary}</p>
        {score !== null ? (
          <div className="mt-4 rounded-xl bg-brand-50 p-3 text-sm">
            <span className="font-bold text-brand-700">나와 {score}% 잘 맞아요.</span>{" "}
            <span className="text-slate-600">
              이 직업은 {job.riasec.map((k) => RIASEC[k].name).join("·")} 흥미와,{" "}
              {job.values.map((v) => VALUES.find((x) => x.id === v)?.label).join("·")} 가치를 중요하게 여기는 사람에게 잘 맞아요.
            </span>
          </div>
        ) : (
          <Link href="/discover" className="mt-4 block rounded-xl bg-slate-50 p-3 text-sm text-slate-600 hover:bg-slate-100">
            💡 흥미 탐색을 하면 이 직업이 나와 얼마나 잘 맞는지 알려 드려요 →
          </Link>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <h2 className="font-bold">이런 일을 해요</h2>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
            {job.tasks.map((t) => (
              <li key={t}>• {t}</li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h2 className="font-bold">중학생인 지금 해 볼 수 있는 일</h2>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
            {job.msActions.map((t) => (
              <li key={t}>✓ {t}</li>
            ))}
          </ul>
          <Link href="/plan" className="mt-3 inline-block text-sm font-semibold text-brand-600">
            내 계획에 넣기 →
          </Link>
        </div>
      </div>

      {(job.gn || inds.length > 0) && (
        <div className="card border-emerald-200 bg-emerald-50">
          <h2 className="font-bold text-emerald-900">경남에서는?</h2>
          {job.gn && <p className="mt-1 text-sm text-emerald-900">{job.gn}</p>}
          {inds.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {inds.map((i) => (
                <Link key={i.id} href="/industry" className="chip border-emerald-300 bg-white">
                  {i.emoji} {i.name} · {i.regions.join("·")}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {majors.length > 0 && (
        <div className="card">
          <h2 className="font-bold">관련 학과 (학과 백과)</h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {majors.map((m) => (
              <Link key={m.id} href={`/majors/${m.id}`} className="chip px-3 py-1.5 text-sm hover:border-brand-300">
                {m.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="mb-3 font-bold">이 직업까지 가는 길</h2>
        <PathFlow job={job} />
      </div>

      <div className="card">
        <h2 className="font-bold">고려해 볼 만한 고등학교 유형</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {job.hsTypes.map((t) => (
            <Link key={t} href={`/highschool#${t}`} className="chip px-3 py-1.5 text-sm hover:border-brand-300">
              {HS_MAP[t].emoji} {HS_MAP[t].name}
            </Link>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-500">어느 고등학교에서든 이 직업을 준비할 수 있어요. 학교 유형별 특징을 비교해 보세요.</p>
      </div>

      <div className="card">
        <h2 className="font-bold">비슷한 직업</h2>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {similar.map((j) => (
            <Link key={j.id} href={`/jobs/${j.id}`} className="rounded-xl border border-slate-200 p-3 text-sm font-semibold hover:border-brand-300">
              {j.emoji} {j.name}
            </Link>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-400">
        더 자세한 직업 정보(전망, 임금, 직업인 인터뷰)는{" "}
        <a href="https://www.career.go.kr/" target="_blank" rel="noreferrer" className="underline">
          커리어넷
        </a>
        에서 확인할 수 있어요.
      </p>
    </div>
  );
}
