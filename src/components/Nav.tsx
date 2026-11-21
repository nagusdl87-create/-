"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useEscape } from "./useEscape";
import { useStore } from "@/lib/store";
import { progress } from "@/lib/match";
import { EXPLORE, JOURNEY, TOOLS } from "@/lib/journey";

function Dropdown({ label, items, active }: { label: string; items: { href: string; label: string; emoji: string; desc: string }[]; active: boolean }) {
  return (
    <div className="group relative">
      <button className={`rounded-lg px-3 py-2 text-sm font-semibold ${active ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100"}`}>
        {label} ▾
      </button>
      <div className="invisible absolute left-0 top-full z-40 w-72 pt-1 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
          {items.map((i) => (
            <Link key={i.href} href={i.href} className="flex gap-3 rounded-xl px-3 py-2 hover:bg-slate-50">
              <span className="text-xl">{i.emoji}</span>
              <span>
                <span className="block text-sm font-bold text-slate-800">{i.label}</span>
                <span className="block text-xs text-slate-500">{i.desc}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Nav() {
  const path = usePathname();
  const router = useRouter();
  const { state, ready } = useStore();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  useEscape(useCallback(() => setOpen(false), []));
  const stage = state.profile.stage || "ms";
  const steps = JOURNEY[stage];
  const p = progress(state);
  const isIn = (items: { href: string }[]) => items.some((i) => path.startsWith(i.href.split("#")[0]) && i.href !== "/");
  const search = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      router.push(`/search?q=${encodeURIComponent(q.trim())}`);
      setOpen(false);
    }
  };

  return (
    <>
      <header className="no-print sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4">
          <Link href="/" className="flex shrink-0 items-center gap-2 font-extrabold text-slate-900">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">M</span>
            <span>
              마이로드 <span className="text-brand-600">경남</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="주 메뉴">
            <Dropdown
              label={ready && state.profile.stage === "hs" ? "나의 설계(고)" : ready && state.profile.stage === "ms" ? "나의 설계(중)" : "나의 설계"}
              active={isIn(steps)}
              items={steps.map((s) => ({ ...s, label: `${s.n}. ${s.label}${ready && p.steps.find((x) => x.key === s.key)?.done ? " ✓" : ""}` }))}
            />
            <Dropdown label="탐색" items={EXPLORE} active={isIn(EXPLORE)} />
            <Dropdown label="도구" items={TOOLS} active={isIn(TOOLS)} />
          </nav>
          <div className="flex items-center gap-2">
            <form onSubmit={search} className="hidden md:block" role="search">
              <input className="input w-56 py-1.5" placeholder="직업·학과·과목·학교 검색" value={q} onChange={(e) => setQ(e.target.value)} aria-label="통합 검색" />
            </form>
            <Link href="/report" className="btn-primary hidden py-2 sm:inline-flex">
              내 리포트
            </Link>
            <button className="btn-ghost px-3 py-2 lg:hidden" onClick={() => setOpen(true)} aria-label="전체 메뉴 열기">
              ☰
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="no-print fixed inset-0 z-50 bg-slate-900/40 lg:hidden" onClick={() => setOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-[86%] max-w-sm overflow-y-auto bg-white p-4 shadow-2xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="전체 메뉴">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-extrabold">전체 메뉴</span>
              <button className="btn-ghost px-3 py-1.5" onClick={() => setOpen(false)} aria-label="닫기">✕</button>
            </div>
            <form onSubmit={search} role="search" className="mb-4">
              <input className="input" placeholder="직업·학과·과목·학교 검색" value={q} onChange={(e) => setQ(e.target.value)} aria-label="통합 검색" />
            </form>
            {[
              { t: "나의 설계", items: steps },
              { t: "탐색", items: EXPLORE },
              { t: "도구", items: [...TOOLS, { href: "/report", label: "내 리포트", emoji: "📄", desc: "" }] },
            ].map((g) => (
              <div key={g.t} className="mb-4">
                <div className="mb-1 text-xs font-bold text-slate-400">{g.t}</div>
                {g.items.map((i) => (
                  <Link key={i.href} href={i.href} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm font-semibold hover:bg-slate-50">
                    <span className="text-lg">{i.emoji}</span>
                    {i.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <nav className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur sm:hidden" aria-label="빠른 메뉴">
        <div className="grid grid-cols-5 pb-[env(safe-area-inset-bottom)]">
          {[
            { href: "/", label: "홈", emoji: "🏠" },
            { href: steps.find((s) => !p.steps.find((x) => x.key === s.key)?.done)?.href ?? "/plan", label: "이어하기", emoji: "🧭" },
            { href: "/explore", label: "탐색", emoji: "🔎" },
            { href: "/tools", label: "도구", emoji: "🧰" },
            { href: "/report", label: "리포트", emoji: "📄" },
          ].map((s) => {
            const on = s.href === "/" ? path === "/" : path.startsWith(s.href);
            return (
              <Link key={s.label} href={s.href} className={`flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold ${on ? "text-brand-700" : "text-slate-500"}`}>
                <span className="text-lg leading-none">{s.emoji}</span>
                {s.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
