import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import type { NavItem } from "@/lib/journey";

export function PageHead({ step, title, desc }: { step?: number; title: string; desc?: string }) {
  return (
    <div className="mb-8">
      {step && <div className="eyebrow mb-2">Step {step} / 5</div>}
      <h1 className="h-page">{title}</h1>
      {desc && <p className="mt-3 max-w-2xl text-[0.98rem] leading-relaxed text-slate-600 sm:text-[1.05rem]">{desc}</p>}
    </div>
  );
}

export function NextStep({ href, label, hint }: { href: string; label: string; hint?: string }) {
  return (
    <div className="no-print mt-12 flex flex-col items-start justify-between gap-4 rounded-2xl border border-brand-100 bg-brand-50 p-5 sm:flex-row sm:items-center sm:p-6">
      <div>
        <div className="text-xs font-semibold text-brand-700">다음 단계</div>
        <div className="mt-0.5 font-semibold text-slate-900">{hint ?? label}</div>
      </div>
      <Link href={href} className="btn-primary rounded-full">
        {label} <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  );
}

export function Empty({ children, href, cta }: { children: React.ReactNode; href?: string; cta?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-8 text-center text-sm text-slate-500">
      <div>{children}</div>
      {href && (
        <Link href={href} className="btn-primary mt-4 rounded-full">
          {cta}
        </Link>
      )}
    </div>
  );
}

// 아이콘 + 제목 + 설명 + 화살표 형태의 목록 (허브 메뉴용)
export function HubList({ items }: { items: NavItem[] }) {
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
                <span className="block font-semibold text-slate-900">{i.label}</span>
                <span className="block truncate text-sm text-slate-500">{i.desc}</span>
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
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`진행 ${value}/${max}`}>
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
