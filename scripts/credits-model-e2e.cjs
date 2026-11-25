const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 900 } });
  const errs = [];
  p.on("pageerror", (e) => errs.push(e.message));
  p.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource|tile\.openstreetmap/.test(m.text())) errs.push(m.text()); });
  p.on("dialog", (d) => d.accept());
  await p.goto((process.env.BASE || "http://localhost:5000") + "/credits", { waitUntil: "networkidle" });
  await p.evaluate(() => localStorage.setItem("myroad:v1", JSON.stringify({ version: 2, profile: { name: "테스트", school: "", grade: "중3", stage: "hs", region: "", middle: "" } })));
  await p.reload({ waitUntil: "networkidle" });
  const txt = async () => (await p.locator("body").innerText());
  let t = await txt();
  console.log("빈 상태 먼저 고칠 것:", /먼저 이것부터 고쳐요/.test(t), /1학년 공통과목 채우기/.test(t));
  // 검색 → 간호학과
  await p.getByPlaceholder(/학과·직업 이름으로 찾기/).fill("간호");
  await p.getByRole("button", { name: /간호과|간호학과/ }).first().click();
  t = await txt();
  console.log("모범안 표시:", /모범안/.test(t), /핵심 과목이에요/.test(t));
  await p.screenshot({ path: require("os").tmpdir() + "/model1.png", fullPage: true });
  await p.getByRole("button", { name: "모범안을 내 설계로 가져오기" }).click();
  t = await txt();
  const m = t.match(/(\d+)\s*\/\s*192/);
  console.log("가져온 뒤 총학점:", m && m[0], "큰 문제 없음:", /큰 문제는 없어요/.test(t));
  // 일부 과목 빼서 고치기 동작 확인
  const storage = await p.evaluate(() => JSON.parse(localStorage.getItem("myroad:v1")));
  console.log("저장된 목표:", JSON.stringify(storage.credits.goal), "계열:", storage.credits.track);
  storage.credits.plan["2-2"] = [];
  storage.credits.plan["3-1"] = storage.credits.plan["3-1"].filter((e) => !/체육|스포츠|운동/.test(e));
  await p.evaluate((s) => localStorage.setItem("myroad:v1", JSON.stringify(s)), storage);
  await p.reload({ waitUntil: "networkidle" });
  t = await txt();
  console.log("고칠 것 표시:", /먼저 이것부터 고쳐요/.test(t), (t.match(/부족한 학점 채우기|필수 학점 채우기|체육 과목 넣기/g) || []).join("|"));
  await p.getByRole("button", { name: "부족한 학점 채우기" }).click();
  t = await txt();
  console.log("채운 뒤:", (t.match(/(\d+)\s*\/\s*192/) || [])[0], "큰 문제 없음:", /큰 문제는 없어요/.test(t));
  // 직업 목표
  await p.getByLabel("목표 지우기").click();
  await p.getByPlaceholder(/학과·직업 이름으로 찾기/).fill("소프트웨어 개발자");
  await p.getByRole("button", { name: /소프트웨어 개발자/ }).first().click();
  t = await txt();
  console.log("직업 목표 모범안:", /소프트웨어 개발자 모범안/.test(t));
  // 320px 넘침
  await p.setViewportSize({ width: 320, height: 800 });
  const o = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  console.log("320px", o.sw, o.cw);
  console.log("errors:", errs.length ? errs : "none");
  await b.close();
})();
