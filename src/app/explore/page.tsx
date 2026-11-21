import Link from "next/link";
import { EXPLORE } from "@/lib/journey";
import { PageHead } from "@/components/ui";

export const metadata = { title: "탐색 백과 — 마이로드 경남" };

export default function Explore() {
  return (
    <div>
      <PageHead title="탐색 백과" desc="직업, 학과, 과목, 경남 고교, 대입 정보를 서로 연결해서 찾아볼 수 있어요." />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {EXPLORE.map((i) => (
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
