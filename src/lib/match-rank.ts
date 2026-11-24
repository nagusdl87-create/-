// 흥미 탐색 결과로 직업 목록을 맞는 순서로 정렬. match.ts와 따로 둔다(첫 화면 가볍게). 직업 목록은 부르는 쪽에서 넘긴다(전체 JOBS 또는 얇은 JOBS_LITE).
import type { Job } from "@/data/jobs-core";
import type { AppState } from "./store";
import { jobMatch, riasecScores } from "./match";

export function rankedJobs<T extends Pick<Job, "riasec" | "values">>(state: AppState, JOBS: T[]) {
  const scores = riasecScores(state.answers);
  return JOBS.map((j) => ({ job: j, score: jobMatch(j, scores, state.values) })).sort((a, b) => b.score - a.score);
}
