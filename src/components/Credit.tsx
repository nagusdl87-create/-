"use client";

// 제작자·저작권 표기 (내용은 src/data/author.json 에서 수정)
// 영어 모드에서도 제작자 이름·학교는 한국어 그대로(data-keep-ko) 두고 영어 설명을 붙인다.
import author from "@/data/author.json";
import { useLang, useT } from "@/lib/i18n";

export const AUTHOR = author as { name: string; org: string; role: string; year: number; email: string };

export function CreditLine({ className = "" }: { className?: string }) {
  const t = useT();
  const en = useLang().lang === "en";
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 tracking-[0.02em] ${className}`}>
      <span>
        {t("제작")} <b className="ml-1 text-[0.9rem] font-semibold tracking-[0.04em] text-slate-800" data-keep-ko={en ? "" : undefined}>
          {AUTHOR.org} {AUTHOR.role} {AUTHOR.name}
        </b>
        {en && <span className="ml-1">(teacher, Samcheonpo Girls&apos; Middle School)</span>}
      </span>
      {AUTHOR.email && (
        <span>
          {t("이용 문의")}{" "}
          <a href={`mailto:${AUTHOR.email}`} className="ml-1 font-medium text-brand-700 hover:underline">
            {AUTHOR.email}
          </a>
        </span>
      )}
      <span>
        © {AUTHOR.year} <span data-keep-ko={en ? "" : undefined}>{AUTHOR.name}</span>. All rights reserved.
      </span>
    </div>
  );
}

export function CreditCard() {
  const t = useT();
  const en = useLang().lang === "en";
  return (
    <section className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white px-5 py-5 sm:flex-row sm:items-center sm:px-6">
      <div className="tracking-[0.02em]">
        <span className="text-xs font-semibold text-brand-700">{t("만든 사람")}</span>
        <div className="mt-1 text-lg font-bold tracking-[0.05em] text-slate-900" data-keep-ko={en ? "" : undefined}>
          {AUTHOR.org} {AUTHOR.role} {AUTHOR.name}
        </div>
        {en && <div className="text-sm text-slate-600">Teacher, Samcheonpo Girls&apos; Middle School</div>}
        {AUTHOR.email && (
          <div className="mt-1 text-sm text-slate-600">
            {t("이용 문의")}{" "}
            <a href={`mailto:${AUTHOR.email}`} className="ml-1 font-medium text-brand-700 hover:underline">
              {AUTHOR.email}
            </a>
          </div>
        )}
      </div>
      <div className="max-w-md text-xs leading-relaxed tracking-[0.01em] text-slate-500">
        © {AUTHOR.year} <span data-keep-ko={en ? "" : undefined}>{AUTHOR.name}</span>. All rights reserved.
        <br />{t("이 플랫폼의 기획·구성·콘텐츠에 대한 저작권은 제작자에게 있어요.")}
      </div>
    </section>
  );
}
