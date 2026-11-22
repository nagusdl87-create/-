"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { ChevronDown, Compass, FileText, Home, Menu, Search, Wrench, X, Check } from "lucide-react";
import { useEscape } from "./useEscape";
import { useStore } from "@/lib/store";
import { progress } from "@/lib/match";
import { EXPLORE, JOURNEY, TOOLS, type NavItem } from "@/lib/journey";
import { Logo } from "./Logo";
import { AccountButton } from "./Account";
import { ThemeToggle } from "./ThemeToggle";
import { EnglishGuideButton } from "./EnglishGuide";
import { LangToggle } from "@/lib/i18n";

function Dropdown({ label, items, active, done }: { label: string; items: NavItem[]; active: boolean; done?: (href: string) => boolean }) {
  return (
    <div className="group relative">
      <button
        className={`relative flex h-16 items-center gap-1 px-3 text-[0.95rem] font-semibold transition ${active ? "text-brand-700" : "text-slate-600 hover:text-slate-900"}`}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown className="h-4 w-4 opacity-60" aria-hidden />
        <span className={`absolute inset-x-3 bottom-0 h-0.5 rounded-full ${active ? "bg-brand-600" : "bg-transparent"}`} />
      </button>
      <div className="invisible absolute left-0 top-full z-40 w-80 pt-1 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-900/5">
          {items.map((i) => {
            const Icon = i.icon;
            const d = done?.(i.href);
            return (
              <Link key={i.href} href={i.href} className="flex items-start gap-3 rounded-xl px-3 py-2.5 hover:bg-slate-50">
                <span className={`icon-box h-9 w-9 ${d ? "bg-brand-600 text-white" : ""}`}>{d ? <Check className="h-4 w-4" /> : <Icon className="h-[18px] w-[18px]" />}</span>
                <span>
                  <span className="block text-sm font-semibold text-slate-800">{i.label}</span>
                  <span className="block text-xs text-slate-500">{i.desc}</span>
                </span>
              </Link>
            );
          })}
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
  const isIn = (items: { href: string }[]) => items.some((i) => path.startsWith(i.href.split("#")[0]));
  // 여러 메뉴에 속한 페이지는 한 곳만 표시 (나의 설계 > 탐색 > 도구 순)
  const activeGroup = isIn(steps) ? "journey" : isIn(EXPLORE) ? "explore" : isIn(TOOLS) ? "tools" : "";
  const stepDone = (href: string) => !!(ready && p.steps.find((x) => x.key === steps.find((s) => s.href === href)?.key)?.done);
  const search = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      router.push(`/search?q=${encodeURIComponent(q.trim())}`);
      setOpen(false);
    }
  };
  const nextHref = steps.find((s) => !p.steps.find((x) => x.key === s.key)?.done)?.href ?? "/plan";

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:shadow">
        본문 바로가기
      </a>
      <header className="no-print sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Link href="/" title="마이로드 경남 홈">
            <Logo />
          </Link>
          <nav className="hidden items-center lg:flex" aria-label="주 메뉴">
            <Dropdown label={ready && state.profile.stage === "hs" ? "나의 설계 · 고등" : ready && state.profile.stage === "ms" ? "나의 설계 · 중등" : "나의 설계"} items={steps} active={activeGroup === "journey"} done={stepDone} />
            <Dropdown label="탐색" items={EXPLORE} active={activeGroup === "explore"} />
            <Dropdown label="도구" items={TOOLS} active={activeGroup === "tools"} />
          </nav>
          <div className="flex items-center gap-1 sm:gap-2">
            <form onSubmit={search} className="relative hidden md:block" role="search">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
              <input className="input w-56 rounded-full bg-slate-50 py-2 pl-9 lg:w-48 xl:w-56" placeholder="직업·학과·과목·학교 검색" value={q} onChange={(e) => setQ(e.target.value)} aria-label="통합 검색" />
            </form>
            <LangToggle />
            <EnglishGuideButton />
            <ThemeToggle />
            <AccountButton />
            <Link href="/report" className="btn-primary hidden rounded-full py-2 sm:inline-flex">
              <FileText className="h-4 w-4" aria-hidden /> 내 리포트
            </Link>
            <button className="grid h-10 w-10 place-items-center rounded-full text-slate-700 hover:bg-slate-100 lg:hidden" onClick={() => setOpen(true)} aria-label="전체 메뉴 열기">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="no-print fixed inset-0 z-50 bg-slate-900/30 lg:hidden" onClick={() => setOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-[86%] max-w-sm overflow-y-auto bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="전체 메뉴">
            <div className="mb-4 flex items-center justify-between">
              <Logo />
              <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-slate-100" onClick={() => setOpen(false)} aria-label="닫기">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={search} role="search" className="relative mb-5">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
              <input className="input rounded-full pl-9" placeholder="직업·학과·과목·학교 검색" value={q} onChange={(e) => setQ(e.target.value)} aria-label="통합 검색" />
            </form>
            {[
              { t: "나의 설계", items: steps as NavItem[] },
              { t: "탐색", items: EXPLORE },
              { t: "도구", items: [...TOOLS, { href: "/report", label: "내 리포트", icon: FileText, desc: "" }] },
            ].map((g) => (
              <div key={g.t} className="mb-5">
                <div className="mb-1 px-2 text-xs font-semibold text-slate-400">{g.t}</div>
                {g.items.map((i) => {
                  const Icon = i.icon;
                  return (
                    <Link key={i.href} href={i.href} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-2 py-2 text-[0.95rem] font-medium text-slate-700 hover:bg-slate-50">
                      <Icon className="h-[18px] w-[18px] text-brand-600" aria-hidden />
                      {i.label}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      <nav className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur sm:hidden" aria-label="빠른 메뉴">
        <div className="grid grid-cols-5 pb-[env(safe-area-inset-bottom)]">
          {[
            { href: "/", label: "홈", icon: Home },
            { href: nextHref, label: "이어하기", icon: Compass },
            { href: "/explore", label: "탐색", icon: Search },
            { href: "/tools", label: "도구", icon: Wrench },
            { href: "/report", label: "리포트", icon: FileText },
          ].map((s) => {
            const on = s.href === "/" ? path === "/" : path.startsWith(s.href);
            const Icon = s.icon;
            return (
              <Link key={s.label} href={s.href} className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold ${on ? "text-brand-700" : "text-slate-500"}`}>
                <Icon className="h-5 w-5" strokeWidth={on ? 2.4 : 2} aria-hidden />
                {s.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
