import type { Metadata, Viewport } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "마이로드 경남 — 중·고등학생 진로·학업 설계",
  description: "경남 중·고등학생을 위한 진로·학업 설계 플랫폼: 흥미 탐색부터 경남 고교 선택, 192학점 과목 설계, 2028 대입 준비까지",
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
          <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 sm:pb-16">{children}</main>
          <footer className="no-print mx-auto max-w-6xl space-y-1 px-4 pb-24 text-xs leading-relaxed text-slate-400 sm:pb-10">
            <p>
              마이로드 경남은 진로 탐색을 돕는 참고용 서비스이며, 경상남도교육청의 공식 서비스가 아닙니다. 고교 정보는 경상남도교육청 고등학교
              입학포털·공공데이터포털·교육정보 개방포털(NEIS)의 공개 자료를 바탕으로 했고, 입학 전형과 교육과정은 바뀔 수 있으니 원서 접수 전 반드시 교육청과 학교의 공식 안내를 확인하세요.
            </p>
            <p>흥미 탐색 결과는 표준화된 심리검사가 아닙니다. 입력한 내용은 서버로 보내지 않고 이 기기의 브라우저에만 저장됩니다.</p>
          </footer>
        </StoreProvider>
      </body>
    </html>
  );
}
