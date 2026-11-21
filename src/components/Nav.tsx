"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { progress } from "@/lib/match";

export const STEPS = [
  { href: "/discover", key: "discover", n: 1, label: "나 알기", emoji: "🧭" },
  { href: "/jobs", key: "jobs", n: 2, label: "직업 찾기", emoji: "💡" },
  { href: "/path", key: "path", n: 3, label: "길 잇기", emoji: "🛤️" },
  { href: "/highschool", key: "highschool", n: 4, label: "고교 고르기", emoji: "🏫" },
  { href: "/plan", key: "plan", n: 5, label: "계획·기록", emoji: "✅" },
];

export function Nav() {
  const path = usePathname();
  const { state, ready } = useStore();
  const p = progress(state);
  const done = (k: string) => ready && p.steps.find((s) => s.key === k)?.done;

  return (
    <>
      <header className="no-print sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-extrabold text-slate-900">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">M</span>
            마이로드
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {STEPS.map((s) => {
              const on = path.startsWith(s.href);
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    on ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span
                    className={`grid h-5 w-5 place-items-center rounded-full text-[11px] ${
                      done(s.key) ? "bg-emerald-500 text-white" : on ? "bg-brand-600 text-white" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {done(s.key) ? "✓" : s.n}
                  </span>
                  {s.label}
                </Link>
              );
            })}
            <Link href="/report" className="btn-primary ml-2 py-2">
              내 리포트
            </Link>
          </nav>
          <Link href="/report" className="btn-primary py-1.5 text-xs sm:hidden">
            내 리포트
          </Link>
        </div>
      </header>
      <nav className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur sm:hidden">
        <div className="grid grid-cols-5 pb-[env(safe-area-inset-bottom)]">
          {STEPS.map((s) => {
            const on = path.startsWith(s.href);
            return (
              <Link key={s.href} href={s.href} className={`relative flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold ${on ? "text-brand-700" : "text-slate-500"}`}>
                <span className="text-lg leading-none">{s.emoji}</span>
                {s.label}
                {done(s.key) && <span className="absolute right-3 top-1.5 h-2 w-2 rounded-full bg-emerald-500" />}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
