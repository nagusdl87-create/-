// 마이로드 경남 서비스 워커: 한 번 연 페이지·데이터를 인터넷 없이도 열 수 있게 저장한다.
// - 페이지(HTML·화면 데이터): 네트워크 먼저 → 실패하면 저장본 → 없으면 /offline
// - /_next/static (파일명에 해시가 있어 바뀌지 않음): 저장본 먼저
// - /data/*.json (대학·학과 자료): 저장본을 바로 보여 주고 뒤에서 새로 받기 / /data/neis/(급식·개설 과목): 네트워크 먼저
// - 다른 사이트(로그인·Firestore·지도 타일·유튜브 등)는 건드리지 않는다(글꼴 CSS·파일만 저장).
const V = "v2";
const PAGES = `myroad-pages-${V}`;
const STATIC = `myroad-static-${V}`;
const DATA = `myroad-data-${V}`;
const KEEP = [PAGES, STATIC, DATA];
const LIMIT = { [PAGES]: 120, [STATIC]: 400, [DATA]: 300 };
const PRECACHE = ["/", "/offline", "/manifest.webmanifest", "/icon-192.png"];

// 기본 페이지와, 그 페이지가 쓰는 스크립트·스타일 파일까지 미리 저장(처음 보는 페이지를 오프라인에서 열 때 안내 화면이 깨지지 않게)
async function precache() {
  const pages = await caches.open(PAGES);
  const stat = await caches.open(STATIC);
  for (const u of PRECACHE) {
    try {
      const res = await fetch(new Request(u, { cache: "reload" }));
      if (!res.ok) continue;
      await pages.put(new URL(u, self.location.origin).toString(), res.clone());
      if ((res.headers.get("Content-Type") || "").includes("text/html")) {
        const html = await res.text();
        const assets = [...new Set([...html.matchAll(/\/_next\/static\/[^"'\s)]+/g)].map((m) => m[0].replace(/\\$/, "")))];
        await Promise.all(assets.map((a) => stat.add(a).catch(() => {})));
      }
    } catch { /* 설치는 계속 */ }
  }
}

self.addEventListener("install", (e) => {
  e.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith("myroad-") && !KEEP.includes(k)).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});

async function trim(name) {
  const c = await caches.open(name);
  const ks = await c.keys();
  const over = ks.length - LIMIT[name];
  for (let i = 0; i < over; i++) await c.delete(ks[i]);
}

// 화면 데이터(RSC) 요청은 _rsc 값이 매번 달라서 빼고 저장한다
function keyOf(req) {
  const u = new URL(req.url);
  const rsc = req.headers.get("RSC") === "1" || u.searchParams.has("_rsc");
  u.searchParams.delete("_rsc");
  if (rsc) u.searchParams.set("__rsc", "1");
  return u.toString();
}

async function networkFirst(req, isNav) {
  const key = keyOf(req);
  const c = await caches.open(PAGES);
  try {
    const res = await fetch(req);
    if (res.ok && res.type === "basic") {
      c.put(key, res.clone()).then(() => trim(PAGES));
    }
    return res;
  } catch {
    const hit = await c.match(key, { ignoreVary: true });
    if (hit) return hit;
    if (isNav) {
      // /jobs/nurse 와 /jobs/nurse.html 처럼 주소 모양이 다르게 저장됐을 수 있음
      const alt = await c.match(key.replace(/\/$/, "") + ".html");
      if (alt) return alt;
      const off = await c.match(new URL("/offline", self.location.origin).toString());
      if (off) return off;
    }
    return new Response("", { status: 503, statusText: "offline" });
  }
}

async function cacheFirst(req, name) {
  const c = await caches.open(name);
  const hit = await c.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok || res.type === "opaque") c.put(req, res.clone()).then(() => trim(name));
  return res;
}

async function staleWhileRevalidate(req) {
  const c = await caches.open(DATA);
  const hit = await c.match(req);
  const fresh = fetch(req).then((res) => {
    if (res.ok) c.put(req, res.clone()).then(() => trim(DATA));
    return res;
  }).catch(() => hit || new Response("null", { status: 503, headers: { "Content-Type": "application/json" } }));
  return hit || fresh;
}

async function dataNetworkFirst(req) {
  const c = await caches.open(DATA);
  try {
    const res = await fetch(req);
    if (res.ok) c.put(req, res.clone()).then(() => trim(DATA));
    return res;
  } catch {
    return (await c.match(req)) || new Response("null", { status: 503, headers: { "Content-Type": "application/json" } });
  }
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const u = new URL(req.url);

  if (u.origin !== self.location.origin) {
    // 글꼴(jsDelivr Pretendard)만 저장
    if (u.hostname === "cdn.jsdelivr.net" && u.pathname.includes("pretendard")) e.respondWith(cacheFirst(req, STATIC));
    return;
  }
  if (u.pathname === "/sw.js") return;
  if (u.pathname.startsWith("/_next/static/")) return e.respondWith(cacheFirst(req, STATIC));
  if (u.pathname.startsWith("/data/neis/")) return e.respondWith(dataNetworkFirst(req)); // 급식은 매일 바뀜
  if (u.pathname.startsWith("/data/")) return e.respondWith(staleWhileRevalidate(req));
  if (/\.(png|jpg|jpeg|svg|webp|ico|webmanifest)$/.test(u.pathname)) return e.respondWith(cacheFirst(req, STATIC));
  if (req.mode === "navigate" || req.headers.get("RSC") === "1" || u.searchParams.has("_rsc") || u.pathname.endsWith(".txt")) {
    return e.respondWith(networkFirst(req, req.mode === "navigate"));
  }
});
