// 앱 아이콘·공유 이미지 생성: node scripts/make-assets.cjs (Playwright 필요)
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const out = path.join(__dirname, "..", "public");
const svg = fs.readFileSync(path.join(__dirname, "..", "src", "app", "icon.svg"), "utf8");
const font = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">';
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  // 마스크 가능 아이콘: 가장자리 여백 포함 정사각형
  for (const [name, size, pad] of [["icon-192.png", 192, 0], ["icon-512.png", 512, 0], ["icon-maskable-512.png", 512, 0.12], ["apple-touch-icon.png", 180, 0.08]]) {
    await p.setViewportSize({ width: size, height: size });
    const inner = svg.replace("<svg ", `<svg width="${size * (1 - pad * 2)}" height="${size * (1 - pad * 2)}" `).replace('rx="9"', pad ? 'rx="0"' : 'rx="9"');
    await p.setContent(`<html><body style="margin:0;display:grid;place-items:center;width:${size}px;height:${size}px;background:${pad ? "#127a67" : "transparent"}">${inner}</body></html>`);
    await p.screenshot({ path: path.join(out, name), omitBackground: !pad });
  }
  await p.setViewportSize({ width: 1200, height: 630 });
  await p.setContent(`<html><head>${font}</head><body style="margin:0;width:1200px;height:630px;font-family:'Pretendard Variable',sans-serif;background:#f6f7f6;display:flex;align-items:center;">
    <div style="padding:0 90px;flex:1">
      <div style="display:flex;align-items:center;gap:16px">${svg.replace("<svg ", '<svg width="64" height="64" ')}<span style="font-size:34px;font-weight:700;color:#0f172a">마이로드 <span style="font-size:22px;color:#116254;background:#d5f2ea;padding:4px 10px;border-radius:8px;vertical-align:middle">경남</span></span></div>
      <div style="margin-top:44px;font-size:64px;font-weight:700;line-height:1.2;color:#0f172a;letter-spacing:-0.03em">흩어진 진로 정보를<br><span style="color:#116254">나만의 지도 한 장</span>으로</div>
      <div style="margin-top:28px;font-size:28px;color:#475569">경남 중·고등학생 진로·학업 설계 · 고교 찾기 · 192학점 설계</div>
    </div>
    <svg width="260" height="630" viewBox="0 0 260 630" style="margin-right:60px"><path d="M40 560 C40 400 220 360 220 200 S120 90 200 60" fill="none" stroke="#79cdb9" stroke-width="10" stroke-linecap="round" stroke-dasharray="2 22"/><circle cx="40" cy="560" r="18" fill="#127a67"/><circle cx="200" cy="60" r="22" fill="#ffbe55"/></svg>
  </body></html>`, { waitUntil: "networkidle" });
  await p.screenshot({ path: path.join(out, "og.png") });
  await b.close();
  console.log("done");
})();
