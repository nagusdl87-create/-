"use client";

import { useLang, useT } from "@/lib/i18n";
// 마이로드 로고: 갈림길(진로)을 단순한 선으로 표현
export function Logo({ compact = false }: { compact?: boolean }) {
  const t = useT();
  // 영어 이름이 길어 좁은 휴대폰(400px 미만)에서는 지역 표시를 숨긴다
  const narrowHide = useLang().lang === "en" ? " max-[399px]:hidden" : "";
  return (
    <span className="flex items-center gap-2">
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden>
        <rect width="32" height="32" rx="9" fill="#127a67" />
        <path d="M9 24c0-6 3.5-8 7-8s7-2 7-8" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="23" cy="8" r="2.6" fill="#ffbe55" />
        <circle cx="9" cy="24" r="2.2" fill="#fff" />
      </svg>
      {!compact && (
        <span className="text-[1.05rem] font-bold tracking-tight text-slate-900">
          {t("마이로드")}<span className={`ml-1.5 rounded-md bg-brand-50 px-1.5 py-0.5 text-[0.7rem] font-semibold text-brand-700 align-middle${narrowHide}`}>{t("경남")}</span>
        </span>
      )}
    </span>
  );
}
