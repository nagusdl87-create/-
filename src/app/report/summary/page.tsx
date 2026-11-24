"use client";

// 학부모·선생님 상담용 A4 한 장 요약 (결정 D7)
// 인쇄 시 A4 세로 한 쪽에 맞도록 여백·글자 크기를 줄이고 2단으로 배치해요.

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckSquare, Printer, Square } from "lucide-react";
import { decodeShare, useStore, type AppState } from "@/lib/store";
import { isTestComplete, riasecScores, topTypes, hsQuizResult } from "@/lib/match";
import { rankedAllJobs } from "@/lib/match-rank-all";
import { RIASEC, VALUES } from "@/data/riasec";
import { JOB_MAP } from "@/data/jobs";
import { MAJOR_MAP, MAJORS } from "@/data/majors";
import { HS_MAP } from "@/data/highschools";
import { GN_SCHOOLS, KIND_INFO } from "@/data/gn";
import { TRACKS } from "@/data/subjects";
import { activeTerm, TERMS_BY_STAGE } from "@/data/plan";
import { analyze } from "@/lib/credits";
import { useLang, useT } from "@/lib/i18n";

const PRINT_CSS = `
@media print {
  @page { size: A4 portrait; margin: 12mm; }
  html, body { background: #fff !important; }
  main#main { max-width: none !important; padding: 0 !important; margin: 0 !important; }
  .summary-sheet { font-size: 9.5pt; line-height: 1.38; }
  .summary-sheet * { break-inside: avoid; }
}
`;

export default function SummaryPage() {
  const store = useStore();
  const t = useT();
  const [shared, setShared] = useState<AppState | null>(null);
  const [hash, setHash] = useState("");

  useEffect(() => {
    const read = () => {
      const m = window.location.hash.match(/^#d=(.+)$/);
      setShared(m ? decodeShare(m[1]) : null);
      setHash(m ? window.location.hash : "");
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  if (!store.ready) return <div className="h-64" />;
  const s = shared ?? store.state;

  return (
    <div className="mx-auto max-w-3xl">
      <style>{PRINT_CSS}</style>
      <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-2">
        <Link href={`/report${hash}`} className="btn-ghost">
          <ArrowLeft size={16} aria-hidden /> {t("전체 리포트로")}
        </Link>
        <button type="button" className="btn-primary" onClick={() => window.print()}>
          <Printer size={16} aria-hidden /> {t("인쇄하기")}
        </button>
      </div>
      {shared && (
        <p className="no-print mb-4 rounded-2xl bg-amber-50 p-3 text-sm text-amber-900">{t("공유받은 기록으로 만든 요약이에요 (읽기 전용).")}</p>
      )}
      <p className="no-print mb-4 text-xs text-slate-500">
        {t("A4 한 장에 맞춰 인쇄돼요. 인쇄 창에서 용지를 A4, 배율을 ‘기본값’으로 두면 가장 깔끔해요.")}
      </p>
      <Sheet s={s} />
    </div>
  );
}

function Box({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  const t = useT();
  return (
    <section className={`min-w-0 rounded-xl border border-slate-200 bg-surface p-3 print:rounded-lg print:p-2 ${className}`}>
      <h2 className="mb-1.5 border-b border-slate-100 pb-1 text-xs font-bold text-brand-700 print:mb-1 print:text-[9pt]">{t(title)}</h2>
      {children}
    </section>
  );
}

function Empty({ children }: { children: string }) {
  const t = useT();
  return <p className="text-sm text-slate-500 print:text-[9pt]">{t(children)}</p>;
}

function Sheet({ s }: { s: AppState }) {
  const t = useT();
  const { lang } = useLang();
  const p = s.profile;
  const stage = p.stage || "ms";
  const tested = isTestComplete(s.answers);
  const scores = riasecScores(s.answers);
  const top3 = tested ? topTypes(scores, 3) : [];
  const values = s.values.slice(0, 3).map((id) => VALUES.find((v) => v.id === id)).filter((v) => !!v);

  // 직업: 찜한 직업 먼저, 모자라면 흥미 기반 추천
  const favJobs = s.favorites.map((id) => JOB_MAP[id]).filter(Boolean);
  const jobs: { job: (typeof favJobs)[number]; tag: string }[] = favJobs.slice(0, 3).map((job) => ({ job, tag: t("찜") }));
  if (jobs.length < 3 && tested) {
    for (const r of rankedAllJobs(s)) {
      if (jobs.length >= 3) break;
      if (!jobs.some((x) => x.job.id === r.job.id)) jobs.push({ job: r.job, tag: t("추천 {n}%", { n: r.score }) });
    }
  }

  // 학과: 관심 학과 먼저, 모자라면 위 직업과 연결된 학과
  const majors: { name: string; note: string; tag: string }[] = s.favMajors
    .map((id) => MAJOR_MAP[id])
    .filter(Boolean)
    .slice(0, 3)
    .map((m) => ({ name: t(m.name), note: m.core.slice(0, 3).map((x) => t(x)).join(", "), tag: t("찜") }));
  if (majors.length < 3 && jobs.length) {
    for (const m of MAJORS) {
      if (majors.length >= 3) break;
      if (majors.some((x) => x.name === t(m.name))) continue;
      if (jobs.some((j) => m.jobs.includes(j.job.id))) majors.push({ name: t(m.name), note: m.core.slice(0, 3).map((x) => t(x)).join(", "), tag: t("연결") });
    }
  }

  // 고교
  const hsQuizRec = Object.keys(s.hsQuiz).length > 0 ? hsQuizResult(s.hsQuiz, favJobs)[0]?.type : undefined;
  const hsTypes = s.hsInterest.map((h) => HS_MAP[h]).filter(Boolean);
  const schools = s.favSchools.map((id) => GN_SCHOOLS.find((x) => x.id === id)).filter((x) => !!x).slice(0, 3);

  // 192학점
  const planCount = Object.values(s.credits.plan).flat().length;
  const a = planCount ? analyze(s.credits.plan, s.credits.track) : null;
  const missingAreas = a ? a.areaResults.filter((x) => !x.ok) : [];

  // 이번 학기 할 일
  const termId = activeTerm(p.stage, s.currentTerm);
  const term = TERMS_BY_STAGE[stage].find((x) => x.id === termId);
  const items = [
    ...s.goals.filter((g) => g.term === termId).map((g) => ({ id: g.id, text: g.subject ? `[${t(g.subject)}] ${g.text}` : g.text, done: g.done })),
    ...(s.tasks[termId] ?? []).map((x) => ({ id: x.id, text: t(x.text), done: x.done })),
  ]
    .sort((x, y) => Number(x.done) - Number(y.done))
    .slice(0, 3);

  const today = new Date().toLocaleDateString(lang === "en" ? "en-US" : "ko-KR");
  const gradeLabel = p.grade ? t(stage === "hs" ? "고등학교 {g}학년" : "중학교 {g}학년", { g: p.grade }) : "";

  return (
    <article className="summary-sheet rounded-2xl border border-slate-200 bg-surface p-4 sm:p-6 print:rounded-none print:border-0 print:p-0">
      <header className="mb-3 flex flex-wrap items-end justify-between gap-2 border-b-2 border-slate-900 pb-2 print:mb-2">
        <div>
          <div className="text-xs font-bold text-brand-600 print:text-[8.5pt]">{t("마이로드 경남 · 진로·학업 기록")}</div>
          <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl print:text-[15pt]">{t("상담용 한 장 요약")}</h1>
        </div>
        <span className="text-xs text-slate-500 print:text-[8.5pt]">{t("학생이 스스로 기록한 내용을 바탕으로 만들었어요")}</span>
      </header>

      <dl className="mb-3 grid grid-cols-2 gap-x-3 gap-y-1 rounded-xl bg-slate-50 p-3 text-sm sm:grid-cols-4 print:mb-2 print:grid-cols-4 print:rounded-lg print:p-2 print:text-[9.5pt]">
        {[
          ["이름", p.name || "-"],
          ["학교", p.school || "-"],
          ["학년", gradeLabel || "-"],
          ["작성일", today],
        ].map(([k, v]) => (
          <div key={k} className="min-w-0">
            <dt className="text-xs text-slate-500 print:text-[8pt]">{t(k)}</dt>
            <dd className="truncate font-semibold text-slate-900" data-keep-ko={k === "이름" || k === "학교" ? "" : undefined}>{v}</dd>
          </div>
        ))}
      </dl>

      {s.hypothesis.trim() ? (
        <Box title="진로 가설·목표" className="mb-3 print:mb-2">
          <p className="line-clamp-3 whitespace-pre-wrap text-sm font-semibold text-slate-800 print:text-[9.5pt]" data-keep-ko>&ldquo;{s.hypothesis.trim()}&rdquo;</p>
        </Box>
      ) : (
        <Box title="진로 가설·목표" className="mb-3 print:mb-2">
          <Empty>{"아직 진로 가설을 적지 않았어요. 상담에서 함께 세워 보세요."}</Empty>
        </Box>
      )}

      <div className="grid gap-3 sm:grid-cols-2 print:grid-cols-2 print:gap-2">
        <Box title="흥미 유형 상위 3">
          {tested ? (
            <ol className="space-y-1 text-sm print:space-y-0.5 print:text-[9pt]">
              {top3.map((k, i) => (
                <li key={k}>
                  <b className="text-slate-900">
                    {i + 1}. {t(RIASEC[k].name)}({k})
                  </b>{" "}
                  <span className="text-xs text-slate-500 print:text-[8pt]">{t("{n}점", { n: scores[k] })}</span>
                  <div className="text-slate-600">{t(RIASEC[k].short)} &mdash; {t(RIASEC[k].desc).split(". ")[0].replace(/\.$/, "") + "."}</div>
                </li>
              ))}
            </ol>
          ) : (
            <Empty>{"흥미 탐색을 아직 하지 않았어요."}</Empty>
          )}
          <div className="mt-2 border-t border-slate-100 pt-1.5 print:mt-1 print:pt-1">
            <div className="text-xs font-bold text-slate-500 print:text-[8pt]">{t("중요한 가치 상위 3")}</div>
            {values.length ? (
              <ul className="text-sm text-slate-700 print:text-[9pt]">
                {values.map((v) => (
                  <li key={v.id}>
                    <b>{t(v.label)}</b> <span className="text-slate-500">&mdash; {t(v.desc)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>{"가치관을 아직 고르지 않았어요."}</Empty>
            )}
          </div>
        </Box>

        <div className="grid min-w-0 gap-3 print:gap-2">
          <Box title="관심·추천 직업">
            {jobs.length ? (
              <ol className="space-y-0.5 text-sm print:text-[9pt]">
                {jobs.map(({ job, tag }, i) => (
                  <li key={job.id}>
                    <b className="text-slate-900">
                      {i + 1}. {t(job.name)}
                    </b>{" "}
                    <span className="rounded bg-slate-100 px-1 text-[11px] text-slate-600 print:text-[7.5pt]">{tag}</span>
                    <div className="truncate text-xs text-slate-500 print:text-[8pt]">{t(job.summary)}</div>
                  </li>
                ))}
              </ol>
            ) : (
              <Empty>{"찜한 직업이 아직 없어요. 흥미 탐색을 하면 추천 직업도 보여 드려요."}</Empty>
            )}
          </Box>
          <Box title="관심 학과">
            {majors.length ? (
              <ol className="space-y-0.5 text-sm print:text-[9pt]">
                {majors.map((m, i) => (
                  <li key={m.name} className="truncate">
                    <b className="text-slate-900">
                      {i + 1}. {m.name}
                    </b>{" "}
                    <span className="rounded bg-slate-100 px-1 text-[11px] text-slate-600 print:text-[7.5pt]">{m.tag}</span>{" "}
                    <span className="text-xs text-slate-500 print:text-[8pt]">{t("핵심 {list}", { list: m.note })}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <Empty>{"관심 학과를 아직 고르지 않았어요."}</Empty>
            )}
          </Box>
        </div>

        <Box title="희망 고교 유형·관심 학교">
          <div className="text-sm print:text-[9pt]">
            {hsTypes.length ? (
              <div>
                <span className="text-xs text-slate-500 print:text-[8pt]">{t("희망 유형")}</span> <b>{hsTypes.map((h) => t(h.name)).join(", ")}</b>
              </div>
            ) : hsQuizRec ? (
              <div>
                <span className="text-xs text-slate-500 print:text-[8pt]">{t("퀴즈 추천")}</span> <b>{t(hsQuizRec.name)}</b>
              </div>
            ) : (
              <Empty>{"희망 고교 유형을 아직 정하지 않았어요."}</Empty>
            )}
            {schools.length > 0 ? (
              <ul className="mt-1 space-y-0.5">
                {schools.map((sc) => (
                  <li key={sc.id} className="truncate">
                    <b data-keep-ko>{sc.name}</b>{" "}
                    <span className="text-xs text-slate-500 print:text-[8pt]">
                      {t(sc.region)} · {t(KIND_INFO[sc.kind].name)} · {t(sc.round)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-xs text-slate-500 print:text-[8pt]">{t("저장한 관심 학교가 없어요.")}</p>
            )}
          </div>
        </Box>

        <Box title="192학점 설계 요약">
          {a ? (
            <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 text-sm print:text-[9pt]">
              <dt className="text-slate-500">{t("계열")}</dt>
              <dd className="font-semibold">{s.credits.track ? `${t(TRACKS[s.credits.track].name)}${a.trackFit ? ` (${t("적합도 {n}%", { n: a.trackFit.pct })})` : ""}` : t("아직 정하지 않았어요")}</dd>
              <dt className="text-slate-500">{t("학점 합계")}</dt>
              <dd className="font-semibold">
                {a.total + 18}{t("/192학점")} <span className="text-xs font-normal text-slate-500 print:text-[8pt]">{t("(교과 {n} + 창체 18)", { n: a.total })}</span>
              </dd>
              <dt className="text-slate-500">{t("필수 이수")}</dt>
              <dd className={`font-semibold ${missingAreas.length ? "text-amber-700" : "text-emerald-700"}`}>
                {missingAreas.length ? t("부족 {n}개 영역 ({list})", { n: missingAreas.length, list: missingAreas.map((x) => t(x.area.split("(")[0].split("/")[0])).join(", ") }) : t("모두 충족했어요")}
              </dd>
              <dt className="text-slate-500">{t("국·수·영")}</dt>
              <dd className="font-semibold">{t("{n}학점", { n: a.basic })} {t(a.basic > 81 ? "(상한 초과)" : "(상한 이내)")}</dd>
            </dl>
          ) : (
            <Empty>{stage === "hs" ? "192학점 설계를 아직 하지 않았어요." : "고등학교 192학점 설계는 아직이에요. 중3 2학기에 미리 해 볼 수 있어요."}</Empty>
          )}
        </Box>

        <Box title={`${t("이번 학기 할 일")}${term ? ` (${t(term.label)})` : ""}`} className="sm:col-span-2 print:col-span-2">
          {items.length ? (
            <ul className="grid gap-1 text-sm sm:grid-cols-3 print:grid-cols-3 print:text-[9pt]">
              {items.map((it) => (
                <li key={it.id} className="flex items-start gap-1.5">
                  {it.done ? (
                    <CheckSquare size={15} className="mt-0.5 shrink-0 text-emerald-600" aria-label={t("완료")} />
                  ) : (
                    <Square size={15} className="mt-0.5 shrink-0 text-slate-400" aria-label={t("진행 전")} />
                  )}
                  <span className={it.done ? "text-slate-500 line-through" : "text-slate-800"}>{it.text}</span>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>{"이번 학기 할 일이 아직 없어요. 학기별 실천 계획에서 추가해 보세요."}</Empty>
          )}
        </Box>
      </div>

      <section className="mt-3 rounded-xl border-2 border-slate-300 p-3 print:mt-2 print:rounded-lg print:p-2" aria-label={t("상담 메모")}>
        <h2 className="text-xs font-bold text-slate-700 print:text-[9pt]">{t("상담 메모")}</h2>
        <div aria-hidden className="mt-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-7 border-b border-dashed border-slate-300 print:h-[7.5mm]" />
          ))}
        </div>
      </section>

      <section className="mt-3 print:mt-2" aria-label={t("학생·보호자·선생님 확인")}>
        <h2 className="mb-1 text-xs font-bold text-slate-700 print:text-[9pt]">{t("학생·보호자·선생님 확인")}</h2>
        <div className="grid grid-cols-3 gap-3 text-xs text-slate-600 print:text-[8.5pt]">
          {["학생", "보호자", "선생님"].map((r) => (
            <div key={r} className="flex items-end gap-1">
              <span className="shrink-0">{t(r)}</span>
              <span className="h-6 flex-1 border-b border-slate-400" />
              <span className="shrink-0 text-slate-400">{t("(서명)")}</span>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
