import type { Metadata } from "next";
import { PrivacyBody } from "./PrivacyBody";

export const metadata: Metadata = { title: "개인정보 처리 방침", description: "마이로드 경남의 개인정보 처리 방침. 로그인하지 않으면 개인정보를 받지 않아요." };

export default function PrivacyPage() {
  return <PrivacyBody />;
}
