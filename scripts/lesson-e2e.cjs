const { chromium } = require("playwright");
(async () => {
  const B = process.env.BASE || "http://localhost:5000";
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 900 } });
  const errs = [];
  p.on("pageerror", (e) => errs.push(e.message));
  await p.goto(B + "/teacher/lesson", { waitUntil: "networkidle" });
  let t = await p.locator("body").innerText();
  console.log("수업 흐름 1차시:", /나를 알고 진로 가설 세우기/.test(t), /합계 45분/.test(t));
  for (const n of [2, 3]) {
    await p.getByRole("button", { name: n + "차시" }).click();
    t = await p.locator("body").innerText();
    console.log(n + "차시 합계 45분:", /합계 45분/.test(t));
  }
  await p.getByRole("tab", { name: "학생 활동지" }).click();
  t = await p.locator("body").innerText();
  console.log("활동지 3장:", (t.match(/활동지 [123] ·/g) || []).length);
  await p.emulateMedia({ media: "print" });
  const pdf = await p.pdf({ format: "A4" });
  console.log("활동지 인쇄 PDF 바이트:", pdf.length > 5000);
  await p.emulateMedia({ media: "screen" });
  await p.getByRole("tab", { name: /교사 준비/ }).click();
  t = await p.locator("body").innerText();
  console.log("교사 준비:", /공유 링크 복사/.test(t));
  await p.goto(B + "/teacher", { waitUntil: "networkidle" });
  console.log("교사 화면 링크:", await p.getByRole("link", { name: /진로 시간 수업 꾸러미/ }).isVisible());
  await p.setViewportSize({ width: 320, height: 800 });
  for (const path of ["/teacher/lesson", "/teacher"]) {
    await p.goto(B + path, { waitUntil: "networkidle" });
    const o = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
    console.log("320px", path, o.sw <= o.cw + 1 ? "ok" : "넘침 " + o.sw);
  }
  console.log("errors:", errs.length ? errs : "none");
  await b.close();
})();
