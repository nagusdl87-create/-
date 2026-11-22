"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { EXPLORE, TOOLS, type NavItem } from "@/lib/journey";
import { useT } from "@/lib/i18n";

export type Tone = "brand" | "amber" | "violet" | "sky" | "rose" | "coral" | "emerald" | "indigo";
// 페이지 제목 영역(당근처럼 담백하게): 배경 상자·그라데이션·물방울 장식 없이 작은 분류 + 큰 제목 + 설명
const TONES: Record<Tone, string> = {
  brand: "bg-brand-100 text-brand-800", amber: "bg-amber-100 text-amber-800", violet: "bg-violet-100 text-violet-800", sky: "bg-sky-100 text-sky-800",
  rose: "bg-rose-100 text-rose-800", coral: "bg-coral-100 text-coral-800", emerald: "bg-emerald-100 text-emerald-800", indigo: "bg-indigo-100 text-indigo-800",
};

export function PageHead({ step, title, desc, tone = "brand", eyebrow }: { step?: number; title: string; desc?: string; tone?: Tone; eyebrow?: string }) {
  const t = useT();
  return (
    <div className="mb-6 pt-1">
      {(step || eyebrow) && (
        <span className={`mb-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${TONES[tone]}`}>
          {step ? t("5단계 중 {n}단계", { n: step }) : t(eyebrow ?? "")}
        </span>
      )}
      <h1 className="h-page">{t(title)}</h1>
      {desc && <p className="mt-2 max-w-3xl text-[0.98rem] leading-relaxed text-slate-600">{t(desc)}</p>}
    </div>
  );
}

export function NextStep({ href, label, hint }: { href: string; label: string; hint?: string }) {
  const t = useT();
  return (
    <div className="no-print mt-12 flex flex-col items-start justify-between gap-4 rounded-2xl border border-brand-100 bg-brand-50 p-5 sm:flex-row sm:items-center sm:p-6">
      <div>
        <div className="text-xs font-semibold text-brand-700">{t("다음 단계")}</div>
        <div className="mt-0.5 font-semibold text-slate-900">{t(hint ?? label)}</div>
      </div>
      <Link href={href} className="btn-primary rounded-full">
        {t(label)} <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  );
}

export function Empty({ children, href, cta }: { children: React.ReactNode; href?: string; cta?: string }) {
  const t = useT();
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-8 text-center text-sm text-slate-500">
      <div>{typeof children === "string" ? t(children) : children}</div>
      {href && (
        <Link href={href} className="btn-primary mt-4 rounded-full">
          {cta && t(cta)}
        </Link>
      )}
    </div>
  );
}

// 아이콘 + 제목 + 설명 + 화살표 형태의 목록 (허브 메뉴용)
// 서버 페이지에서는 아이콘(함수)을 넘길 수 없으므로 group="explore" | "tools"로 고른다.
export function HubList({ items: given, group }: { items?: NavItem[]; group?: "explore" | "tools" }) {
  const t = useT();
  const items = given ?? (group === "tools" ? TOOLS : EXPLORE);
  return (
    <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
      {items.map((i) => {
        const Icon = i.icon;
        return (
          <li key={i.href}>
            <Link href={i.href} className="group flex items-center gap-4 px-4 py-3.5 transition hover:bg-slate-50 sm:px-5">
              <span className="icon-box">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-slate-900">{t(i.label)}</span>
                <span className="block truncate text-sm text-slate-500">{t(i.desc)}</span>
              </span>
              <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-600" aria-hidden />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function ProgressRing({ value, max, size = 96 }: { value: number; max: number; size?: number }) {
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  const pct = max ? value / max : 0;
  const t = useT();
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={t("진행 {v}/{m}", { v: value, m: max })}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth="8" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#127a67"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${c * pct} ${c}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dasharray .5s" }}
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fontSize={size * 0.24} fontWeight="700" fill="#0f172a">
        {value}/{max}
      </text>
    </svg>
  );
}
