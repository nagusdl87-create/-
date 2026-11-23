"use client";

// 예전 주소(/jobs/cn/번호)로 들어오면 새 주소로 넘긴다(정적 사이트라 화면에서 이동)
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/lib/i18n";

export function MovedTo({ href, name }: { href: string; name: string }) {
  const router = useRouter();
  const t = useT();
  useEffect(() => { router.replace(href); }, [router, href]);
  return (
    <p className="py-10 text-center text-sm text-slate-500">
      {t("주소가 바뀌었어요.")} <Link href={href} className="font-semibold text-brand-700 underline" data-keep-ko>{name}</Link>
    </p>
  );
}
