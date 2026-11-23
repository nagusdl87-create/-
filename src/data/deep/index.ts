// 직업·학과 상세 콘텐츠 모음 (기준: docs/content-standard.md)
import type { JobDeep, MajorDeep } from "./types";
import { JOBS_A } from "./jobs-a";
import { JOBS_B } from "./jobs-b";
import { MAJORS_A } from "./majors-a";
import { MAJORS_B } from "./majors-b";
import GEN_JOB_DEEP from "../gen/jobs-deep.json";
import GEN_MAJOR_DEEP from "../gen/majors-deep.json";

export const JOB_DEEP: Record<string, JobDeep> = { ...JOBS_A, ...JOBS_B, ...(GEN_JOB_DEEP as Record<string, JobDeep>) };
export const MAJOR_DEEP: Record<string, MajorDeep> = { ...MAJORS_A, ...MAJORS_B, ...(GEN_MAJOR_DEEP as Record<string, MajorDeep>) };
