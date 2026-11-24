// 영어 모드에서 페이지마다 남은 한글 수 세기: BASE=http://localhost:5000 node scripts/i18n-check.cjs [경로...]
// 고유명사 등 한국어를 그대로 두는 곳은 translate="no" 또는 data-keep-ko 속성을 붙이면 세지 않는다.
const { chromium } = require('playwright');
const B = process.env.BASE || 'http://localhost:5000';
const ROUTES = process.argv.slice(2).length ? process.argv.slice(2) : ['/', '/discover', '/jobs', '/jobs/nurse', '/majors', '/majors/naval', '/subjects', '/schools', '/middle', '/highschool', '/admission', '/industry', '/credits', '/credits/school', '/path', '/plan', '/portfolio', '/tests', '/resources', '/guide', '/explore', '/tools', '/future', '/transition', '/report', '/report/summary', '/teacher', '/teacher/share', '/account', '/privacy', '/offline', '/search?q=nurse'];
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } }); const p = await ctx.newPage();
  const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 100)));
  await p.goto(B + '/'); await p.evaluate(() => { localStorage.setItem('myroad:lang', 'en'); const k = 'myroad:v1'; const s = JSON.parse(localStorage.getItem(k) || 'null'); if (s) { s.profile.stage = 'hs'; localStorage.setItem(k, JSON.stringify(s)); } });
  let total = 0;
  { // 첫 방문 홈(학년을 고르기 전)
    const c2 = await b.newContext(); const q = await c2.newPage(); await q.goto(B + '/'); await q.evaluate(() => localStorage.setItem('myroad:lang', 'en')); await q.goto(B + '/'); await q.waitForTimeout(1500);
    const n = await q.evaluate(() => { let n = 0; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); while (w.nextNode()) { const t = w.currentNode; if (t.parentElement.closest('[translate="no"],[data-keep-ko],script,style,noscript')) continue; n += (t.textContent.match(/[가-힣]/g) || []).length; } return n; });
    console.log(`/ (첫 방문) 한글 ${n}자`); total += n; await c2.close();
  }
  for (const r of ROUTES) {
    await p.goto(B + r); await p.waitForTimeout(1500);
    const res = await p.evaluate(() => {
      const skip = (el) => el.closest('[translate="no"],[data-keep-ko],script,style,noscript');
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const bad = []; let n = 0;
      while (w.nextNode()) { const t = w.currentNode; if (!t.textContent.trim() || skip(t.parentElement)) continue; const m = t.textContent.match(/[가-힣]/g); if (m) { n += m.length; if (bad.length < 6) bad.push(t.textContent.trim().slice(0, 40)); } }
      return { n, bad, lang: document.documentElement.lang };
    });
    total += res.n;
    console.log(`${r} [${res.lang}] 한글 ${res.n}자 ${res.bad.length ? '예: ' + res.bad.join(' | ') : ''}`);
  }
  console.log('합계 한글', total, errs.length ? 'errors: ' + errs.join(' / ') : 'errors: none');
  await b.close();
})();
