"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { FIELDS, JOBS, JOB_MAP } from "@/data/jobs";
import { HS_MAP } from "@/data/highschools";
import { RIASEC, VALUES } from "@/data/riasec";
import { useStore } from "@/lib/store";
import { isTestComplete, jobMatch, riasecScores } from "@/lib/match";
import { FavButton, useJobsEn } from "@/components/JobCard";
import { PathFlow } from "@/components/PathFlow";
import { MAJORS } from "@/data/majors";
import { jobVideos } from "@/data/videos";
import { Videos } from "@/components/Videos";
import { GN_INDUSTRIES } from "@/data/gn";
import { JOB_DETAILS } from "@/data/jobDetails";
import type { JobDeep } from "@/data/deep/types";
import { Faq, JobDeepMain, JobDeepWork, JobFuture } from "@/components/Deep";
import { KeepKo } from "@/components/KeepKo";
import { useEnData, useLang, useT } from "@/lib/i18n";
import { majorLabel, subjectLabel } from "@/lib/subjectLabelJobs";
import { Award, Building2, Sparkles, TrendingUp } from "lucide-react";

export function JobDetail({ id, deep: deepKo, deepEn }: { id: string; deep?: JobDeep; deepEn?: JobDeep }) {
  const ko = JOB_MAP[id];
  const t = useT();
  const { lang } = useLang();
  const en = useJobsEn();
  const detEn = useEnData(() => import("@/i18n/data/jobDetails.en"), "jobDetails");
  const isEn = lang === "en" && !!en;
  const e = isEn ? en.JOBS_EN[ko.id] : undefined;
  // 영어 모드: 이름·요약·하는 일·중학생 활동·경남 설명은 영어 자료로, 과목·학과 이름은 연결 함수로 바꾼다.
  const job = useMemo(
    () => ({
      ...ko,
      name: e?.name ?? ko.name,
      summary: e?.summary ?? ko.summary,
      tasks: e?.tasks ?? ko.tasks,
      msActions: e?.msActions ?? ko.msActions,
      gn: e ? e.gn : ko.gn,
      hsSubjects: ko.hsSubjects.map(subjectLabel),
      majors: ko.majors.map(majorLabel),
    }),
    [ko, e],
  );
  const deep = isEn && deepEn ? deepEn : deepKo;
  const jobName = (j: { id: string; name: string }) => (isEn ? en.JOBS_EN[j.id]?.name : undefined) ?? j.name;
  const fieldName = isEn ? en.FIELDS_EN[ko.field] : FIELDS[ko.field].name;

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
  const score = tested ? jobMatch(ko, riasecScores(state.answers), state.values) : null;
  const more = (lang === "en" ? detEn?.JOB_DETAILS_EN[ko.id] : undefined) ?? JOB_DETAILS[ko.id];
  const majors = MAJORS.filter((m) => m.jobs.includes(ko.id));
  const inds = GN_INDUSTRIES.filter((i) => i.jobs.includes(ko.id));
  const similar = JOBS.filter((j) => j.id !== ko.id && (j.field === ko.field || j.riasec[0] === ko.riasec[0])).slice(0, 4);
  const sep = isEn ? ", " : "·";
  const more1 = t("더 자세한 직업 정보(전망, 임금, 직업인 인터뷰)는 {link}에서 확인할 수 있어요.").split("{link}");

  return (
    <div className="space-y-4">
      <Link href="/jobs" className="text-sm font-semibold text-slate-500 hover:text-brand-600">
        ← {t("직업 목록")}
      </Link>
      <div className="card">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-slate-100 text-4xl">{job.emoji}</span>
            <div>
              <div className="text-xs font-semibold text-slate-500">
                {FIELDS[job.field].emoji} {fieldName}
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900">{job.name}</h1>
              <div className="mt-1 flex flex-wrap gap-1">
                {job.riasec.map((k) => (
                  <span key={k} className="rounded-md px-1.5 py-0.5 text-[11px] font-bold text-white" style={{ background: RIASEC[k].color }}>
                    {t(RIASEC[k].name)}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <FavButton id={job.id} className="h-11 w-11 text-xl" />
        </div>
        <p className="mt-4 text-lg font-medium leading-relaxed text-slate-800">{job.summary}</p>
        {deep && <p className="mt-2 leading-relaxed text-slate-600"><KeepKo text={deep.intro} /></p>}
        {score !== null ? (
          <div className="mt-4 rounded-xl bg-brand-50 p-3 text-sm">
            <span className="font-bold text-brand-700">{t("나와 {score}% 잘 맞아요.", { score })}</span>{" "}
            <span className="text-slate-600">
              {t("이 직업은 {types} 흥미와, {values} 가치를 중요하게 여기는 사람에게 잘 맞아요.", {
                types: job.riasec.map((k) => t(RIASEC[k].name)).join(sep),
                values: job.values.map((v) => t(VALUES.find((x) => x.id === v)?.label ?? "")).join(sep),
              })}
            </span>
          </div>
        ) : (
          <Link href="/discover" className="mt-4 block rounded-xl bg-slate-50 p-3 text-sm text-slate-600 hover:bg-slate-100">
            💡 {t("흥미 탐색을 하면 이 직업이 나와 얼마나 잘 맞는지 알려 드려요 →")}
          </Link>
        )}
      </div>

      <div className="card">
        <h2 className="mb-3 font-bold">{t("직업인 영상")}</h2>
        <Videos videos={jobVideos(job.id)} query={ko.name} label={job.name} />
      </div>

      <JobDeepMain d={deep} tasks={job.tasks} ms={job.msActions} />

      {more && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card">
            <h2 className="flex items-center gap-1.5 font-bold"><Sparkles className="h-4 w-4 text-brand-600" aria-hidden /> {t("이런 사람에게 잘 맞아요")}</h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {more.aptitude.map((a) => (
                <span key={a} className="chip">{a}</span>
              ))}
            </div>
            <h3 className="mt-4 text-sm font-bold text-slate-800">{t("되는 방법")}</h3>
            <ol className="mt-1.5 space-y-1.5 text-sm text-slate-700">
              {more.prepare.map((p, i) => (
                <li key={p} className="flex gap-2"><span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-100 text-[11px] font-bold text-brand-800">{i + 1}</span><span><KeepKo text={p} /></span></li>
              ))}
            </ol>
          </div>
          <div className="card space-y-4">
            <div>
              <h2 className="flex items-center gap-1.5 font-bold"><Building2 className="h-4 w-4 text-sky-600" aria-hidden /> {t("일하는 곳")}</h2>
              <p className="mt-1.5 text-sm text-slate-700">{more.places.join(" · ")}</p>
            </div>
            <div>
              <h2 className="flex items-center gap-1.5 font-bold"><Award className="h-4 w-4 text-amber-600" aria-hidden /> {t("관련 자격")}</h2>
              {more.certs.length ? (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {more.certs.map((c) => (
                    <span key={c} className="rounded-lg bg-amber-50 px-2 py-1 text-xs font-medium text-amber-900"><KeepKo text={c} /></span>
                  ))}
                </div>
              ) : (
                <p className="mt-1.5 text-sm text-slate-500">{t("꼭 필요한 자격증보다 실력과 경험(작품·경력)이 중요한 직업이에요.")}</p>
              )}
              <a href="https://www.q-net.or.kr" target="_blank" rel="noreferrer" className="mt-1.5 inline-block text-xs text-slate-500 underline">{t("응시 자격·시험 일정은 큐넷에서 확인")}</a>
            </div>
            <div>
              <h2 className="flex items-center gap-1.5 font-bold"><TrendingUp className="h-4 w-4 text-violet-600" aria-hidden /> {t("앞으로의 전망")}</h2>
              <p className="mt-1.5 text-sm text-slate-700">{more.outlook}</p>
            </div>
          </div>
        </div>
      )}

      <JobDeepWork d={deep} />
      <JobFuture d={deep} />

      {(job.gn || inds.length > 0) && (
        <div className="card border-emerald-200 bg-emerald-50">
          <h2 className="font-bold text-emerald-900">{t("경남에서는?")}</h2>
          {job.gn && <p className="mt-1 text-sm text-emerald-900"><KeepKo text={job.gn} /></p>}
          {inds.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {inds.map((i) => (
                <Link key={i.id} href="/industry" className="chip border-emerald-300 bg-white">
                  {i.emoji} {t(i.name)} · {i.regions.map((r) => t(r)).join(sep)}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {majors.length > 0 && (
        <div className="card">
          <h2 className="font-bold">{t("관련 학과 (학과 백과)")}</h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {majors.map((m) => (
              <Link key={m.id} href={`/majors/${m.id}`} className="chip px-3 py-1.5 text-sm hover:border-brand-300">
                {majorLabel(m.name)}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="mb-3 font-bold">{t("이 직업까지 가는 길")}</h2>
        <PathFlow job={job} />
      </div>

      <div className="card">
        <h2 className="font-bold">{t("고려해 볼 만한 고등학교 유형")}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {job.hsTypes.map((h) => (
            <Link key={h} href={`/highschool#${h}`} className="chip px-3 py-1.5 text-sm hover:border-brand-300">
              {HS_MAP[h].emoji} {t(HS_MAP[h].name)}
            </Link>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-500">{t("어느 고등학교에서든 이 직업을 준비할 수 있어요. 학교 유형별 특징을 비교해 보세요.")}</p>
      </div>

      <Faq items={deep?.faq ?? []} />

      <div className="card">
        <h2 className="font-bold">{t("비슷한 직업")}</h2>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {similar.map((j) => (
            <Link key={j.id} href={`/jobs/${j.id}`} className="rounded-xl border border-slate-200 p-3 text-sm font-semibold hover:border-brand-300">
              {j.emoji} {jobName(j)}
            </Link>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-400">
        {more1[0]}
        <a href="https://www.career.go.kr/" target="_blank" rel="noreferrer" className="underline">
          {t("커리어넷")}
        </a>
        {more1[1]}
      </p>
    </div>
  );
}
