import type { Metadata } from "next";
import { PageHead } from "@/components/ui";
import { AccountPanel } from "@/components/Account";
import { BackupPanel } from "@/components/Backup";

export const metadata: Metadata = { title: "내 기록 백업", description: "로그인 없이 백업 파일을 내려받고 올려서 진로 기록을 이어 써요." };

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHead tone="sky" eyebrow="내 기록" title="기록 저장하고 이어 쓰기" desc="로그인하지 않아도 모든 기능을 쓸 수 있어요. 오늘 쓴 기록은 백업 파일로 내려받고, 다음에 그 파일을 올리면 이어서 할 수 있어요." />
      <div className="space-y-4">
        <BackupPanel />
        <AccountPanel />
      </div>
    </div>
  );
}
