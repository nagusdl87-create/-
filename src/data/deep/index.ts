// 직업·학과 상세 콘텐츠 모음 (기준: docs/content-standard.md)
import type { JobDeep, MajorDeep } from "./types";
import { JOBS_A } from "./jobs-a";
import { JOBS_B } from "./jobs-b";
import { MAJORS_A } from "./majors-a";
import { MAJORS_B } from "./majors-b";

export const JOB_DEEP: Record<string, JobDeep> = { ...JOBS_A, ...JOBS_B };
export const MAJOR_DEEP: Record<string, MajorDeep> = { ...MAJORS_A, ...MAJORS_B };
