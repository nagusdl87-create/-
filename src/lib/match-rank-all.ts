// 직업 백과 전체(557개)를 맞는 순서로 정렬. 직업 자료 전체를 불러오므로 꼭 필요한 곳(홈 추천·보고서 요약)에서만 쓴다.
import { JOBS } from "@/data/jobs";
import type { AppState } from "./store";
import { rankedJobs } from "./match-rank";

export const rankedAllJobs = (state: AppState) => rankedJobs(state, JOBS);
