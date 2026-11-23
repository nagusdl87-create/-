// 직업 백과 전체(처음부터 쓴 51개 + 커리어넷 자료로 쓴 직업). 자료가 커서, 첫 화면처럼 가벼워야 하는 곳은 jobs-core를 쓴다.
export * from "./jobs-core";
import { CORE_JOBS, type Job } from "./jobs-core";
import GEN_JOBS from "./gen/jobs.json";
export const JOBS: Job[] = [...CORE_JOBS, ...(GEN_JOBS as unknown as Job[])];
export const JOB_MAP: Record<string, Job> = Object.fromEntries(JOBS.map((j) => [j.id, j]));
