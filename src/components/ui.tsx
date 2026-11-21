import Link from "next/link";

export function PageHead({ step, title, desc }: { step?: number; title: string; desc?: string }) {
  return (
    <div className="mb-6">
      {step && <div className="mb-1 text-xs font-bold uppercase tracking-wider text-brand-600">STEP {step}</div>}
      <h1 className="h-page">{title}</h1>
      {desc && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">{desc}</p>}
    </div>
  );
}

export function NextStep({ href, label, hint }: { href: string; label: string; hint?: string }) {
  return (
    <div className="no-print mt-10 flex flex-col items-start justify-between gap-3 rounded-2xl bg-brand-900 p-5 text-white sm:flex-row sm:items-center">
      <div>
        <div className="text-xs font-semibold text-brand-200">다음 단계</div>
        <div className="font-bold">{hint ?? label}</div>
      </div>
      <Link href={href} className="btn bg-white text-brand-900 hover:bg-brand-50">
        {label} →
      </Link>
    </div>
  );
}

export function Empty({ children, href, cta }: { children: React.ReactNode; href?: string; cta?: string }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
      <div>{children}</div>
      {href && (
        <Link href={href} className="btn-primary mt-3">
          {cta}
        </Link>
      )}
    </div>
  );
}
