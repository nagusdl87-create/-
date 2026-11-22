// 다크 모드용 색 변수 생성: node scripts/gen-theme.cjs → src/app/theme.css
// 원리: tailwind 색(slate·brand 등)을 CSS 변수로 바꾸고, .dark에서는 밝기 순서를 뒤집은 값을 넣는다.
// 흰 글씨를 올리는 진한 배경(bg-*-600~900)은 다크에서도 원래 색을 유지해 대비를 지킨다.
const fs = require("fs");
const colors = require("tailwindcss/colors");
const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const brand = { 50: "#eefaf7", 100: "#d5f2ea", 200: "#ade3d5", 300: "#79cdb9", 400: "#40b199", 500: "#1d967e", 600: "#127a67", 700: "#116254", 800: "#124f45", 900: "#0f3a34", 950: "#0a2622" };
const coral = { 50: "#fff3ef", 100: "#ffe1d6", 200: "#ffc4ae", 300: "#ffa483", 400: "#ff8a65", 500: "#f4693f", 600: "#e0532a", 700: "#b93d18", 800: "#8f2f13", 900: "#6b230e", 950: "#3d1408" };
const sun = { 50: "#fffaf0", 100: "#fff3dc", 200: "#ffe4b0", 300: "#ffd17f", 400: "#ffbe55", 500: "#f2a516", 600: "#c9860c", 700: "#9c650a", 800: "#734b0a", 900: "#4f3408", 950: "#2c1d05" };
const slate = { ...colors.slate, 400: "#606d80", 500: "#5b6679" };
const slateDark = { 50: "#18221f", 100: "#1f2a28", 200: "#2b3735", 300: "#3c4947", 400: "#8b97a6", 500: "#9aa6b4", 600: "#b4bec9", 700: "#cdd5de", 800: "#e2e8f0", 900: "#f1f5f9", 950: "#f8fafc" };
const FAM = { slate, brand, coral, sun, amber: colors.amber, rose: colors.rose, emerald: colors.emerald, sky: colors.sky, violet: colors.violet, indigo: colors.indigo, lime: colors.lime };
const rgb = (h) => { h = h.replace("#", ""); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(" "); };
const flip = { 50: 950, 100: 900, 200: 800, 300: 700, 400: 500, 500: 400, 600: 400, 700: 300, 800: 200, 900: 100, 950: 50 };

let light = ":root {\n  --c-canvas: " + rgb("#f7f6f2") + ";\n  --c-surface: 255 255 255;\n";
let dark = ".dark {\n  color-scheme: dark;\n  --c-canvas: " + rgb("#0e1614") + ";\n  --c-surface: " + rgb("#151f1d") + ";\n";
for (const [f, sc] of Object.entries(FAM)) {
  for (const s of SHADES) {
    light += `  --c-${f}-${s}: ${rgb(sc[s])};\n`;
    const d = f === "slate" ? slateDark[s] : sc[flip[s]];
    dark += `  --c-${f}-${s}: ${rgb(d)};\n`;
  }
}
light += "}\n";
dark += "}\n";

// 흰 글씨용 진한 배경은 원래 색 유지
let keep = "";
for (const [f, sc] of Object.entries(FAM)) {
  if (f === "slate") continue;
  for (const s of [600, 700, 800, 900]) {
    keep += `.dark .bg-${f}-${s} { background-color: rgb(${rgb(sc[s])} / var(--tw-bg-opacity, 1)); }\n`;
    keep += `.dark .hover\\:bg-${f}-${s}:hover { background-color: rgb(${rgb(sc[s])} / var(--tw-bg-opacity, 1)); }\n`;
  }
}
for (const s of [500, 600, 700, 800, 900]) keep += `.dark .bg-slate-${s} { background-color: rgb(${rgb(slate[s])} / var(--tw-bg-opacity, 1)); }\n`;

const extra = `
/* 흰 배경(카드 등) → 어두운 면 */
.dark .bg-white, .dark .hover\\:bg-white:hover, .dark .focus\\:bg-white:focus { background-color: rgb(var(--c-surface) / var(--tw-bg-opacity, 1)); }
.dark .bg-white\\/95 { background-color: rgb(var(--c-surface) / 0.95); }
.dark .bg-white\\/80 { background-color: rgb(var(--c-surface) / 0.8); }
.dark .bg-white\\/70 { background-color: rgb(var(--c-surface) / 0.7); }
.dark .bg-white\\/60 { background-color: rgb(var(--c-surface) / 0.6); }
.dark .via-white { --tw-gradient-to: rgb(var(--c-surface) / 0) var(--tw-gradient-to-position); --tw-gradient-stops: var(--tw-gradient-from), rgb(var(--c-surface)) var(--tw-gradient-via-position), var(--tw-gradient-to); }
/* 지도·영상·그림은 그대로 */
.dark img, .dark video, .dark iframe { color-scheme: normal; }
`;
// 원래 어두운 영역(푸터·숫자 띠 등 bg-ink)은 밝은 모드 색 그대로(그 안의 밝은 글씨 유지)
const inkKeep = light.replace(":root {", ".dark .bg-ink-900, .dark .bg-ink-800 {");
const print = "@media print {\n" + light.replace(":root {", ".dark {") + "}\n";
fs.writeFileSync("src/app/theme.css", "/* 생성 파일: scripts/gen-theme.cjs */\n" + light + dark + keep + extra + inkKeep + print);
console.log("theme.css written");
