// 흥미 탐색 결과로 직업 백과 전체(557개)를 맞는 순서로 정렬. 직업 자료 전체가 필요해 match.ts와 따로 둔다(첫 화면 가볍게).
import { JOBS } from "@/data/jobs";
import type { AppState } from "./store";
import { jobMatch, riasecScores } from "./match";

export function rankedJobs(state: AppState) {
  const scores = riasecScores(state.answers);
  return JOBS.map((j) => ({ job: j, score: jobMatch(j, scores, state.values) })).sort((a, b) => b.score - a.score);
}
