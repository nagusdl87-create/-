"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { FIELDS, JOBS, type FieldId } from "@/data/jobs";
import { RIASEC, RIASEC_ORDER, type RiasecKey } from "@/data/riasec";
import { isTestComplete, rankedJobs } from "@/lib/match";
import { JobCard } from "@/components/JobCard";
import { NextStep, PageHead } from "@/components/ui";

type Sort = "match" | "name";

export default function JobsPage() {
  const { state, ready } = useStore();
  const tested = ready && isTestComplete(state.answers);
  const [q, setQ] = useState("");
  const [field, setField] = useState<FieldId | "all" | "fav">("all");
  const [type, setType] = useState<RiasecKey | "all">("all");
  const [sort, setSort] = useState<Sort>("match");

  const list = useMemo(() => {
    const ranked = tested ? rankedJobs(state) : JOBS.map((job) => ({ job, score: undefined as number | undefined }));
    const kw = q.trim();
    let r = ranked.filter(({ job }) => {
      if (field === "fav" && !state.favorites.includes(job.id)) return false;
      if (field !== "all" && field !== "fav" && job.field !== field) return false;
      if (type !== "all" && !job.riasec.slice(0, 2).includes(type)) return false;
      if (kw) {
        const hay = [job.name, job.summary, ...job.majors, ...job.hsSubjects, ...job.tasks].join(" ");
        if (!hay.includes(kw)) return false;
      }
      return true;
    });
    if (sort === "name" || !tested) r = [...r].sort((a, b) => a.job.name.localeCompare(b.job.name, "ko"));
    return r;
  }, [state, tested, q, field, type, sort]);

  return (
    <div>
      <PageHead
        step={2}
        title="직업 찾기"
        desc={
          tested
            ? "흥미 탐색 결과와 가치관을 바탕으로 잘 맞는 순서대로 보여 드려요. 마음에 드는 직업을 ❤️ 찜해 두면 다음 단계에서 길을 이어 드려요."
            : "관심 있는 직업을 둘러보고 ❤️ 찜해 보세요. 1단계 흥미 탐색을 하면 나와 맞는 정도도 알려 드려요."
        }
      />

      <div className="card mb-4 space-y-3 p-4">
        <input className="input" placeholder="직업, 학과, 과목으로 검색 (예: 로봇, 간호학과, 정보)" value={q} onChange={(e) => setQ(e.target.value)} aria-label="직업 검색" />
        <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
          <button className={`chip shrink-0 ${field === "all" ? "chip-on" : ""}`} onClick={() => setField("all")}>
            전체
          </button>
          <button className={`chip shrink-0 ${field === "fav" ? "chip-on" : ""}`} onClick={() => setField("fav")}>
            ❤️ 찜 {ready ? state.favorites.length : 0}
          </button>
          {(Object.keys(FIELDS) as FieldId[]).map((f) => (
            <button key={f} className={`chip shrink-0 ${field === f ? "chip-on" : ""}`} onClick={() => setField(f)}>
              {FIELDS[f].emoji} {FIELDS[f].name}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            <button className={`chip ${type === "all" ? "chip-on" : ""}`} onClick={() => setType("all")}>
              모든 유형
            </button>
            {RIASEC_ORDER.map((k) => (
              <button key={k} className={`chip ${type === k ? "chip-on" : ""}`} onClick={() => setType(k)}>
                {RIASEC[k].emoji} {RIASEC[k].name}
              </button>
            ))}
          </div>
          {tested && (
            <select className="input w-auto py-1.5 text-xs" value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="정렬">
              <option value="match">잘 맞는 순</option>
              <option value="name">가나다 순</option>
            </select>
          )}
        </div>
      </div>

      <div className="mb-2 text-sm text-slate-500">{list.length}개 직업</div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map(({ job, score }) => (
          <JobCard key={job.id} job={job} score={score} />
        ))}
      </div>
      {list.length === 0 && <p className="py-10 text-center text-sm text-slate-500">조건에 맞는 직업이 없어요. 필터를 바꿔 보세요.</p>}

      <NextStep href="/path" label="길 잇기" hint="찜한 직업까지 가는 길(학과·고교 과목)을 확인해 보세요" />
    </div>
  );
}
