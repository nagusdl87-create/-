import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { 50: "#eef6ff", 100: "#d9eaff", 200: "#b6d6ff", 400: "#5b9dff", 500: "#2f7bf5", 600: "#1f63d8", 700: "#1b4fae", 900: "#132c5c" },
        sun: { 100: "#fff4d6", 400: "#ffc93c", 500: "#f5b000" },
      },
      fontFamily: { sans: ["Pretendard", "Apple SD Gothic Neo", "Noto Sans KR", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
} satisfies Config;
