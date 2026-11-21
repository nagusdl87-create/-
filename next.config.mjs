/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Firebase Hosting(정적 호스팅) 배포용: `next build` 결과가 out/ 폴더에 정적 파일로 생성됩니다.
  output: "export",
  images: { unoptimized: true },
};
export default nextConfig;
