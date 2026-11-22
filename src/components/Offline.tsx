"use client";

// 서비스 워커 등록 + 오프라인일 때 알림 띠
import { useEffect, useState } from "react";
import Link from "next/link";
import { WifiOff } from "lucide-react";
import { useT } from "@/lib/i18n";

export function OfflineSupport() {
  const t = useT();
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
      navigator.serviceWorker?.register("/sw.js").catch(() => {});
    }
    const on = () => setOffline(!navigator.onLine);
    on();
    window.addEventListener("online", on);
    window.addEventListener("offline", on);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", on); };
  }, []);
  if (!offline) return null;
  return (
    <div className="no-print fixed inset-x-0 top-0 z-[55] flex items-center justify-center gap-2 bg-ink-900 px-4 py-2 text-sm text-white" role="status">
      <WifiOff className="h-4 w-4" aria-hidden /> {t("인터넷 연결이 끊겼어요. 전에 열어 본 페이지와 내 기록은 그대로 쓸 수 있어요.")}
    </div>
  );
}

/** /offline 페이지 본문 */
export function OfflinePageBody() {
  const t = useT();
  return (
    <div className="mx-auto max-w-lg py-10 text-center">
      <span className="icon-box mx-auto h-14 w-14"><WifiOff className="h-7 w-7" aria-hidden /></span>
      <h1 className="mt-4 text-2xl font-bold">{t("인터넷에 연결되어 있지 않아요")}</h1>
      <p className="mt-2 text-slate-600">{t("이 페이지는 아직 이 기기에 저장되지 않았어요. 전에 한 번 열어 본 페이지는 인터넷 없이도 열 수 있고, 내 기록은 그대로 남아 있어요.")}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link href="/" className="btn-primary">{t("홈으로")}</Link>
        <Link href="/report" className="btn-ghost">{t("내 리포트")}</Link>
      </div>
    </div>
  );
}
