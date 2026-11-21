import type { Config } from "tailwindcss";

// 디자인 토큰: 차분한 청록(브랜드) + 따뜻한 강조(sun) + 중립 회색(slate)
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefaf7",
          100: "#d5f2ea",
          200: "#ade3d5",
          300: "#79cdb9",
          400: "#40b199",
          500: "#1d967e",
          600: "#127a67",
          700: "#116254",
          800: "#124f45",
          900: "#0f3a34",
        },
        sun: { 100: "#fff3dc", 400: "#ffbe55", 500: "#f2a516" },
        coral: { 50: "#fff3ef", 100: "#ffe1d6", 400: "#ff8a65", 500: "#f4693f", 600: "#e0532a" },
        ink: { 800: "#14302c", 900: "#0c221f" },
        canvas: "#f7f6f2",
      },
      fontFamily: { sans: ["Pretendard Variable", "Pretendard", "Apple SD Gothic Neo", "Noto Sans KR", "system-ui", "sans-serif"] },
      borderRadius: { "4xl": "2rem" },
    },
  },
  plugins: [],
} satisfies Config;
