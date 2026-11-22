"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";

export default function NotFound() {
  const t = useT();
  return (
    <div className="py-20 text-center">
      <div className="text-5xl">🧭</div>
      <h1 className="mt-3 text-xl font-bold">{t("길을 잃었어요")}</h1>
      <Link href="/" className="btn-primary mt-4">{t("홈으로")}</Link>
    </div>
  );
}
