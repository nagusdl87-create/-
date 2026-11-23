"use client";

// 직업·학과 백과 전체(557·503개)를 필요할 때만 불러오는 도우미.
// 처음에는 가벼운 core(처음부터 쓴 51·56개)로 그리고, 전체가 도착하면 다시 그린다(찜한 커리어넷 직업·학과 이름 찾기 등).
import { useEffect, useState } from "react";
import { CORE_JOBS, CORE_JOB_MAP, type Job } from "@/data/jobs-core";
import { CORE_MAJORS, CORE_MAJOR_MAP, type Major } from "@/data/majors-core";

export type Catalog = { JOBS: Job[]; JOB_MAP: Record<string, Job>; MAJORS: Major[]; MAJOR_MAP: Record<string, Major>; full: boolean };
const CORE: Catalog = { JOBS: CORE_JOBS, JOB_MAP: CORE_JOB_MAP, MAJORS: CORE_MAJORS, MAJOR_MAP: CORE_MAJOR_MAP, full: false };
let p: Promise<Catalog> | null = null;
let cached: Catalog | null = null;
const load = () =>
  (p ??= Promise.all([import("@/data/jobs"), import("@/data/majors")]).then(([j, m]) => (cached = { JOBS: j.JOBS, JOB_MAP: j.JOB_MAP, MAJORS: m.MAJORS, MAJOR_MAP: m.MAJOR_MAP, full: true })));

export function useCatalog(): Catalog {
  const [c, setC] = useState<Catalog>(cached ?? CORE);
  useEffect(() => {
    if (c.full) return;
    let on = true;
    load().then((x) => on && setC(x)).catch(() => {});
    return () => { on = false; };
  }, [c.full]);
  return c;
}
