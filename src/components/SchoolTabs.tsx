import Link from "next/link";

/** 학교 찾기: 고등학교 / 중학교 전환 */
export function SchoolTabs({ active }: { active: "hs" | "ms" }) {
  const t = (on: boolean) => `flex-1 rounded-lg py-2 text-center text-sm font-semibold ${on ? "bg-surface text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`;
  return (
    <nav aria-label="학교 종류" className="mb-5 grid grid-cols-2 gap-1 rounded-xl bg-slate-200/60 p-1 sm:max-w-sm">
      <Link href="/schools" className={t(active === "hs")} aria-current={active === "hs" ? "page" : undefined}>고등학교 찾기</Link>
      <Link href="/middle" className={t(active === "ms")} aria-current={active === "ms" ? "page" : undefined}>중학교 정보</Link>
    </nav>
  );
}
