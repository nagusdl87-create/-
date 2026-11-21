// 전체 흐름 브라우저 테스트: BASE=http://localhost:5000 node scripts/e2e.cjs (Playwright 필요)
const { chromium } = require('playwright');
const fs = require('fs');
const D = process.env.SHOTS || require('path').join(require('os').tmpdir(), 'myroad-shots') + '/';
fs.mkdirSync(D, { recursive: true });
const B = process.env.BASE || 'http://localhost:3100';
const errs = [];
const watch = (p, tag) => {
  p.on('pageerror', (e) => errs.push(`${tag} pageerror ${e.message}`));
  p.on('console', (m) => { if (m.type() === 'error' && !/tile\.openstreetmap|Failed to load resource/.test(m.text())) errs.push(`${tag} console ${m.text()}`); });
  p.on('dialog', (d) => d.accept());
};
async function answerDiscover(p) {
  await p.goto(B + '/discover'); await p.waitForSelector('fieldset');
  for (let pg = 0; pg < 5; pg++) {
    const fsets = await p.$$('fieldset');
    for (let i = 0; i < fsets.length; i++) { const btns = await fsets[i].$$('button'); await btns[(i * 3 + pg) % 4].click(); }
    await p.click('text=다음 →');
  }
  for (const v of ['지식 탐구', '창의', '봉사']) await p.click(`button:has-text("${v}")`);
  await p.click('text=다음 →');
  for (const s of ['호기심', '끈기']) await p.click(`button:has-text("${s}")`);
}
(async () => {
  for (let i = 0; i < 40; i++) { try { await fetch(B); break; } catch { await new Promise((r) => setTimeout(r, 500)); } }
  const b = await chromium.launch();

  // ── 고등학생 흐름
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: B });
  const p = await ctx.newPage(); watch(p, 'hs');
  await p.goto(B); await p.screenshot({ path: D + '01-onboard.png' });
  await p.click('text=고등학생이에요'); await p.waitForTimeout(200);
  await answerDiscover(p);
  await p.fill('#nm', '바다'); await p.fill('#sc', '경남고'); await p.selectOption('#gr', 'hs2');
  await p.click('text=결과 보기'); await p.waitForTimeout(200);
  await p.goto(B + '/majors'); await p.waitForTimeout(200);
  await p.fill('input[aria-label="학과 검색"]', '항공');
  await p.locator('button[aria-label="찜하기"]').first().click();
  await p.goto(B + '/majors/aero'); await p.waitForTimeout(200); await p.screenshot({ path: D + '02-major.png', fullPage: true });
  await p.click('text=이 학과 기준으로 192학점 설계하기'); await p.waitForURL('**/credits');
  await p.click('text=1학년 공통과목 채우기');
  await p.click('text=계열 추천으로 2·3학년 채우기'); await p.waitForTimeout(200);
  await p.locator('text=+ 과목 담기').nth(2).click(); await p.waitForSelector('[role=dialog]');
  await p.screenshot({ path: D + '03-picker.png' });
  await p.fill('input[aria-label="직접 입력 과목"]', '고급 물리학(공동교육과정)'); await p.click('text=+ 추가');
  await p.keyboard.press('Escape'); await p.waitForTimeout(200);
  const dialogs = await p.locator('[role=dialog]').count();
  console.log('picker closed by Esc:', dialogs === 0);
  await p.screenshot({ path: D + '04-credits.png', fullPage: true });
  console.log('credits total:', await p.locator('aside .text-3xl').first().innerText());
  await p.goto(B + '/path'); await p.waitForTimeout(200);
  await p.click('text=찜한 학과로 초안'); await p.screenshot({ path: D + '05-path.png', fullPage: true });
  await p.goto(B + '/admission#calc'); await p.waitForTimeout(300);
  for (const [s, g] of [['공통국어1', '2'], ['공통수학1', '1']]) { await p.fill('input[aria-label="과목명"]', s); await p.selectOption('select[aria-label="등급"]', g); await p.click('#calc button:has-text("추가")'); }
  await p.fill('input[aria-label="석차"]', '21'); await p.fill('input[aria-label="수강자 수"]', '200');
  console.log('calc avg:', await p.locator('#calc .text-4xl').innerText(), '| rank text:', await p.locator('#calc p:has-text("상위")').innerText());
  await p.screenshot({ path: D + '06-calc.png' });
  await p.goto(B + '/portfolio'); await p.click('text=예시 불러오기'); await p.click('text=📄 제출용 보기'); await p.waitForTimeout(200);
  await p.screenshot({ path: D + '07-portfolio.png', fullPage: true });
  await p.goto(B + '/tests'); await p.click('button:has-text("탐구형(I)")'); await p.click('button:has-text("관습형(C)")');
  await p.goto(B + '/plan'); await p.locator('input[type=checkbox]').first().click();
  await p.goto(B); await p.waitForTimeout(300); await p.screenshot({ path: D + '08-home-hs.png', fullPage: true });
  console.log('hs progress:', (await p.innerText('main')).match(/진행 \d\/5/)?.[0]);
  await p.goto(B + '/report'); await p.waitForTimeout(300); await p.screenshot({ path: D + '09-report.png', fullPage: true });
  await p.click('text=공유 링크 복사'); await p.waitForTimeout(200);
  const url = await p.evaluate(() => navigator.clipboard.readText());
  const p3 = await (await b.newContext()).newPage(); watch(p3, 'share');
  await p3.goto(url); await p3.waitForTimeout(400);
  console.log('shared h1:', await p3.textContent('article h1'), '| url len', url.length);

  // ── 중학생 흐름 + 지도
  const c2 = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const m = await c2.newPage(); watch(m, 'ms');
  await m.goto(B); await m.click('text=중학생이에요');
  await m.goto(B + '/schools'); await m.waitForTimeout(1500);
  await m.selectOption('select[aria-label="내 중학교"]', { index: 30 });
  await m.click('button:has-text("마이스터고")'); await m.waitForTimeout(500);
  await m.locator('main ul li [role=button]').first().click(); await m.waitForTimeout(500);
  await m.locator('text=☆ 관심 학교 저장').click();
  await m.screenshot({ path: D + '10-schools.png' });
  console.log('schools list count:', await m.locator('main ul li [role=button]').count());
  await m.goto(B + '/highschool#gn'); await m.waitForTimeout(400); await m.screenshot({ path: D + '11-gn-admission.png', fullPage: true });
  await m.goto(B + '/subjects'); await m.click('text=🌳 과목 위계도'); await m.click('button:has-text("미적분Ⅰ")');
  await m.waitForSelector('[role=dialog]'); await m.screenshot({ path: D + '12-subject-modal.png' });
  await m.goto(B + '/search?q=' + encodeURIComponent('항공')); await m.waitForTimeout(300);
  console.log('search 항공:', (await m.innerText('main')).match(/검색 결과 \d+건/)?.[0]);
  await m.goto(B + '/industry'); await m.click('button:has-text("항공·우주")'); await m.screenshot({ path: D + '13-industry.png', fullPage: true });

  // ── 편제표 모드
  {
    const cp = await ctx.newPage(); watch(cp, 'curr');
    await cp.goto(B + '/credits/school'); await cp.waitForTimeout(300);
    await cp.click('text=예시 불러오기'); await cp.waitForTimeout(200);
    await cp.click('text=🔗 공유 링크 복사'); await cp.waitForTimeout(200);
    const share = await cp.evaluate(() => navigator.clipboard.readText());
    await cp.click('text=✅ 이 편제표로 설계하기'); await cp.waitForURL('**/credits');
    await cp.click('text=계열·학과 추천대로 선택군 채우기'); await cp.waitForTimeout(300);
    const counters = await cp.locator('fieldset legend').allInnerTexts();
    console.log('groups filled:', counters.filter((c) => /\((\d+)\/\1\)/.test(c)).length, '/', counters.length);
    // 꽉 찬 선택군에 하나 더 고르면 안내 문구
    const fs0 = cp.locator('fieldset').first();
    const free = fs0.locator('button[aria-pressed="false"]:not([disabled])').first();
    if (await free.count()) { await free.click(); console.log('cap message:', await cp.locator('[role=status]').first().innerText()); }
    console.log('curr total:', await cp.locator('aside .text-3xl').first().innerText());
    await cp.screenshot({ path: D + '17-curriculum.png', fullPage: true });
    const sp = await (await b.newContext()).newPage(); watch(sp, 'currshare');
    await sp.goto(share); await sp.waitForTimeout(400);
    console.log('shared curriculum banner:', (await sp.locator('text=공유받은 편제표').count()) > 0);
  }

  // ── 모든 페이지 모바일 점검
  const mc = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const mp = await mc.newPage(); watch(mp, 'mobile');
  await mp.goto(B); await mp.click('text=고등학생이에요');
  const routes = ['/', '/discover', '/jobs', '/jobs/shipbuilding', '/majors', '/majors/medicine', '/path', '/credits', '/credits/school', '/subjects', '/schools', '/highschool', '/admission', '/industry', '/tests', '/resources', '/guide', '/portfolio', '/plan', '/report', '/explore', '/tools', '/search?q=로봇', '/nope'];
  for (const r of routes) {
    const res = await mp.goto(B + r); await mp.waitForTimeout(r === '/schools' ? 1200 : 250);
    const ov = await mp.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (ov > 0) console.log('overflow', r, ov);
    if (res.status() >= 400 && r !== '/nope') console.log('status', r, res.status());
  }
  await mp.goto(B + '/credits'); await mp.screenshot({ path: D + '14-m-credits.png' });
  await mp.goto(B + '/schools'); await mp.waitForTimeout(1500); await mp.screenshot({ path: D + '15-m-schools.png' });
  await mp.goto(B + '/'); await mp.click('button[aria-label="전체 메뉴 열기"]'); await mp.screenshot({ path: D + '16-m-menu.png' });
  console.log('errors:', errs.length ? errs : 'none');
  await b.close();
})();
