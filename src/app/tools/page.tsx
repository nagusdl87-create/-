import Link from "next/link";
import { TOOLS } from "@/lib/journey";
import { PageHead } from "@/components/ui";

export const metadata = { title: "도구 — 마이로드 경남" };

export default function Tools() {
  return (
    <div>
      <PageHead title="도구" desc="과목 설계, 성적 계산, 포트폴리오 작성처럼 직접 써 보는 도구 모음이에요." />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((i) => (
          <Link key={i.href} href={i.href} className="card transition hover:border-brand-200 hover:shadow-md">
            <div className="text-3xl">{i.emoji}</div>
            <div className="mt-2 text-lg font-bold">{i.label}</div>
            <div className="text-sm text-slate-500">{i.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
