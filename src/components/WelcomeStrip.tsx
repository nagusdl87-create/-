"use client";

// 첫 방문 안내 띠: 닫으면(또는 안내를 열면) 이 기기에서는 다시 뜨지 않는다.
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenCheck, X } from "lucide-react";
import { useT } from "@/lib/i18n";

const KEY = "myroad:welcome";

export function WelcomeStrip() {
  const t = useT();
  const path = usePathname() || "/";
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      setShow(localStorage.getItem(KEY) !== "1");
    } catch {
      setShow(false);
    }
  }, []);
  const hide = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* 저장하지 못해도 이번 방문에는 닫힘 */
    }
    setShow(false);
  };
  if (!show || path.startsWith("/help") || path.startsWith("/teacher") || path.startsWith("/privacy")) return null;
  return (
    <div className="no-print border-b border-brand-200 bg-brand-50" role="region" aria-label={t("처음 방문 안내")}>
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2 text-sm">
        <BookOpenCheck className="h-5 w-5 shrink-0 text-brand-700" aria-hidden />
        <p className="min-w-0 flex-1 text-brand-900">
          <b>{t("처음이세요?")}</b> {t("쉬운 말로 순서대로 알려 주는 3분 이용 안내가 있어요.")}
        </p>
        <Link href="/help" onClick={hide} className="btn-primary shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-xs">
          {t("안내 보기")}
        </Link>
        <button onClick={hide} aria-label={t("안내 닫기")} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-brand-800 hover:bg-brand-100">
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
