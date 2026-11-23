// 공식 채널 영상 (임베드 허용 확인: YouTube oEmbed 200)
// 출처: 한국고용정보원 직업진로동영상(@KEISwork2011), 한국고용정보원(@worknet_keis), 교육부 「직업탐구_별일입니다」
export type Video = { id: string; title: string; channel: string };
export const JOB_VIDEOS: Record<string, Video[]> = {
  nurse: [
    { id: "XgmnrQS_c3Q", title: "간호사", channel: "교육부" },
    { id: "sxWzTJ5n75M", title: "간호사", channel: "한국고용정보원" },
    { id: "vVYTnkE7V6E", title: "전문간호사", channel: "한국고용정보원 직업진로동영상" },
  ],
  teacher: [
    { id: "Al7VVrnbGeE", title: "교사", channel: "한국고용정보원 직업진로동영상" },
    { id: "lk3qGNJHBhY", title: "초등학교 교사", channel: "교육부" },
  ],
  webtoon: [{ id: "W7c4g-o8NXU", title: "만화가(웹툰작가)", channel: "한국고용정보원 직업진로동영상" }],
  "robot-engineer": [{ id: "aZOwKcEbguA", title: "안드로이드 로봇 공학 기술자", channel: "한국고용정보원 직업진로동영상" }],
  "software-dev": [{ id: "RneNxRQbjaw", title: "소프트웨어개발자", channel: "한국고용정보원 직업진로동영상" }],
  police: [{ id: "T95qvO5dmP0", title: "사이버경찰관", channel: "한국고용정보원 직업진로동영상" }],
  // 2026-11-22 보강(oEmbed로 임베드 가능 확인)
  accountant: [{ id: "dtAuwfsLriA", title: "내일을 잡아라 - 회계사", channel: "한국고용정보원 직업진로동영상" }],
  pd: [
    { id: "U-Az-YLJcC8", title: "[직업소개] 예능PD", channel: "한국고용정보원 직업진로동영상" },
    { id: "83T_D8BvU68", title: "예능PD", channel: "한국고용정보원 직업진로동영상" },
  ],
  biologist: [
    { id: "rUVu_UuvAXQ", title: "워크넷이 만난 사람들 - 생명정보학자", channel: "한국고용정보원" },
    { id: "vfimZIazgR0", title: "유전자감식연구원", channel: "한국고용정보원 직업진로동영상" },
  ],
  "anti-aging": [
    { id: "2cvUzO_SGEs", title: "Work&Life - 바이오기술", channel: "한국고용정보원 직업진로동영상" },
    { id: "qbknknBCLrw", title: "발효식품연구원", channel: "한국고용정보원 직업진로동영상" },
  ],
  pharmacist: [{ id: "r4f-xJ1U8R4", title: "학과정보 - 의약계열(약학 포함)", channel: "한국고용정보원 직업진로동영상" }],
  "public-officer": [{ id: "Vx5sWsinpxc", title: "2021 내일을 JOB아라 - 공무원", channel: "한국고용정보원 직업진로동영상" }],
  "flight-attendant": [{ id: "ytFQembQTJg", title: "항공기 승무원", channel: "한국고용정보원 직업진로동영상" }],
};
export const MAJOR_VIDEOS: Record<string, Video[]> = {
  nursing: [{ id: "3tt2-No2IkA", title: "간호학과", channel: "한국고용정보원 직업진로동영상" }],
};

export { videoSearchLinks } from "./videos-links";

// 빌드 때 YouTube Data API로 공식 채널 업로드 목록에서 자동 매칭한 영상 (scripts/fetch-videos.mjs)
import AUTO from "./videos-auto.json";
const auto = AUTO as { jobs: Record<string, Video[]>; majors: Record<string, Video[]>; jobsRelated?: Record<string, { field: string; videos: Video[] }> };
const merge = (a: Video[] = [], b: Video[] = []) => {
  const seen = new Set<string>();
  return [...a, ...b].filter((v) => !seen.has(v.id) && seen.add(v.id)).slice(0, 4);
};
export const jobVideos = (id: string) => merge(JOB_VIDEOS[id], auto.jobs[id]);
export const majorVideos = (id: string) => merge(MAJOR_VIDEOS[id], auto.majors[id]);
// 직접 소개 영상이 없는 직업: 같은 분야(커리어넷 직업 분류) 직업의 영상. 화면에서 "같은 분야 직업 영상"이라고 밝혀서 보여 준다
export const jobRelatedVideos = (id: string): { field: string; videos: Video[] } | null => {
  const r = auto.jobsRelated?.[id];
  return r && r.videos.length ? r : null;
};
// 학과 영상이 없을 때의 대체 순서
//  ① 학과 직접 영상 → ② 관련 직업의 직접 영상 → ③ 관련 직업의 같은 분야 영상 → ④ 같은 계열 다른 학과의 영상
// kind로 어느 단계인지 알려 주어, 화면에서 "직접 영상이 아니다"라고 밝히게 한다.
export type MajorVideoKind = "direct" | "jobs" | "jobField" | "track";
type MajorLite = { id: string; name: string; track: string; jobs: string[] };
const jobsPick = (jobIds: string[], f: (j: string) => Video | undefined) => merge([], jobIds.map(f).filter((v): v is Video => !!v));
const bigrams = (t: string) => {
  const n = t.replace(/[^p{L}p{N}]/gu, "");
  const r = new Set<string>();
  for (let i = 0; i < n.length - 1; i++) r.add(n.slice(i, i + 2));
  return r;
};
const sim = (a: string, b: string) => {
  const x = bigrams(a), y = bigrams(b);
  let c = 0;
  x.forEach((g) => y.has(g) && c++);
  return c / Math.max(1, Math.min(x.size, y.size));
};
const ownVideos = (m: MajorLite): { kind: Exclude<MajorVideoKind, "track">; videos: Video[] } | null => {
  const d = majorVideos(m.id);
  if (d.length) return { kind: "direct", videos: d };
  const j = jobsPick(m.jobs, (x) => jobVideos(x)[0]);
  if (j.length) return { kind: "jobs", videos: j };
  const f = jobsPick(m.jobs, (x) => jobRelatedVideos(x)?.videos[0]);
  if (f.length) return { kind: "jobField", videos: f };
  return null;
};
// all: 전체 학과 목록(같은 계열을 찾는 데 쓴다). 이름이 비슷한 학과의 영상을 먼저 고른다
export const majorVideoSet = (m: MajorLite, all: MajorLite[]): { kind: MajorVideoKind; videos: Video[] } => {
  const own = ownVideos(m);
  if (own) return own;
  const ranked = all
    .filter((o) => o.id !== m.id && o.track === m.track)
    .map((o) => ({ o, s: sim(m.name, o.name) }))
    .sort((a, b) => b.s - a.s);
  const seen = new Set<string>();
  const vids: Video[] = [];
  for (const { o } of ranked) {
    const v = ownVideos(o)?.videos[0];
    if (v && !seen.has(v.id)) { seen.add(v.id); vids.push(v); }
    if (vids.length >= 3) break;
  }
  return { kind: "track", videos: vids };
};
