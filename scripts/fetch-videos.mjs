// 공식 채널 영상 자동 연결 (GitHub Actions에서 YOUTUBE_API_KEY로 실행)
// 검색(search.list, 100 units) 대신 채널 업로드 목록(1 unit/50개)을 받아 제목으로 매칭 → 하루 할당량(10,000)의 1% 미만 사용.
// 신뢰 채널만 사용: 한국고용정보원 직업진로동영상, 한국고용정보원(고용24), 교육부
import { readFileSync, writeFileSync } from "node:fs";

const KEY = process.env.YOUTUBE_API_KEY;
if (!KEY) {
  console.log("YOUTUBE_API_KEY 없음 → 건너뜀");
  process.exit(0);
}
const API = "https://www.googleapis.com/youtube/v3";
const get = async (path, params) => {
  const u = new URL(`${API}/${path}`);
  Object.entries({ ...params, key: KEY }).forEach(([k, v]) => u.searchParams.set(k, v));
  const r = await fetch(u);
  if (!r.ok) throw new Error(`${path} ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return r.json();
};

const CHANNELS = [
  { handle: "@KEISwork2011", name: "한국고용정보원 직업진로동영상", bonus: 0.5, only: null },
  { handle: "@worknet_keis", name: "한국고용정보원", bonus: 0.2, only: null },
  { handle: "@교육부", name: "교육부", bonus: 0.4, only: /직업탐구|별일|직업인|진로/ },
  // 커리어넷(한국직업능력연구원): 핸들이 틀려 다른 채널이 걸리지 않도록 채널 이름을 확인한 경우만 쓴다(expect). 없으면 건너뜀
  { handle: "@careernet", name: "커리어넷", bonus: 0.3, only: /직업|진로|커리어|인터뷰|현장/, expect: /커리어넷|careernet|한국직업능력/i },
  { handle: "@career_net", name: "커리어넷", bonus: 0.3, only: /직업|진로|커리어|인터뷰|현장/, expect: /커리어넷|careernet|한국직업능력/i },
];

// 매칭 규칙(이름 변형·제목 정리·점수·키워드 표)은 scripts/video-match.mjs. 규칙을 바꾸면 오프라인으로 먼저 시험한다(.content-gen/test-match.mjs)
import { buildKeywords, buildRelated, nearMisses, pick, EXCLUDE } from "./video-match.mjs";
const readJ = (p) => { try { return JSON.parse(readFileSync(new URL(p, import.meta.url), "utf8")); } catch { return null; } };
const { jobKw: JOB_KW, majorKw: MAJOR_KW, jobNames } = buildKeywords((p) => JSON.parse(readFileSync(new URL(p, import.meta.url), "utf8")));
const cnJobList = readJ("../src/data/careernet/jobs.json")?.jobs ?? [];

async function uploads(ch) {
  const c = await get("channels", { part: "contentDetails,snippet", forHandle: ch.handle });
  const pl = c.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!pl) { console.log("채널 없음:", ch.handle); return []; }
  if (ch.expect && !ch.expect.test(c.items[0].snippet?.title ?? "")) { console.log("채널 이름이 달라 건너뜀:", ch.handle, c.items[0].snippet?.title); return []; }
  const out = [];
  let token = "";
  for (let i = 0; i < 120; i++) {
    const r = await get("playlistItems", { part: "snippet", playlistId: pl, maxResults: "50", ...(token ? { pageToken: token } : {}) });
    for (const it of r.items ?? []) {
      const s = it.snippet;
      const id = s?.resourceId?.videoId;
      if (!id || !s.title || /Private video|Deleted video/.test(s.title)) continue;
      if (EXCLUDE.test(s.title)) continue;
      if (ch.only && !ch.only.test(s.title)) continue;
      out.push({ id, title: s.title, channel: ch.name, bonus: ch.bonus });
    }
    token = r.nextPageToken;
    if (!token) break;
  }
  console.log(ch.handle, out.length, "개");
  return out;
}

async function filterEmbeddable(list) {
  const ids = [...new Set(list.map((v) => v.id))];
  const ok = new Set();
  for (let i = 0; i < ids.length; i += 50) {
    const r = await get("videos", { part: "status,contentDetails", id: ids.slice(i, i + 50).join(",") });
    for (const it of r.items ?? []) {
      const st = it.status;
      if (st.embeddable && st.privacyStatus === "public" && !st.madeForKids && !it.contentDetails?.regionRestriction?.blocked?.includes("KR")) ok.add(it.id);
    }
  }
  return ok;
}

const all = (await Promise.all(CHANNELS.map(uploads))).flat();
const jobs = Object.fromEntries(Object.entries(JOB_KW).map(([id, kw]) => [id, pick(all, kw)]));
const majors = Object.fromEntries(Object.entries(MAJOR_KW).map(([id, kw]) => [id, pick(all, kw, true)]));
const ok = await filterEmbeddable([...Object.values(jobs), ...Object.values(majors)].flat());
const clean = (m) => Object.fromEntries(Object.entries(m).map(([k, vs]) => [k, vs.filter((v) => ok.has(v.id)).slice(0, 3).map(({ id, title, channel }) => ({ id, title, channel }))]).filter(([, vs]) => vs.length));
const cleanJobs = clean(jobs);
// 직접 영상이 없는 직업 → 같은 분야 직업의 영상(이름이 비슷한 직업 먼저). 화면에서 "같은 분야 직업 영상"으로 표시
const related = buildRelated(cleanJobs, Object.keys(JOB_KW), cnJobList, readJ("../src/data/careernet/job-detail.json")?.map ?? {});
// 규칙 개선용 진단: 직접 영상이 없는 직업 중 제목이 꽤 비슷한 영상(자동 연결은 하지 않는다. 이름 변형이 필요한지 사람이 본다)
const near = nearMisses(all, Object.keys(JOB_KW).filter((id) => !cleanJobs[id]?.length), jobNames);
if (near.length) console.log("직접 영상 없는 직업의 비슷한 제목 후보(확인용):\n" + near.slice(0, 60).join("\n"));
const out = { asOf: new Date().toISOString().slice(0, 10), source: CHANNELS.map((c) => c.name).join(", "), jobs: cleanJobs, jobsRelated: related, majors: clean(majors) };
writeFileSync(new URL("../src/data/videos-auto.json", import.meta.url), JSON.stringify(out, null, 1) + "\n");
console.log(`직업 직접 ${Object.keys(out.jobs).length}/${Object.keys(JOB_KW).length} + 같은 분야 ${Object.keys(related).length}, 학과 ${Object.keys(out.majors).length}/${Object.keys(MAJOR_KW).length}`);
