"use client";

// 서비스 워커 등록 + 오프라인일 때 알림 띠
import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

export function OfflineSupport() {
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
      <WifiOff className="h-4 w-4" aria-hidden /> 인터넷 연결이 끊겼어요. 전에 열어 본 페이지와 내 기록은 그대로 쓸 수 있어요.
    </div>
  );
}
