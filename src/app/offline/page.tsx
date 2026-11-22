import type { Metadata } from "next";
import Link from "next/link";
import { WifiOff } from "lucide-react";

export const metadata: Metadata = { title: "인터넷 연결 없음", robots: { index: false } };

export default function OfflinePage() {
  return (
    <div className="mx-auto max-w-lg py-10 text-center">
      <span className="icon-box mx-auto h-14 w-14"><WifiOff className="h-7 w-7" aria-hidden /></span>
      <h1 className="mt-4 text-2xl font-bold">인터넷에 연결되어 있지 않아요</h1>
      <p className="mt-2 text-slate-600">이 페이지는 아직 이 기기에 저장되지 않았어요. 전에 한 번 열어 본 페이지는 인터넷 없이도 열 수 있고, 내 기록은 그대로 남아 있어요.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link href="/" className="btn-primary">홈으로</Link>
        <Link href="/report" className="btn-ghost">내 리포트</Link>
      </div>
    </div>
  );
}
