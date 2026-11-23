// 학과 백과 전체(처음부터 쓴 56개 + 커리어넷 자료로 쓴 학과). 가볍게 쓸 곳은 majors-core.
export * from "./majors-core";
import { CORE_MAJORS, type Major } from "./majors-core";
import GEN_MAJORS from "./gen/majors.json";
export const MAJORS: Major[] = [...CORE_MAJORS, ...(GEN_MAJORS as unknown as Major[])];
export const MAJOR_MAP: Record<string, Major> = Object.fromEntries(MAJORS.map((m) => [m.id, m]));
