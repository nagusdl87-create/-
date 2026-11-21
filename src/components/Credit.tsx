// 제작자·저작권 표기 (내용은 src/data/author.json 에서 수정)
import author from "@/data/author.json";

export const AUTHOR = author as { name: string; org: string; role: string; year: number; email: string };

export function CreditLine({ className = "" }: { className?: string }) {
  return (
    <p className={className}>
      제작: {AUTHOR.org} {AUTHOR.role} <b className="font-semibold text-slate-700">{AUTHOR.name}</b>
      {AUTHOR.email && (
        <>
          {" · "}
          <a href={`mailto:${AUTHOR.email}`} className="hover:text-brand-700 hover:underline">
            {AUTHOR.email}
          </a>
        </>
      )}
      {" "}· © {AUTHOR.year} {AUTHOR.name}. All rights reserved.
    </p>
  );
}

export function CreditCard() {
  return (
    <section className="flex flex-col items-start justify-between gap-2 rounded-2xl border border-slate-200/80 bg-white px-5 py-4 sm:flex-row sm:items-center">
      <div className="text-sm text-slate-600">
        <span className="text-xs font-semibold text-brand-700">만든 사람</span>
        <div className="mt-0.5">
          {AUTHOR.org} {AUTHOR.role} <b className="text-slate-900">{AUTHOR.name}</b>
        </div>
        {AUTHOR.email && (
          <a href={`mailto:${AUTHOR.email}`} className="text-xs text-brand-700 hover:underline">
            {AUTHOR.email}
          </a>
        )}
      </div>
      <div className="text-xs text-slate-500">
        © {AUTHOR.year} {AUTHOR.name}. All rights reserved. 이 플랫폼의 기획·구성·콘텐츠에 대한 저작권은 제작자에게 있어요.
      </div>
    </section>
  );
}
