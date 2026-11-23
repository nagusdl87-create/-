"use client";

import { Award, ExternalLink, Heart, Lightbulb, Star } from "lucide-react";
import { MAJOR_DETAILS } from "@/data/majorDetails";
import { SUBJECT_DOCS, SUBJECT_DOCS_NOTE } from "@/data/univSubjects";
import type { MajorDeep } from "@/data/deep/types";
import { Faq, MajorDeepMain } from "@/components/Deep";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Major } from "@/data/majors-core";
import { SUBJECT_MAP, TRACKS } from "@/data/subjects";
import { OFFICIAL } from "@/data/gn";
import { MAJOR_MATCH } from "@/data/majorMatch";
import { UniversityList } from "@/components/UniversityList";
import { useUniv } from "@/lib/univ";
import type { MajorVideoKind, Video } from "@/data/videos";
import { Videos } from "@/components/Videos";
import { toggleIn, useStore } from "@/lib/store";
import { useEnData, useLang, useT } from "@/lib/i18n";
import { useNames } from "@/i18n/names";
import { CareerNetMajor } from "@/components/CareerNet";
import type { CnMajor } from "@/data/careernet";

export type MajorCtx = {
  major: Major;
  similar: { id: string; name: string }[];
  jobs: { id: string; name: string; emoji: string }[];
  vset: { kind: MajorVideoKind; videos: Video[] };
};

export function MajorDetail({ id, deep: deepKo, deepEn, cn, ctx }: { id: string; deep?: MajorDeep; deepEn?: MajorDeep; cn?: CnMajor & { fetchedAt: string }; ctx: MajorCtx }) {
  const m = ctx.major;
  const t = useT();
  const { subject: subjectLabel, job: jobLabel, majorById } = useNames();
  const majorName = majorById(m.id, m.name);
  const { lang } = useLang();
  const enM = useEnData(() => import("@/i18n/data/majors.en"), "majors");
  const enD = useEnData(() => import("@/i18n/data/majorDetails.en"), "majorDetails");
  const deep = lang === "en" && deepEn ? deepEn : deepKo;
  const e = enM?.MAJORS_EN[m.id];
  const name = e?.name ?? m.name;
  const trk = enM?.TRACK_EN[m.track];
  const nameOf = (x: { id: string; name: string }) => enM?.MAJORS_EN[x.id]?.name ?? x.name;
  const router = useRouter();
  const { state, update } = useStore();
  const on = state.favMajors.includes(m.id);
  const more = MAJOR_DETAILS[m.id];
  const moreEn = enD?.MAJOR_DETAILS_EN[m.id];
  const similar = ctx.similar;
  const vset = ctx.vset;
  const placed = new Set(Object.values(state.credits.plan).flat().map((e) => e.split("|")[0]));

  const Subj = ({ name, core }: { name: string; core?: boolean }) => (
    <Link
      href={`/subjects#${encodeURIComponent(name)}`}
      className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-sm font-semibold ${core ? "border-amber-200 bg-amber-50 text-amber-900" : "border-sky-200 bg-sky-50 text-sky-900"}`}
    >
      {core ? "★" : "☆"} {subjectLabel(name)}
      {SUBJECT_MAP[name]?.suneung && <span className="text-[11px] text-rose-700">{t("수능")}</span>}
      {placed.has(name) && <span className="text-[11px] text-emerald-600">{t("✓담음")}</span>}
    </Link>
  );

  return (
    <div className="space-y-4">
      <Link href="/majors" className="text-sm font-semibold text-slate-500 hover:text-brand-600">{t("← 학과 목록")}</Link>
      <div className="card">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-slate-500">{TRACKS[m.track].emoji} {trk ? t("{track} 계열 · {desc}", { track: trk.name, desc: trk.desc }) : `${TRACKS[m.track].name} 계열 · ${TRACKS[m.track].desc}`}</div>
            <h1 className="text-2xl font-extrabold">{name}</h1>
            {e && <div className="text-sm text-slate-500" data-keep-ko lang="ko">{m.name}</div>}
          </div>
          <button
            aria-pressed={on}
            aria-label={on ? t("찜 해제") : t("찜하기")}
            onClick={() => update((s) => ({ ...s, favMajors: toggleIn(s.favMajors, m.id) }))}
            className={`grid h-11 w-11 place-items-center rounded-full border text-xl ${on ? "border-rose-200 bg-rose-50" : "border-slate-200"}`}
          >
            <Heart className={`h-[18px] w-[18px] ${on ? "fill-rose-500 text-rose-500" : "text-slate-400"}`} aria-hidden />
          </button>
        </div>
        <p className="mt-3 text-lg font-medium leading-relaxed text-slate-800">{e?.desc ?? m.desc}</p>
        {deep && <p className="mt-2 leading-relaxed text-slate-600">{deep.intro}</p>}
      </div>

      <MajorDeepMain d={deep} />
      {cn && <CareerNetMajor d={cn} />}

      <div className="card">
        <h2 className="font-bold">{t("고등학교에서 들으면 좋은 과목")}</h2>
        <div className="mt-3 text-xs font-semibold text-slate-500">{t("핵심 과목")}</div>
        <div className="mt-1 flex flex-wrap gap-1.5">{m.core.map((s) => <Subj key={s} name={s} core />)}</div>
        <div className="mt-3 text-xs font-semibold text-slate-500">{t("권장 과목")}</div>
        <div className="mt-1 flex flex-wrap gap-1.5">{m.rec.map((s) => <Subj key={s} name={s} />)}</div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            className="btn-primary"
            onClick={() => {
              update((s) => ({ ...s, credits: { ...s.credits, track: m.track }, favMajors: s.favMajors.includes(m.id) ? s.favMajors : [...s.favMajors, m.id] }));
              router.push("/credits");
            }}
          >
            {t("이 학과 기준으로 192학점 설계하기")}
          </button>
        </div>
        <div className="mt-4 rounded-xl border border-slate-200 p-3">
          <div className="text-sm font-bold text-slate-800">{t("대학이 발표한 2028학년도 권장과목 원문")}</div>
          <p className="mt-1 text-xs text-slate-500">{t("위 과목은 일반적인 안내예요. 지원할 대학이 정한 과목은 아래 공식 자료에서 학과(모집단위)를 찾아 확인하세요.")}</p>
          <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {SUBJECT_DOCS.map((d) => {
              const de = enD?.SUBJECT_DOCS_EN[d.univ];
              const note = de ? de.note : d.note;
              return (
              <li key={d.univ}>
                <a href={d.url} target="_blank" rel="noreferrer" className="flex items-start gap-1.5 rounded-lg bg-slate-50 px-2.5 py-2 text-sm hover:bg-slate-100">
                  <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" aria-hidden />
                  <span><b className="text-slate-900" data-keep-ko>{d.univ}</b> <span className="text-slate-600">{de?.title ?? d.title}</span>{note && <span className="block text-xs text-slate-500">{note}</span>}</span>
                </a>
              </li>
              );
            })}
          </ul>
          <p className="mt-2 text-xs text-slate-500">{t(SUBJECT_DOCS_NOTE)} <a href={OFFICIAL.adiga.url} target="_blank" rel="noreferrer" className="underline">{t("어디가 바로가기")}</a></p>
        </div>
      </div>

      {more && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card">
            <h2 className="flex items-center gap-1.5 font-bold"><Star className="h-4 w-4 text-brand-600" aria-hidden /> {t("이런 학생에게 잘 맞아요")}</h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(moreEn ?? more).aptitude.map((x) => (
                <span key={x} className="chip">{x}</span>
              ))}
            </div>
            <h3 className="mt-4 text-sm font-bold text-slate-800">{t("고등학교에서 해 볼 활동")}</h3>
            <ul className="mt-1.5 space-y-1.5 text-sm text-slate-700">
              {(moreEn ?? more).activities.map((x) => (
                <li key={x}>✓ {x}</li>
              ))}
            </ul>
          </div>
          <div className="card space-y-4">
            <div>
              <h2 className="flex items-center gap-1.5 font-bold"><Lightbulb className="h-4 w-4 text-violet-600" aria-hidden /> {t("알아 두면 좋은 점")}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{(moreEn ?? more).tip}</p>
            </div>
            <div>
              <h2 className="flex items-center gap-1.5 font-bold"><Award className="h-4 w-4 text-amber-600" aria-hidden /> {t("관련 자격·면허")}</h2>
              {more.certs.length ? (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {more.certs.map((c, i) => (
                    <span key={c} className="rounded-lg bg-amber-50 px-2 py-1 text-xs font-medium text-amber-900">
                      {moreEn?.certs[i] ? <>{moreEn.certs[i]} <span data-keep-ko lang="ko">({c})</span></> : c}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-1.5 text-sm text-slate-500">{t("특정 자격보다 전공 지식과 경험이 중요한 학과예요.")}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="card">
        {vset.kind === "direct" ? (
          <>
            <h2 className="mb-3 font-bold">{t("학과 소개 영상")}</h2>
            <Videos videos={vset.videos} query={m.name} label={majorName} />
          </>
        ) : vset.kind === "jobs" ? (
          <>
            <h2 className="font-bold">{t("관련 직업 영상")}</h2>
            <p className="mb-3 mt-0.5 text-xs text-slate-500">{t("공식 채널에 이 학과 소개 영상이 아직 없어, 졸업 후 진출하는 직업의 영상을 보여 줘요.")}</p>
            <Videos videos={vset.videos} query={m.name} label={majorName} />
          </>
        ) : vset.kind === "jobField" ? (
          <>
            <h2 className="mb-3 font-bold">{t("관련 직업 영상")}</h2>
            <Videos videos={vset.videos} query={m.name} label={majorName} note={t("이 학과나 관련 직업을 직접 소개한 영상은 아직 없어요. 관련 직업과 같은 분야 직업의 영상을 대신 보여 드려요.")} />
          </>
        ) : (
          <>
            <h2 className="mb-3 font-bold">{t("같은 계열 영상")}</h2>
            <Videos videos={vset.videos} query={m.name} label={majorName} note={t("이 학과나 관련 직업을 직접 소개한 영상은 아직 없어요. 같은 계열 다른 학과의 영상을 대신 보여 드려요.")} />
          </>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <h2 className="font-bold">{t("대학에서 배우는 과목")}</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">{(e?.univ ?? m.univ).map((u) => <li key={u}>• {u}</li>)}</ul>
        </div>
        <div className="card">
          <h2 className="font-bold">{t("졸업 후 진로")}</h2>
          <div className="mt-2 flex flex-wrap gap-1.5">{(e?.careers ?? m.careers).map((c) => <span key={c} className="chip">{c}</span>)}</div>
          <div className="mt-3 text-xs font-semibold text-slate-500">{t("관련 직업")}</div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {ctx.jobs.map((j) => <Link key={j.id} href={`/jobs/${j.id}`} className="chip hover:border-brand-300">{j.emoji} {jobLabel(j.name)}</Link>)}
          </div>
        </div>
      </div>

      {MAJOR_MATCH[m.id] && (
        <div className="card">
          <h2 className="mb-1 font-bold">{t("전국 개설 대학 (경남 먼저)")}</h2>
          <OfficialMajorInfo match={MAJOR_MATCH[m.id]} />
          <div className="mt-4">
            <UniversityList match={MAJOR_MATCH[m.id]} title={t("{name} 및 유사 학과", { name })} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <a className="btn-ghost" href={OFFICIAL.academy.url} target="_blank" rel="noreferrer">{t("대학알리미 ↗")}</a>
            <a className="btn-ghost" href={OFFICIAL.adiga.url} target="_blank" rel="noreferrer">{t("어디가 (전형·권장과목) ↗")}</a>
            <a className="btn-ghost" href={OFFICIAL.career.url} target="_blank" rel="noreferrer">{t("커리어넷 학과정보 ↗")}</a>
          </div>
        </div>
      )}

      <Faq items={deep?.faq ?? []} />

      <div className="card">
        <h2 className="font-bold">{t("같은 계열의 다른 학과")}</h2>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {similar.map((x) => <Link key={x.id} href={`/majors/${x.id}`} className="chip px-3 py-1.5 text-sm hover:border-brand-300">{nameOf(x)}</Link>)}
        </div>
      </div>
    </div>
  );
}

// 전국 학과 데이터에서 이 학과와 비슷한 학과들의 주요 교과목·관련 직업 모아 보기
function OfficialMajorInfo({ match }: { match: { inc: RegExp; exc?: RegExp } }) {
  const { data } = useUniv();
  const t = useT();
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
        <div className="text-xs font-semibold text-slate-500">{t("전국 대학에서 많이 가르치는 교과목")}</div>
        <div className="mt-1.5 flex flex-wrap gap-1" data-keep-ko>{top(subj).map((s) => <span key={s} className="chip bg-white">{s}</span>)}</div>
      </div>
      <div className="rounded-xl bg-slate-50 p-3">
        <div className="text-xs font-semibold text-slate-500">{t("대학이 밝힌 관련 직업")}</div>
        <div className="mt-1.5 flex flex-wrap gap-1" data-keep-ko>{top(jobs).map((s) => <span key={s} className="chip bg-white">{s}</span>)}</div>
      </div>
    </div>
  );
}
