import type { MetadataRoute } from "next";
import { SITE_DESC, SITE_NAME } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — 진로·학업 설계`,
    short_name: "마이로드",
    description: SITE_DESC,
    start_url: "/",
    display: "standalone",
    background_color: "#f6f7f6",
    theme_color: "#127a67",
    lang: "ko",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
