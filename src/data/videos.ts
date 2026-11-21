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
};
export const MAJOR_VIDEOS: Record<string, Video[]> = {
  nursing: [{ id: "3tt2-No2IkA", title: "간호학과", channel: "한국고용정보원 직업진로동영상" }],
};

export const videoSearchLinks = (q: string) => [
  { label: "한국고용정보원 직업진로동영상", url: `https://www.youtube.com/@KEISwork2011/search?query=${encodeURIComponent(q)}` },
  { label: "한국고용정보원(고용24)", url: `https://www.youtube.com/@worknet_keis/search?query=${encodeURIComponent(q)}` },
  { label: "커리어넷 직업·학과 영상", url: "https://www.career.go.kr/" },
];

// 빌드 때 YouTube Data API로 공식 채널 업로드 목록에서 자동 매칭한 영상 (scripts/fetch-videos.mjs)
import AUTO from "./videos-auto.json";
const auto = AUTO as { jobs: Record<string, Video[]>; majors: Record<string, Video[]> };
const merge = (a: Video[] = [], b: Video[] = []) => {
  const seen = new Set<string>();
  return [...a, ...b].filter((v) => !seen.has(v.id) && seen.add(v.id)).slice(0, 4);
};
export const jobVideos = (id: string) => merge(JOB_VIDEOS[id], auto.jobs[id]);
export const majorVideos = (id: string) => merge(MAJOR_VIDEOS[id], auto.majors[id]);
