import type { Metadata } from "next";
import { OfflinePageBody } from "@/components/Offline";

export const metadata: Metadata = { title: "인터넷 연결 없음", robots: { index: false } };

export default function OfflinePage() {
  return <OfflinePageBody />;
}
