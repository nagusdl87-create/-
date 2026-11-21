import type { Metadata, Viewport } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "마이로드 — 중학생 진로·학업 설계",
  description: "나를 알고, 꿈을 찾고, 고등학교와 공부 계획까지 한 흐름으로 잇는 중학생 진로·학업 설계 플랫폼",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#1f63d8" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>
        <StoreProvider>
          <Nav />
          <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-6 sm:pb-16">{children}</main>
          <footer className="no-print mx-auto max-w-5xl px-4 pb-24 text-xs leading-relaxed text-slate-400 sm:pb-10">
            마이로드는 진로 탐색을 돕기 위한 참고용 서비스입니다. 흥미 탐색 결과는 표준화된 심리검사가 아니며, 고교 입학 전형과
            교육과정은 지역·학교마다 다르므로 반드시 교육청과 학교의 공식 안내를 확인하세요. 입력한 내용은 이 기기의 브라우저에만
            저장됩니다.
          </footer>
        </StoreProvider>
      </body>
    </html>
  );
}
