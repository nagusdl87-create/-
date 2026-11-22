import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_DESC, SITE_NAME, SITE_URL } from "@/lib/site";
import { StoreProvider } from "@/lib/store";
import { CloudProvider } from "@/lib/cloud";
import { CloudConflict } from "@/components/Account";
import { Nav } from "@/components/Nav";
import { ScrollTop } from "@/components/ScrollTop";
import { OfflineSupport } from "@/components/Offline";
import { Footer } from "@/components/Footer";

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
          <CloudProvider>
          <Nav />
          <main id="main" className="mx-auto w-full max-w-6xl px-4 pb-28 pt-8 sm:pb-20 sm:pt-12">{children}</main>
          <Footer />
          <ScrollTop />
          <OfflineSupport />
          <CloudConflict />
          </CloudProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
