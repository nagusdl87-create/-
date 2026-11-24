// 학과 목록 화면용 얇은 요약. 카드에 보이는 항목만 담아 첫 화면을 가볍게 한다(전체는 검색어를 입력할 때 불러옴).
// 커리어넷 자료로 쓴 부분(lite/*.json)은 scripts/build-lite.mjs가 gen/*.json에서 만든다(npm run build 때 자동).
import { CORE_JOBS } from "./jobs-core";
import { CORE_MAJORS, type Major } from "./majors-core";
import GEN_MAJORS from "./lite/majors-gen.json";
import GEN_JOB_NAMES from "./lite/job-names-gen.json";

export type MajorLite = Pick<Major, "id" | "name" | "track" | "desc" | "core" | "jobs">;

const ml = (m: Major): MajorLite => ({ id: m.id, name: m.name, track: m.track, desc: m.desc, core: m.core.slice(0, 4), jobs: m.jobs });

export const MAJORS_LITE: MajorLite[] = [...CORE_MAJORS.map(ml), ...(GEN_MAJORS as unknown as MajorLite[])];
/** 직업 id → 이름(학과 카드의 '관련 직업'용). 직업 요약 전체를 싣지 않는다 */
export const JOB_NAME_MAP: Record<string, string> = { ...(GEN_JOB_NAMES as Record<string, string>), ...Object.fromEntries(CORE_JOBS.map((j) => [j.id, j.name])) };
