"use client";

import { useState } from "react";
import { Phone, Printer } from "lucide-react";
import { useStore } from "@/lib/store";
import { LESSONS } from "@/data/transition";
import { PageHead } from "@/components/ui";
import { useEnData, useT } from "@/lib/i18n";

// "English (한국어)"의 괄호 속 한국어는 검사에서 제외(data-keep-ko)
function keepKo(s: string): React.ReactNode {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] !== "(") continue;
    let d = 0, j = i;
    for (; j < s.length; j++) { if (s[j] === "(") d++; else if (s[j] === ")" && --d === 0) break; }
    if (!/[가-힣]/.test(s.slice(i, j + 1))) { i = j; continue; }
    out.push(s.slice(last, i), <span key={i} data-keep-ko>{s.slice(i, j + 1)}</span>);
    last = j + 1;
    i = j;
  }
  return last ? [...out, s.slice(last)] : s;
}

export default function TransitionPage() {
  const { state, update, ready } = useStore();
  const t = useT();
  const en = useEnData(() => import("@/i18n/data/transition.en"), "transition");
  const [i, setI] = useState(0);
  const [all, setAll] = useState(false);
  const checks = (() => {
    try {
      return JSON.parse(state.portfolio["transition.checks"] ?? "{}") as Record<string, boolean>;
    } catch {
      return {};
    }
  })();
  const toggle = (k: string) => update((s) => ({ ...s, portfolio: { ...s.portfolio, "transition.checks": JSON.stringify({ ...checks, [k]: !checks[k] }) } }));
  if (!ready) return <div className="h-96" />;
  const list = all ? LESSONS : [LESSONS[i]];
  const done = LESSONS.filter((l) => l.check.every((c) => checks[`${l.n}:${c}`])).length;

  return (
    <div>
      <PageHead tone="rose" eyebrow={t("진로 자료실")} title={t("고3 진로 전환기 10차시")} desc={t("수능 이후 졸업까지, 대학 생활·사회 진출을 준비하는 10차시 수업 자료예요. 학생은 혼자 읽고 체크리스트를 채우고, 선생님은 그대로 수업 자료로 인쇄해 쓸 수 있어요.")} />
      <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm text-slate-500">
          {t("완료")} <b className="text-slate-800">{done}</b> {t("/ 10 차시")}
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost py-2" onClick={() => setAll(!all)}>{all ? t("한 차시씩 보기") : t("전체 펼치기")}</button>
          <button className="btn-ghost py-2" onClick={() => { setAll(true); setTimeout(() => window.print(), 200); }}>
            <Printer className="h-4 w-4" /> {t("전체 인쇄")}
          </button>
        </div>
      </div>
      {!all && (
        <div className="no-print mb-4 grid grid-cols-5 gap-1 sm:grid-cols-10">
          {LESSONS.map((l, k) => {
            const ok = l.check.every((c) => checks[`${l.n}:${c}`]);
            return (
              <button key={l.n} aria-pressed={i === k} onClick={() => setI(k)} className={`rounded-lg py-2 text-sm font-semibold ${i === k ? "bg-brand-600 text-white" : ok ? "bg-brand-50 text-brand-700" : "bg-slate-100 text-slate-600"}`}>
                {t("{n}차시", { n: l.n })}
              </button>
            );
          })}
        </div>
      )}
      <div className="space-y-4">
        {list.map((l) => {
          const e = en?.LESSONS_EN[LESSONS.indexOf(l)];
          return (
          <article key={l.n} className="card break-inside-avoid">
            <div className="eyebrow">{t("{n}차시", { n: l.n })}</div>
            <h2 className="mt-1 text-xl font-bold">{e?.t ?? l.t}</h2>
            <p className="mt-2 rounded-xl bg-brand-50 px-3 py-2 text-sm text-brand-900">
              <b>{t("학습 목표")}</b> {e?.goal ?? l.goal}
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-sm font-semibold">{t("핵심 내용")}</div>
                <ul className="mt-1 space-y-1 text-sm text-slate-700">
                  {l.points.map((p, pi) => (
                    <li key={p}>• {e?.points[pi] ?? p}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-sm font-semibold">{t("활동")}</div>
                <p className="mt-1 text-sm text-slate-700">{e?.activity ?? l.activity}</p>
                <div className="mt-3 text-sm font-semibold">{t("체크리스트")}</div>
                <ul className="mt-1 space-y-1">
                  {l.check.map((c, ci) => (
                    <li key={c}>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="h-4 w-4 accent-brand-600" checked={!!checks[`${l.n}:${c}`]} onChange={() => toggle(`${l.n}:${c}`)} />
                        {e?.check[ci] ?? c}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {l.help && (
              <div className="mt-4 flex flex-wrap gap-2">
                {l.help.map((h, hi) => (
                  <a key={h.name} href={`tel:${h.contact}`} className="chip bg-sun-100 px-3 py-1.5 text-amber-900">
                    <Phone className="h-3.5 w-3.5" /> {keepKo(e?.help?.[hi] ?? h.name)} {h.contact}
                  </a>
                ))}
              </div>
            )}
          </article>
          );
        })}
      </div>
      <p className="mt-6 text-xs text-slate-500">{t("법·제도와 금액(최저임금 등)은 해마다 바뀔 수 있어요. 수업 전 고용노동부, 금융감독원 등 공식 누리집에서 최신 내용을 확인하세요.")}</p>
    </div>
  );
}
