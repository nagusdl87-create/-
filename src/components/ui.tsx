"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { EXPLORE, TOOLS, type NavItem } from "@/lib/journey";
import { useT } from "@/lib/i18n";

export type Tone = "brand" | "amber" | "violet" | "sky" | "rose" | "coral" | "emerald" | "indigo";
const TONES: Record<Tone, { bg: string; blob1: string; blob2: string; eyebrow: string }> = {
  brand: { bg: "from-brand-50 via-white to-sun-100/60", blob1: "#79cdb9", blob2: "#ffbe55", eyebrow: "text-brand-700" },
  amber: { bg: "from-amber-50 via-white to-coral-50", blob1: "#fcd34d", blob2: "#ff8a65", eyebrow: "text-amber-700" },
  violet: { bg: "from-violet-50 via-white to-sky-50", blob1: "#c4b5fd", blob2: "#7dd3fc", eyebrow: "text-violet-700" },
  sky: { bg: "from-sky-50 via-white to-brand-50", blob1: "#7dd3fc", blob2: "#79cdb9", eyebrow: "text-sky-700" },
  rose: { bg: "from-rose-50 via-white to-amber-50", blob1: "#fda4af", blob2: "#fcd34d", eyebrow: "text-rose-700" },
  coral: { bg: "from-coral-50 via-white to-sun-100/60", blob1: "#ff8a65", blob2: "#ffbe55", eyebrow: "text-coral-700" },
  emerald: { bg: "from-emerald-50 via-white to-sky-50", blob1: "#6ee7b7", blob2: "#7dd3fc", eyebrow: "text-emerald-700" },
  indigo: { bg: "from-indigo-50 via-white to-violet-50", blob1: "#a5b4fc", blob2: "#f0abfc", eyebrow: "text-indigo-700" },
};

export function PageHead({ step, title, desc, tone = "brand", eyebrow }: { step?: number; title: string; desc?: string; tone?: Tone; eyebrow?: string }) {
  const c = TONES[tone];
  const t = useT();
  return (
    <div className={`relative mb-8 overflow-hidden rounded-3xl border border-white bg-gradient-to-br ${c.bg} px-6 py-8 shadow-[0_1px_0_rgba(15,23,42,0.04)] sm:px-10 sm:py-10`}>
      <svg className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 opacity-50 sm:right-6" viewBox="0 0 200 200" aria-hidden>
        <path fill={c.blob1} d="M47.5,-58.6C60.7,-47.1,69.6,-30.9,72.3,-13.8C75,3.3,71.4,21.2,61.9,35.3C52.4,49.4,37,59.6,20.1,65.4C3.2,71.2,-15.2,72.6,-31.6,66.3C-48,60,-62.3,46,-69.7,29.1C-77.1,12.2,-77.6,-7.6,-70.5,-23.9C-63.4,-40.2,-48.7,-53.1,-33.1,-63.9C-17.5,-74.7,-1,-83.4,14.5,-81.1C30,-78.8,34.3,-70.1,47.5,-58.6Z" transform="translate(100 100)" />
      </svg>
      <svg className="pointer-events-none absolute -bottom-20 right-24 h-48 w-48 opacity-40" viewBox="0 0 200 200" aria-hidden>
        <path fill={c.blob2} d="M39.9,-51.6C52.4,-43.8,63.5,-32.4,68.3,-18.4C73.1,-4.4,71.6,12.2,64.6,25.6C57.6,39,45.1,49.2,31.1,56.4C17.1,63.6,1.6,67.8,-14.5,66.4C-30.6,65,-47.3,58,-57.6,45.5C-67.9,33,-71.8,15,-70.2,-2.2C-68.6,-19.4,-61.5,-35.8,-49.6,-43.9C-37.7,-52,-21,-51.8,-5.8,-44.9C9.4,-38,27.4,-59.4,39.9,-51.6Z" transform="translate(100 100)" />
      </svg>
      <div className="relative">
        {(step || eyebrow) && <div className={`mb-2 text-xs font-bold uppercase tracking-[0.12em] ${c.eyebrow}`}>{step ? `Step ${step} / 5` : t(eyebrow ?? "")}</div>}
        <h1 className="h-page">{t(title)}</h1>
        {desc && <p className="mt-3 max-w-2xl text-[0.98rem] leading-relaxed text-slate-600 sm:text-[1.05rem]">{t(desc)}</p>}
      </div>
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
