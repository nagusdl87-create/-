// 직업 목록 화면용 얇은 요약. 카드에 보이는 항목만 담아 첫 화면을 가볍게 한다(전체는 검색어를 입력할 때 불러옴).
// 커리어넷 자료로 쓴 부분(lite/jobs-gen.json)은 scripts/build-lite.mjs가 gen/jobs.json에서 만든다(npm run build 때 자동).
import { CORE_JOBS, type Job } from "./jobs-core";
import GEN_JOBS from "./lite/jobs-gen.json";

export type JobLite = Pick<Job, "id" | "name" | "emoji" | "field" | "riasec" | "values" | "summary">;

const jl = (j: Job): JobLite => ({ id: j.id, name: j.name, emoji: j.emoji, field: j.field, riasec: j.riasec, values: j.values, summary: j.summary });

export const JOBS_LITE: JobLite[] = [...CORE_JOBS.map(jl), ...(GEN_JOBS as unknown as JobLite[])];
