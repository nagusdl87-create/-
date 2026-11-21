import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_DESC, SITE_NAME, SITE_URL } from "@/lib/site";
import { StoreProvider } from "@/lib/store";
import { Nav } from "@/components/Nav";
import { ScrollTop } from "@/components/ScrollTop";
import { CreditLine } from "@/components/Credit";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} — 중·고등학생 진로·학업 설계`, template: `%s — ${SITE_NAME}` },
  description: SITE_DESC,
  applicationName: SITE_NAME,
  authors: [{ name: "윤용현 (삼천포여자중학교)" }],
  creator: "윤용현",
  appleWebApp: { capable: true, title: "마이로드", statusBarStyle: "default" },
  icons: { apple: "/apple-touch-icon.png" },
  openGraph: { type: "website", locale: "ko_KR", siteName: SITE_NAME, title: `${SITE_NAME} — 진로·학업 설계`, description: SITE_DESC, images: [{ url: "/og.png", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#127a67" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <StoreProvider>
          <Nav />
          <main id="main" className="mx-auto w-full max-w-6xl px-4 pb-28 pt-8 sm:pb-20 sm:pt-12">{children}</main>
          <footer className="no-print mx-auto max-w-6xl space-y-1.5 border-t border-slate-200/80 px-4 pb-24 pt-6 text-xs leading-relaxed text-slate-500 sm:pb-10">
            <p>
              마이로드 경남은 진로 탐색을 돕는 참고용 서비스이며, 경상남도교육청의 공식 서비스가 아닙니다. 고교 정보는 경상남도교육청 고등학교
              입학포털·공공데이터포털·교육정보 개방포털(NEIS)의 공개 자료를 바탕으로 했고, 입학 전형과 교육과정은 바뀔 수 있으니 원서 접수 전 반드시 교육청과 학교의 공식 안내를 확인하세요.
            </p>
            <nav aria-label="공식 사이트" className="flex flex-wrap gap-x-4 gap-y-1 pb-2 text-slate-600">
              {[
                ["경상남도교육청", "https://www.gne.go.kr/"],
                ["경남 고입포털", "https://highschool.gne.go.kr/s10/hsa/user/main.do"],
                ["고교학점제", "https://www.hscredit.kr/"],
                ["커리어넷", "https://www.career.go.kr/"],
                ["꿈길", "https://www.ggoomgil.go.kr/"],
                ["고용24", "https://www.work24.go.kr/"],
                ["어디가", "https://www.adiga.kr/"],
              ].map(([n, u]) => (
                <a key={u} href={u} target="_blank" rel="noreferrer" className="hover:text-brand-700 hover:underline">
                  {n}
                </a>
              ))}
            </nav>
            <CreditLine className="text-slate-600" />
            <p>흥미 탐색 결과는 표준화된 심리검사가 아닙니다. 입력한 내용은 서버로 보내지 않고 이 기기의 브라우저에만 저장됩니다.</p>
          </footer>
          <ScrollTop />
        </StoreProvider>
      </body>
    </html>
  );
}
