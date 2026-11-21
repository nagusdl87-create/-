"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { decodeShare, encodeShare, useStore, type AppState } from "@/lib/store";
import { isTestComplete, progress, riasecScores, topTypes, hsQuizResult } from "@/lib/match";
import { RIASEC, VALUES } from "@/data/riasec";
import { JOB_MAP } from "@/data/jobs";
import { HS_MAP } from "@/data/highschools";
import { TERMS_BY_STAGE } from "@/data/plan";
import { Radar } from "@/components/Radar";
import { MAJOR_MAP } from "@/data/majors";
import { GN_SCHOOLS, KIND_INFO } from "@/data/gn";
import { TRACKS } from "@/data/subjects";
import { analyze, parseEntry, SEM_LABEL } from "@/lib/credits";
import { SEMS } from "@/lib/store";

export default function ReportPage() {
  const store = useStore();
  const [shared, setShared] = useState<AppState | null>(null);

  useEffect(() => {
    const read = () => {
      const m = window.location.hash.match(/^#d=(.+)$/);
      setShared(m ? decodeShare(m[1]) : null);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  if (!store.ready) return <div className="h-64" />;
  const s = shared ?? store.state;

  return (
    <div>
      {shared && (
        <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
          <span>👀 공유받은 진로 리포트를 보고 있어요 (읽기 전용).</span>
          <button
            className="btn-ghost py-1.5"
            onClick={() => {
              history.replaceState(null, "", "/report");
              setShared(null);
            }}
          >
            내 리포트로 돌아가기
          </button>
        </div>
      )}
      <ReportBody s={s} />
      {!shared && <Tools />}
    </div>
  );
}

function ReportBody({ s }: { s: AppState }) {
  const tested = isTestComplete(s.answers);
  const scores = riasecScores(s.answers);
  const [a, b] = topTypes(scores);
  const favs = s.favorites.map((id) => JOB_MAP[id]).filter(Boolean);
  const hs = hsQuizResult(s.hsQuiz, favs).slice(0, 3);
  const hasHs = Object.keys(s.hsQuiz).length > 0 || favs.length > 0;
  const p = progress(s);
  const g = s.profile.grade;

  return (
    <article className="space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-slate-900 pb-3">
        <div>
          <div className="text-xs font-bold text-brand-600">마이로드 경남 · 진로·학업 설계 리포트</div>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">{s.profile.name ? `${s.profile.name}의 진로 지도` : "나의 진로 지도"}</h1>
          <div className="text-sm text-slate-500">
            {[s.profile.school, g ? `${s.profile.stage === "hs" ? "고등학교" : "중학교"} ${g}학년` : ""].filter(Boolean).join(" · ")}
          </div>
        </div>
        <div className="text-right text-xs text-slate-500">
          진행 {p.doneCount}/5 단계 · 할 일 {p.taskDone}/{p.taskTotal}
          <br />
          {new Date().toLocaleDateString("ko-KR")} 기준
        </div>
      </header>

      {s.hypothesis && (
        <section className="card border-brand-200 bg-brand-50">
          <div className="text-xs font-bold text-brand-700">✍️ 나의 진로 가설</div>
          <p className="mt-1 whitespace-pre-wrap text-base font-semibold leading-relaxed text-slate-800">&ldquo;{s.hypothesis}&rdquo;</p>
        </section>
      )}

      <section className="grid gap-4 md:grid-cols-[auto_1fr]">
        <div className="card flex flex-col items-center">
          <div className="self-start text-xs font-bold text-slate-500">흥미 유형</div>
          {tested ? <Radar scores={scores} size={240} /> : <p className="py-10 text-sm text-slate-400">아직 흥미 탐색 전이에요</p>}
        </div>
        <div className="card space-y-3">
          {tested && (
            <div>
              <div className="text-xs font-bold text-slate-500">흥미 코드</div>
              <div className="text-lg font-extrabold">
                {RIASEC[a].emoji} {RIASEC[a].name}({a}) · {RIASEC[b].name}({b})
              </div>
              <p className="text-sm text-slate-600">{RIASEC[a].desc}</p>
            </div>
          )}
          <div>
            <div className="text-xs font-bold text-slate-500">중요한 가치</div>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {s.values.length ? s.values.map((v) => <span key={v} className="chip chip-on">{VALUES.find((x) => x.id === v)?.emoji} {VALUES.find((x) => x.id === v)?.label}</span>) : <span className="text-sm text-slate-400">-</span>}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500">나의 강점</div>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {s.strengths.length ? s.strengths.map((x) => <span key={x} className="chip">💪 {x}</span>) : <span className="text-sm text-slate-400">-</span>}
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="text-xs font-bold text-slate-500">관심 직업과 가는 길</div>
        {favs.length === 0 ? (
          <p className="mt-2 text-sm text-slate-400">찜한 직업이 없어요.</p>
        ) : (
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="text-xs text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="py-2 pr-2">직업</th>
                  <th className="py-2 pr-2">대학 학과</th>
                  <th className="py-2">고교 선택과목</th>
                </tr>
              </thead>
              <tbody>
                {favs.map((j, i) => (
                  <tr key={j.id} className="border-b border-slate-100 align-top">
                    <td className="py-2 pr-2 font-semibold">
                      {j.emoji} {j.name}
                      {i === 0 && <span className="ml-1 rounded bg-brand-600 px-1 text-[10px] text-white">대표</span>}
                    </td>
                    <td className="py-2 pr-2 text-slate-600">{j.majors.slice(0, 3).join(", ")}</td>
                    <td className="py-2 text-slate-600">{j.hsSubjects.slice(0, 5).join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <div className="text-xs font-bold text-slate-500">관심 고교 유형</div>
          <ul className="mt-2 space-y-1 text-sm">
            {s.hsInterest.map((h) => (
              <li key={h} className="font-semibold">⭐ {HS_MAP[h].emoji} {HS_MAP[h].name}</li>
            ))}
            {hasHs &&
              hs
                .filter((x) => !s.hsInterest.includes(x.type.id))
                .map((x) => (
                  <li key={x.type.id} className="text-slate-600">
                    {x.type.emoji} {x.type.name} <span className="text-xs text-slate-400">(퀴즈 추천)</span>
                  </li>
                ))}
            {!hasHs && s.hsInterest.length === 0 && <li className="text-slate-400">-</li>}
          </ul>
        </div>
        <div className="card">
          <div className="text-xs font-bold text-slate-500">학기별 실천</div>
          <ul className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
            {TERMS_BY_STAGE[s.profile.stage || "ms"].map((t) => {
              const ts = s.tasks[t.id] ?? [];
              const d = ts.filter((x) => x.done).length;
              return (
                <li key={t.id} className="rounded-lg bg-slate-50 p-2">
                  <div className="font-semibold text-slate-600">{t.label}</div>
                  <div className="text-base font-extrabold text-slate-900">
                    {d}/{ts.length}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {(s.favMajors.length > 0 || s.favSchools.length > 0) && (
        <section className="grid gap-4 md:grid-cols-2">
          <div className="card">
            <div className="text-xs font-bold text-slate-500">관심 학과</div>
            <ul className="mt-2 space-y-1 text-sm">
              {s.favMajors.map((id) => MAJOR_MAP[id] && (
                <li key={id}>
                  <b>{MAJOR_MAP[id].name}</b> <span className="text-xs text-slate-500">핵심: {MAJOR_MAP[id].core.join(", ")}</span>
                </li>
              ))}
              {s.favMajors.length === 0 && <li className="text-slate-400">-</li>}
            </ul>
          </div>
          <div className="card">
            <div className="text-xs font-bold text-slate-500">관심 경남 고교</div>
            <ul className="mt-2 space-y-1 text-sm">
              {s.favSchools.map((id) => {
                const sc = GN_SCHOOLS.find((x) => x.id === id);
                return sc ? (
                  <li key={id}>
                    <b>{sc.name}</b> <span className="text-xs text-slate-500">{sc.region} · {KIND_INFO[sc.kind].name} · {sc.round}</span>
                  </li>
                ) : null;
              })}
              {s.favSchools.length === 0 && <li className="text-slate-400">-</li>}
            </ul>
          </div>
        </section>
      )}

      <CreditSummary s={s} />

      {s.books.length > 0 && (
        <section className="card">
          <div className="text-xs font-bold text-slate-500">진로 독서 ({s.books.length})</div>
          <ul className="mt-2 divide-y divide-slate-100 text-sm">
            {s.books.slice(0, 6).map((b) => (
              <li key={b.id} className="py-2">
                <b>{b.title}</b> <span className="text-xs text-slate-400">{b.author}</span>
                {b.thought && <div className="text-slate-600">💭 {b.thought}</div>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {s.logs.length > 0 && (
        <section className="card">
          <div className="text-xs font-bold text-slate-500">진로 활동 기록 ({s.logs.length})</div>
          <ul className="mt-2 divide-y divide-slate-100">
            {s.logs.slice(0, 6).map((l) => (
              <li key={l.id} className="py-2 text-sm">
                <div className="font-semibold">
                  {l.title} <span className="text-xs font-normal text-slate-400">{l.date} · {l.kind}</span>
                </div>
                {l.learned && <div className="text-slate-600">💡 {l.learned}</div>}
                {l.next && <div className="text-slate-500">→ {l.next}</div>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="card hidden print:block">
        <div className="text-xs font-bold text-slate-500">선생님·보호자 의견</div>
        <div className="mt-2 h-24 rounded-lg border border-dashed border-slate-300" />
      </section>
    </article>
  );
}

function Tools() {
  const { state, replace, reset } = useStore();
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const flash = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(""), 2500);
  };

  return (
    <div className="no-print mt-8 space-y-4">
      <div className="card">
        <h2 className="font-bold">리포트 활용하기</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="btn-primary" onClick={() => window.print()}>
            🖨️ 인쇄 / PDF 저장
          </button>
          <button
            className="btn-ghost"
            onClick={async () => {
              const url = `${location.origin}/report#d=${encodeShare(state)}`;
              try {
                await navigator.clipboard.writeText(url);
                flash("공유 링크를 복사했어요. 선생님이나 보호자에게 보내 보세요.");
              } catch {
                prompt("아래 링크를 복사하세요", url);
              }
            }}
          >
            🔗 공유 링크 복사
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">공유 링크에는 리포트 내용이 담겨 있어 서버 저장 없이 열람할 수 있어요. 받는 사람에게만 보내 주세요.</p>
        {msg && <p className="mt-2 text-sm font-semibold text-emerald-600">{msg}</p>}
      </div>

      <div className="card">
        <h2 className="font-bold">데이터 백업 · 다른 기기로 옮기기</h2>
        <p className="mt-1 text-xs text-slate-500">모든 기록은 이 브라우저에만 저장돼요. 기기를 바꾸거나 학교 PC를 쓸 때는 파일로 백업해 두세요.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            className="btn-ghost"
            onClick={() => {
              const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob);
              a.download = `myroad-backup-${new Date().toISOString().slice(0, 10)}.json`;
              a.click();
              URL.revokeObjectURL(a.href);
            }}
          >
            ⬇️ 백업 파일 저장
          </button>
          <button className="btn-ghost" onClick={() => fileRef.current?.click()}>
            ⬆️ 백업 불러오기
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              try {
                replace(JSON.parse(await f.text()));
                flash("백업을 불러왔어요.");
              } catch {
                flash("올바른 백업 파일이 아니에요.");
              }
              e.target.value = "";
            }}
          />
          <button className="btn-ghost text-rose-600" onClick={() => confirm("모든 기록을 지우고 처음부터 시작할까요? 되돌릴 수 없어요.") && reset()}>
            🗑️ 처음부터 다시
          </button>
        </div>
      </div>
      <Link href="/" className="inline-block text-sm font-semibold text-slate-500">
        ← 홈으로
      </Link>
    </div>
  );
}

function CreditSummary({ s }: { s: AppState }) {
  const count = Object.values(s.credits.plan).flat().length;
  if (!count) return null;
  const a = analyze(s.credits.plan, s.credits.track);
  return (
    <section className="card">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs font-bold text-slate-500">3개년 과목 설계 (192학점)</div>
        <div className="text-sm">
          총 <b>{a.total + 18}</b>/192학점{s.credits.track && ` · ${TRACKS[s.credits.track].name} 계열`}
          {a.trackFit && ` · 적합도 ${a.trackFit.pct}%`}
        </div>
      </div>
      <div className="mt-2 grid gap-2 sm:grid-cols-3">
        {SEMS.map((sem) => (
          <div key={sem} className="rounded-lg bg-slate-50 p-2 text-xs">
            <div className="font-bold text-slate-600">{SEM_LABEL[sem]} · {a.semTotals[sem]}학점</div>
            <div className="mt-0.5 text-slate-600">{s.credits.plan[sem].map((e) => parseEntry(e).name).join(", ") || "-"}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
