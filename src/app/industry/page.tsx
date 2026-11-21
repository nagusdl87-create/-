"use client";

import { useState } from "react";
import Link from "next/link";
import { GN_INDUSTRIES, GN_SCHOOLS, KIND_INFO } from "@/data/gn";
import { JOB_MAP, JOBS } from "@/data/jobs";
import { MAJORS } from "@/data/majors";
import { PageHead } from "@/components/ui";

export default function IndustryPage() {
  const [sel, setSel] = useState(GN_INDUSTRIES[0].id);
  const ind = GN_INDUSTRIES.find((i) => i.id === sel)!;
  const jobs = ind.jobs.map((j) => JOB_MAP[j]).filter(Boolean);
  const majors = MAJORS.filter((m) => m.jobs.some((j) => ind.jobs.includes(j)));
  const schools = ind.schools.map((n) => GN_SCHOOLS.find((s) => s.name === n)).filter(Boolean);
  const gnJobs = JOBS.filter((j) => j.gn);

  return (
    <div>
      <PageHead title="경남 산업 진로 지도" desc="경남에는 조선, 항공우주, 기계·방산, 나노, 항노화 같은 특색 있는 산업이 있어요. 우리 지역 산업과 연결된 직업·학과·고등학교를 함께 살펴보세요." />
      <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {GN_INDUSTRIES.map((i) => (
          <button key={i.id} aria-pressed={sel === i.id} onClick={() => setSel(i.id)} className={`card p-3 text-left transition ${sel === i.id ? "border-brand-400 ring-2 ring-brand-100" : "hover:border-brand-200"}`}>
            <div className="text-2xl">{i.emoji}</div>
            <div className="mt-1 font-bold">{i.name}</div>
            <div className="text-xs text-slate-500">{i.regions.join("·")}</div>
          </button>
        ))}
      </div>

      <div className="card mt-4">
        <div className="text-xs font-bold text-brand-600">{ind.regions.join(" · ")}</div>
        <h2 className="text-2xl font-extrabold">{ind.emoji} {ind.name}</h2>
        <p className="mt-1 text-slate-600">{ind.desc}</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <div className="text-xs font-bold text-slate-500">관련 직업</div>
            <ul className="mt-2 space-y-1.5">
              {jobs.map((j) => (
                <li key={j.id}>
                  <Link href={`/jobs/${j.id}`} className="flex items-center gap-2 rounded-xl border border-slate-200 p-2 text-sm font-semibold hover:border-brand-300">
                    <span className="text-xl">{j.emoji}</span> {j.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500">관련 대학 학과</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {majors.map((m) => <Link key={m.id} href={`/majors/${m.id}`} className="chip px-3 py-1.5 text-sm hover:border-brand-300">{m.name}</Link>)}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500">관련 경남 고등학교</div>
            <ul className="mt-2 space-y-1.5">
              {schools.map((s) => (
                <li key={s!.id}>
                  <Link href={`/schools#${s!.id}`} className="block rounded-xl border border-slate-200 p-2 text-sm hover:border-brand-300">
                    <b>{s!.name}</b>
                    <div className="text-xs text-slate-500">{s!.region} · {KIND_INFO[s!.kind].name} · {s!.unit} 모집</div>
                  </Link>
                </li>
              ))}
              {schools.length === 0 && <li className="text-sm text-slate-500">일반고·특성화고 등 다양한 경로로 진출할 수 있어요.</li>}
            </ul>
          </div>
        </div>
      </div>

      <h2 className="mb-3 mt-8 text-lg font-bold">경남 산업과 연결된 직업</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {gnJobs.map((j) => (
          <Link key={j.id} href={`/jobs/${j.id}`} className="card flex gap-3 transition hover:border-brand-200">
            <span className="text-3xl">{j.emoji}</span>
            <div>
              <div className="font-bold">{j.name}</div>
              <p className="text-sm text-slate-600">{j.gn}</p>
            </div>
          </Link>
        ))}
      </div>
      <p className="mt-4 text-xs text-slate-400">관련 고등학교는 학교 이름과 공개된 학교 특성을 바탕으로 연결했어요. 학과 구성과 모집 정보는 학교 누리집과 고입정보포털에서 확인하세요.</p>
    </div>
  );
}
