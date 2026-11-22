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
  await p.goto(B + '/portfolio'); await p.click('text=예시 불러오기'); await p.click('text=제출용 보고서'); await p.waitForTimeout(200);
  await p.screenshot({ path: D + '07-portfolio.png', fullPage: true });
  await p.goto(B + '/tests'); await p.click('role=tab >> text=결과 연결하기'); await p.click('button:has-text("탐구형(I)")'); await p.click('button:has-text("관습형(C)")');
  await p.goto(B + '/plan'); await p.locator('input[type=checkbox]').first().click();
  await p.goto(B); await p.waitForTimeout(300); await p.screenshot({ path: D + '08-home-hs.png', fullPage: true });
  console.log('hs progress:', await p.locator('main svg[aria-label^="진행"]').first().getAttribute('aria-label'));
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
  await m.locator('main ul li button[aria-pressed]').first().click(); await m.waitForTimeout(500);
  await m.locator('text=☆ 관심 학교 저장').click();
  await m.screenshot({ path: D + '10-schools.png' });
  console.log('schools list count:', await m.locator('main ul li button[aria-pressed]').count());
  await m.goto(B + '/highschool#gn'); await m.waitForTimeout(400); await m.screenshot({ path: D + '11-gn-admission.png', fullPage: true });
  await m.goto(B + '/subjects'); await m.click('role=tab >> text=과목 위계도'); await m.click('button:has-text("미적분Ⅰ")');
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

  // ── 새 기능 점검
  {
    const np = await ctx.newPage(); watch(np, 'new');
    await np.goto(B + '/future'); await np.waitForTimeout(300);
    await np.locator('main .card button').filter({ hasText: '기계학습' }).click();
    console.log('future quiz feedback:', (await np.locator('text=💡').first().innerText()).slice(0, 30));
    await np.goto(B + '/guide#ch2'); await np.waitForTimeout(300);
    await np.click('role=tab >> text=3단계');
    console.log('guide step3:', await np.locator('article h3').first().innerText());
    await np.goto(B + '/subjects'); await np.click('role=tab >> text=내신 산출 방법');
    await np.fill('#ns-rank', '21'); console.log('naesin:', await np.locator('text=석차등급(5등급)').locator('..').innerText());
    await np.goto(B + '/portfolio'); await np.click('role=tab >> text=192학점 로드맵'); await np.click('text=예시 불러오기'); await np.click('role=tab >> text=3단계 · 192학점 설계');
    console.log('roadmap embeds planner:', await np.locator('text=교과(군)별 필수 이수 학점').count() > 0);
    await np.goto(B + '/'); await np.waitForTimeout(300); await np.fill('input[aria-label="통합 검색"] >> nth=-1', '항공');
    await np.waitForTimeout(200); console.log('live search:', await np.locator('[aria-label="통합 검색 결과"] button').first().innerText());
  }


  // ── 추가 기능 점검 (실패하면 errors에 기록)
  {
    const ck = (name, ok) => { console.log(name + ':', ok ? 'ok' : 'FAIL'); if (!ok) errs.push('check failed: ' + name); };
    const xc = await b.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true });
    const x = await xc.newPage(); watch(x, 'extra');
    // 직업 상세 콘텐츠(콘텐츠 기준)
    await x.goto(B + '/jobs/nurse'); await x.waitForTimeout(500);
    for (const h of ['이런 일을 해요', '하루는 이렇게 흘러가요', '필요한 지식과 능력', '고등학생이 되면 해 볼 활동', '일하는 환경', '학력·진로 경로', '기술이 바뀌면 이 일은?', '자주 묻는 질문']) ck('job section ' + h, await x.locator('main h2', { hasText: h }).count() > 0);
    // 영상: 썸네일 → 누르면 재생
    ck('video thumb before click', await x.locator('iframe').count() === 0 && await x.locator('button[aria-label^="영상 재생"]').count() === 1);
    await x.locator('button[aria-label^="영상 재생"]').click(); await x.waitForTimeout(400);
    ck('video plays after click', await x.locator('iframe[src*="autoplay=1"]').count() === 1);
    // FAQ 펼치기
    await x.locator('details summary').first().click(); ck('faq opens', await x.locator('details[open]').count() === 1);
    // 학과 상세 + 대학 권장과목 원문
    await x.goto(B + '/majors/architecture'); await x.waitForTimeout(500);
    for (const h of ['이런 질문을 탐구해요', '세부 전공 분야', '학년별로 이렇게 배워요', '이 학과에서 길러지는 능력', '고등학교에서 해 볼 탐구 주제']) ck('major section ' + h, await x.locator('main h2', { hasText: h }).count() > 0);
    ck('univ subject docs', await x.locator('text=대학이 발표한 2028학년도 권장과목 원문').count() === 1 && await x.locator('a[href*="yonsei.ac.kr"]').count() === 1);
    // 고교 분류(자율형 공립고 4, 대안 특성화고 4)
    await x.goto(B + '/schools'); await x.waitForTimeout(1200);
    ck('autonomous 4', (await x.locator('button:has-text("자율형 공립고")').first().innerText()).includes('4'));
    ck('alternative 4', (await x.locator('button:has-text("대안(체험위주)")').first().innerText()).includes('4'));
    // 화면 밝기 메뉴
    await x.goto(B + '/'); await x.locator('header button[aria-haspopup="menu"]').click();
    await x.locator('[role=menuitemradio]', { hasText: '어둡게' }).click();
    ck('dark mode on', await x.evaluate(() => document.documentElement.classList.contains('dark')));
    await x.locator('header button[aria-haspopup="menu"]').click(); await x.locator('[role=menuitemradio]', { hasText: '밝게' }).click();
    ck('light mode back', !(await x.evaluate(() => document.documentElement.classList.contains('dark'))));
    // 백업 파일 내려받기 → 지우기 → 올리기
    await x.evaluate(() => { const k = 'myroad:v1'; const s = JSON.parse(localStorage.getItem(k)); s.profile.name = '백업테스트'; localStorage.setItem(k, JSON.stringify(s)); });
    await x.goto(B + '/account'); await x.waitForTimeout(400);
    const [dl] = await Promise.all([x.waitForEvent('download'), x.click('text=백업 파일 내려받기')]);
    const bp = D + 'backup.json'; await dl.saveAs(bp); ck('backup filename', /^myroad-backup-\d{4}-\d{2}-\d{2}\.json$/.test(dl.suggestedFilename()));
    await x.evaluate(() => localStorage.removeItem('myroad:v1')); await x.reload(); await x.waitForTimeout(400);
    await x.setInputFiles('input[type=file]', bp); await x.click('button:has-text("불러오기")'); await x.waitForTimeout(300);
    ck('backup restored', await x.evaluate(() => JSON.parse(localStorage.getItem('myroad:v1')).profile.name === '백업테스트'));
    // 개인정보 처리 방침·로그인(선택) 화면
    await x.goto(B + '/privacy'); ck('privacy page', (await x.locator('article h2').count()) >= 10);
    await x.goto(B + '/account'); await x.waitForTimeout(400);
    const loginBtn = x.locator('button:has-text("구글 계정으로 로그인")');
    ck('login needs age check', await loginBtn.isDisabled());
    await xc.close();
  }


  // ── D6 선생님 모아 보기 · D7 상담용 한 장 요약
  {
    const ck = (name, ok) => { console.log(name + ':', ok ? 'ok' : 'FAIL'); if (!ok) errs.push('check failed: ' + name); };
    const tc = await b.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true });
    const t = await tc.newPage(); watch(t, 'teacher');
    const code = Buffer.from(JSON.stringify({ p: { name: '테스트', stage: 'ms', grade: '3', school: '', region: '', middle: '' }, a: {}, f: ['ai-engineer'] })).toString('base64url');
    await t.goto(B + '/teacher');
    await t.getByLabel('공유 링크 (한 줄에 하나)').fill(`${B}/report#d=${code}\nnot-a-link`);
    await t.getByRole('button', { name: '링크로 학생 추가' }).click(); await t.waitForTimeout(300);
    ck('teacher row added', await t.locator('tbody tr').count() === 1);
    const [csv] = await Promise.all([t.waitForEvent('download'), t.getByRole('button', { name: /CSV 내려받기/ }).click()]);
    ck('teacher csv', csv.suggestedFilename().endsWith('.csv'));
    ck('teacher no storage', await t.evaluate(() => sessionStorage.length === 0));
    // 상담용 한 장 요약: 빈 상태에서도 안내 문구 + A4 1쪽
    await t.goto(B + '/report/summary'); await t.waitForTimeout(400);
    ck('summary placeholder', await t.locator('text=흥미 탐색을 아직 하지 않았어요').count() > 0);
    const pdf = await t.pdf({ format: 'A4', preferCSSPageSize: true });
    const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
    ck('summary one page', pages === 1);
    // D4·D5: 나이스 자료가 있을 때만(CI 빌드에는 키가 있으면 생성)
    const subj = await (await t.request.get(B + '/data/neis/subjects.json')).json().catch(() => ({ schools: {} }));
    if (Object.keys(subj.schools || {}).length) {
      await t.goto(B + '/credits'); await t.waitForSelector('text=우리 학교 개설 과목으로 설계하기', { timeout: 8000 }).catch(() => {}); ck('school offer card', await t.locator('text=우리 학교 개설 과목으로 설계하기').count() > 0);
    } else console.log('school offer: skipped (no data)');
    await tc.close();
  }


  // ── 언어 전환(EN ↔ 한국어 버튼 하나)
  {
    const ck = (name, ok) => { console.log(name + ':', ok ? 'ok' : 'FAIL'); if (!ok) errs.push('check failed: ' + name); };
    const ec = await b.newContext({ viewport: { width: 390, height: 844 } }); const e = await ec.newPage(); watch(e, 'english');
    await e.goto(B + '/');
    await e.getByRole('button', { name: /^EN: view in English/ }).click();
    await e.waitForFunction(() => document.documentElement.lang === 'en' && /map of your own/.test(document.querySelector('h1')?.textContent || ''), null, { timeout: 8000 }).catch(() => {});
    ck('EN switch home', /map of your own/.test(await e.textContent('h1')));
    for (const [r, h] of [['/credits', /credit/i], ['/jobs/nurse', /^Nurse$/], ['/majors/naval', /Naval|Ship/i]]) {
      await e.goto(B + r); await e.waitForTimeout(1200);
      ck('EN page ' + r, h.test(((await e.textContent('h1')) || '').trim()));
    }
    await e.getByRole('button', { name: /^한국어: 한국어로 보기/ }).click();
    await e.waitForFunction(() => document.documentElement.lang === 'ko', null, { timeout: 5000 }).catch(() => {});
    ck('KO switch back', /[가-힣]/.test(await e.textContent('h1')));
    ck('EN no overflow', await e.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
    await ec.close();
  }


  // ── 중학교 정보
  {
    const ck = (name, ok) => { console.log(name + ':', ok ? 'ok' : 'FAIL'); if (!ok) errs.push('check failed: ' + name); };
    const mc2 = await b.newContext({ viewport: { width: 390, height: 844 } }); const mm = await mc2.newPage(); watch(mm, 'middle');
    await mm.goto(B + '/middle'); await mm.fill('#ms-q', '해성');
    ck('middle same-name schools', await mm.locator('button[aria-pressed]:has-text("해성중학교")').count() === 2);
    await mm.locator('button[aria-pressed]:has-text("해성중학교")').nth(1).click(); await mm.waitForTimeout(200);
    ck('middle detail', await mm.locator('h3', { hasText: '가까운 고등학교' }).count() === 1);
    await mm.click('text=내 중학교로 정하기');
    ck('middle set mine', await mm.evaluate(() => JSON.parse(localStorage.getItem('myroad:v1')).profile.middle === '해성중학교'));
    await mm.goto(B + '/schools'); ck('school tabs', await mm.locator('nav[aria-label="학교 종류"] a').count() === 2);
    await mc2.close();
  }

  // ── 모든 페이지 모바일 점검
  const mc = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const mp = await mc.newPage(); watch(mp, 'mobile');
  await mp.goto(B); await mp.click('text=고등학생이에요');
  const routes = ['/', '/discover', '/jobs', '/jobs/shipbuilding', '/majors', '/majors/medicine', '/path', '/credits', '/credits/school', '/subjects', '/schools', '/highschool', '/admission', '/industry', '/tests', '/resources', '/guide', '/future', '/transition', '/portfolio', '/plan', '/report', '/explore', '/tools', '/account', '/privacy', '/offline', '/teacher', '/report/summary', '/middle', '/search?q=로봇', '/nope'];
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
