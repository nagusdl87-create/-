"use client";

// 머리글의 ? 버튼 → 지금 보는 화면의 사용법을 옆 서랍으로 보여 준다(+ 의견 보내기). 버튼과 서랍은 이벤트로 연결한다.
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleHelp, MessageSquareText, X } from "lucide-react";
import { useEscape } from "./useEscape";
import { feedbackHref } from "@/lib/site";
import { pageHelpFor } from "@/data/pageHelp";
import { useT } from "@/lib/i18n";

export const HELP_EVENT = "myroad:help";
export const openPageHelp = () => window.dispatchEvent(new Event(HELP_EVENT));

export function HelpButton({ className = "" }: { className?: string }) {
  const t = useT();
  return (
    <button
      type="button"
      onClick={openPageHelp}
      aria-label={t("이 화면 사용법")}
      title={t("이 화면 사용법")}
      className={`grid h-10 w-10 place-items-center rounded-full text-slate-700 hover:bg-slate-100 ${className}`}
    >
      <CircleHelp className="h-5 w-5" aria-hidden />
    </button>
  );
}

export function PageHelp() {
  const t = useT();
  const path = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useEscape(close);
  useEffect(() => {
    const h = () => setOpen(true);
    window.addEventListener(HELP_EVENT, h);
    return () => window.removeEventListener(HELP_EVENT, h);
  }, []);
  useEffect(() => {
    setOpen(false);
  }, [path]);
  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);
  if (!open) return null;
  const h = pageHelpFor(path);
  return (
    <div className="no-print fixed inset-0 z-[55] bg-slate-900/30" onClick={close}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ph-title"
        onClick={(e) => e.stopPropagation()}
        className="absolute right-0 top-0 flex h-full w-[92%] max-w-sm flex-col overflow-y-auto bg-surface p-5 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-brand-700">{t("이 화면 사용법")}</div>
            <h2 id="ph-title" className="text-lg font-extrabold">{t(h.title)}</h2>
          </div>
          <button ref={closeRef} onClick={close} aria-label={t("닫기")} className="grid h-9 w-9 shrink-0 place-items-center rounded-full hover:bg-slate-100">
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <p className="mt-2 text-sm text-slate-700">{t(h.what)}</p>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700">
          {h.steps.map((s) => (
            <li key={s}>{t(s)}</li>
          ))}
        </ol>
        {h.tip && <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">{t(h.tip)}</p>}
        <div className="mt-4 flex flex-col gap-2">
          <Link href={`/help${h.more ? "#" + h.more : ""}`} onClick={close} className="btn-primary justify-center">
            {t("전체 이용 안내 보기")}
          </Link>
          <Link href="/help#words" onClick={close} className="btn-ghost justify-center">
            {t("어려운 말 풀이")}
          </Link>
          <a href={feedbackHref(path)} target="_blank" rel="noreferrer" className="btn-ghost justify-center">
            <MessageSquareText className="h-4 w-4" aria-hidden /> {t("어려웠던 점 알려 주기")}
          </a>
        </div>
        <p className="mt-2 text-[11px] text-slate-500">{t("의견에는 이름·학교·연락처를 쓰지 않아도 돼요.")}</p>
      </div>
    </div>
  );
}
