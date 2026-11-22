import type { Metadata } from "next";
import { PageHead } from "@/components/ui";
import { AccountPanel } from "@/components/Account";

export const metadata: Metadata = { title: "내 계정", description: "선택 기능: 구글 로그인으로 여러 기기에서 진로 기록을 이어 써요.", robots: { index: false } };

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <PageHead tone="sky" eyebrow="내 계정" title="로그인과 동기화" desc="로그인은 선택이에요. 학교와 집처럼 여러 기기에서 같은 기록을 이어 쓰고 싶을 때만 써 주세요." />
      <AccountPanel />
    </div>
  );
}
