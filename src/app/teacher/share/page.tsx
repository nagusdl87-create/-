import type { Metadata } from "next";
import { PageHead } from "@/components/ui";
import { TeacherShareMaker } from "@/components/TeacherShare";

export const metadata: Metadata = {
  title: "선생님께 공유 코드 만들기",
  description: "내가 고른 진로 기록만 담은 공유 코드를 이 기기에서 만들어 선생님께 건네요. 서버로는 아무것도 보내지 않아요.",
};

export default function TeacherSharePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHead
        tone="indigo"
        eyebrow="학생용"
        title="선생님께 공유 코드 만들기"
        desc="선생님과 진로 상담을 할 때 보여 주고 싶은 내용만 골라 코드로 만들어요. 이름과 연락처는 담기지 않고, 닉네임은 쓰고 싶을 때만 써요."
      />
      <TeacherShareMaker />
    </div>
  );
}
