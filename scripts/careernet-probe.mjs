// 커리어넷 Open API 응답 모양 확인용(수동 실행). 키는 GitHub Secrets(CAREERNET_API_KEY)에서만 읽고, 결과 파일에는 키를 지운다.
import { mkdirSync, writeFileSync } from "node:fs";
const KEY = process.env.CAREERNET_API_KEY;
if (!KEY) { console.log("CAREERNET_API_KEY 없음"); process.exit(1); }
const OUT = "careernet-probe"; mkdirSync(OUT, { recursive: true });
const B = "https://www.career.go.kr/cnet";
const hide = (s) => s.split(KEY).join("***");
async function get(name, url, keep = 6000) {
  try {
    const r = await fetch(url, { headers: { "User-Agent": "myroad-gyeongnam/1.0" } });
    const t = await r.text();
    writeFileSync(`${OUT}/${name}.txt`, hide(`${r.status} ${url}\n\n${t.slice(0, keep)}`));
    console.log(name, r.status, t.length);
    return t;
  } catch (e) { console.log(name, "실패", e.message); return ""; }
}
const j = (t) => { try { return JSON.parse(t); } catch { return null; } };
// 1) 새 직업백과
const jl = await get("jobs-list", `${B}/front/openapi/jobs.json?apiKey=${KEY}&pageIndex=1`, 12000);
const jj = j(jl);
const first = JSON.stringify(jj ?? {}).match(/"(?:seq|job_cd|jobdicSeq|SEQ)"\s*:\s*"?(\d+)/);
const seq = first?.[1] ?? "1";
for (const p of [`job.json?apiKey=${KEY}&seq=${seq}`, `jobs/${seq}.json?apiKey=${KEY}`, `jobView.json?apiKey=${KEY}&seq=${seq}`, `jobs.json?apiKey=${KEY}&seq=${seq}`]) {
  await get("job-detail-" + p.split("?")[0].replace(/\W/g, "_"), `${B}/front/openapi/${p}`, 15000);
}
// 2) 예전 직업정보(2023년 8월 종료 예정이었음) — 아직 되는지
const ol = await get("job-old-list", `${B}/openapi/getOpenApi.json?apiKey=${KEY}&svcType=api&svcCode=JOB&contentType=json&gubun=job_dic_list&thisPage=1&perPage=3`);
const os = ol.match(/"jobdicSeq"\s*:\s*"?(\d+)/)?.[1];
if (os) await get("job-old-detail", `${B}/openapi/getOpenApi.json?apiKey=${KEY}&svcType=api&svcCode=JOB_VIEW&contentType=json&gubun=job_dic_list&jobdicSeq=${os}`, 15000);
// 3) 학과정보(대학교)
const ml = await get("major-list", `${B}/openapi/getOpenApi?apiKey=${KEY}&svcType=api&svcCode=MAJOR&contentType=json&gubun=univ_list&thisPage=1&perPage=3`);
const ms = ml.match(/"majorSeq"\s*:\s*"?(\d+)/)?.[1];
if (ms) await get("major-detail", `${B}/openapi/getOpenApi?apiKey=${KEY}&svcType=api&svcCode=MAJOR_VIEW&contentType=json&gubun=univ_list&majorSeq=${ms}`, 20000);
const mt = await get("major-search", `${B}/openapi/getOpenApi?apiKey=${KEY}&svcType=api&svcCode=MAJOR&contentType=json&gubun=univ_list&searchTitle=${encodeURIComponent("조선해양공학과")}&perPage=5`);
