// 기록이 있는 학생(흥미 탐색·찜·192학점·포트폴리오 예시)으로 영어 모드 남은 한글 세기: BASE=http://localhost:5000 node scripts/i18n-check-filled.cjs
// 학생이 직접 쓴 글(이름·학교·진로 가설)은 data-keep-ko로 빼고 센다.
const { chromium } = require('playwright');
const B = process.env.BASE || 'http://localhost:5000';
const R = ['/', '/discover', '/jobs', '/jobs/pilot', '/majors', '/majors/aero', '/path', '/plan', '/credits', '/credits/school', '/portfolio', '/report', '/report/summary', '/highschool', '/schools', '/admission', '/account'];
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } }); const p = await ctx.newPage();
  const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 120))); p.on('dialog', (d) => d.accept());
  await p.goto(B); await p.click('text=고등학생이에요'); await p.waitForTimeout(200);
  await p.goto(B + '/discover'); await p.waitForSelector('fieldset');
  for (let pg = 0; pg < 5; pg++) {
    const fsets = await p.$$('fieldset');
    for (let i = 0; i < fsets.length; i++) { const btns = await fsets[i].$$('button'); await btns[(i * 3 + pg) % 4].click(); }
    await p.click('text=다음 →');
  }
  for (const v of ['지식 탐구', '창의', '봉사']) await p.click(`button:has-text("${v}")`);
  await p.click('text=다음 →');
  for (const s of ['호기심', '끈기']) await p.click(`button:has-text("${s}")`);
  await p.fill('#nm', 'Bada'); await p.fill('#sc', '경남고'); await p.selectOption('#gr', 'hs2');
  await p.click('text=결과 보기'); await p.waitForTimeout(300);
  await p.goto(B + '/jobs'); await p.waitForTimeout(300);
  for (let i = 0; i < 3; i++) await p.locator('button[aria-label="찜하기"]').nth(i).click().catch(() => {});
  await p.goto(B + '/majors/aero'); await p.waitForTimeout(300);
  await p.click('text=이 학과 기준으로 192학점 설계하기'); await p.waitForURL('**/credits');
  await p.click('text=1학년 공통과목 채우기'); await p.click('text=계열 추천으로 2·3학년 채우기'); await p.waitForTimeout(300);
  await p.goto(B + '/path'); await p.waitForTimeout(300); await p.click('text=찜한 학과로 초안').catch(() => {});
  await p.goto(B + '/portfolio'); await p.click('text=예시 불러오기').catch(() => {}); await p.waitForTimeout(300);
  await p.goto(B + '/plan'); await p.waitForTimeout(300);
  // 영어로 전환
  await p.evaluate(() => localStorage.setItem('myroad:lang', 'en'));
  let total = 0;
  for (const r of R) {
    await p.goto(B + r); await p.waitForTimeout(1500);
    const res = await p.evaluate(() => {
      const skip = (el) => el.closest('[translate="no"],[data-keep-ko],script,style,noscript,input,textarea');
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); const bad = []; let n = 0;
      while (w.nextNode()) { const t = w.currentNode; if (!t.textContent.trim() || skip(t.parentElement)) continue; const m = t.textContent.match(/[가-힣]/g); if (m) { n += m.length; if (bad.length < 10) bad.push(t.textContent.trim().slice(0, 50)); } }
      return { n, bad };
    });
    total += res.n;
    if (res.n) console.log(`${r} 한글 ${res.n}자: ${res.bad.join(' | ')}`);
  }
  console.log('합계', total, errs.length ? 'errors: ' + errs.join(' / ') : 'errors: none');
  await b.close();
})();
