// 제작자·저작권 표기 (내용은 src/data/author.json 에서 수정)
import author from "@/data/author.json";

export const AUTHOR = author as { name: string; org: string; role: string; year: number; email: string };

export function CreditLine({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 tracking-[0.02em] ${className}`}>
      <span>
        제작 <b className="ml-1 text-[0.9rem] font-semibold tracking-[0.04em] text-slate-800">
          {AUTHOR.org} {AUTHOR.role} {AUTHOR.name}
        </b>
      </span>
      {AUTHOR.email && (
        <span>
          이용 문의{" "}
          <a href={`mailto:${AUTHOR.email}`} className="ml-1 font-medium text-brand-700 hover:underline">
            {AUTHOR.email}
          </a>
        </span>
      )}
      <span>
        © {AUTHOR.year} {AUTHOR.name}. All rights reserved.
      </span>
    </div>
  );
}

export function CreditCard() {
  return (
    <section className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white px-5 py-5 sm:flex-row sm:items-center sm:px-6">
      <div className="tracking-[0.02em]">
        <span className="text-xs font-semibold text-brand-700">만든 사람</span>
        <div className="mt-1 text-lg font-bold tracking-[0.05em] text-slate-900">
          {AUTHOR.org} {AUTHOR.role} {AUTHOR.name}
        </div>
        {AUTHOR.email && (
          <div className="mt-1 text-sm text-slate-600">
            이용 문의{" "}
            <a href={`mailto:${AUTHOR.email}`} className="ml-1 font-medium text-brand-700 hover:underline">
              {AUTHOR.email}
            </a>
          </div>
        )}
      </div>
      <div className="max-w-md text-xs leading-relaxed tracking-[0.01em] text-slate-500">
        © {AUTHOR.year} {AUTHOR.name}. All rights reserved.
        <br />이 플랫폼의 기획·구성·콘텐츠에 대한 저작권은 제작자에게 있어요.
      </div>
    </section>
  );
}
