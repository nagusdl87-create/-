import type { Config } from "tailwindcss";
// 다크 모드: html에 class="dark"
const FAMILIES = ["slate", "brand", "coral", "sun", "amber", "rose", "emerald", "sky", "violet", "indigo", "lime"] as const;
const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const scale = (f: string) => Object.fromEntries(SHADES.map((n) => [n, `rgb(var(--c-${f}-${n}) / <alpha-value>)`]));

// 디자인 토큰: 차분한 청록(브랜드) + 따뜻한 강조(sun) + 중립 회색(slate)
export default {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // 색은 CSS 변수(src/app/theme.css, scripts/gen-theme.cjs로 생성)로 연결 → 다크 모드에서 자동으로 바뀜
      colors: {
        ...Object.fromEntries(FAMILIES.map((f) => [f, scale(f)])),
        ink: { 800: "#14302c", 900: "#0c221f" },
        canvas: "rgb(var(--c-canvas) / <alpha-value>)",
        surface: "rgb(var(--c-surface) / <alpha-value>)",
        accent: { DEFAULT: "#127a67", hover: "#116254" }, // 흰 글씨를 올리는 버튼 색(다크에서도 그대로)
      },
      fontFamily: { sans: ["Pretendard Variable", "Pretendard", "Apple SD Gothic Neo", "Noto Sans KR", "system-ui", "sans-serif"] },
      borderRadius: { "4xl": "2rem" },
    },
  },
  plugins: [],
} satisfies Config;
