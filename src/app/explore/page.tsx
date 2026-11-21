import { EXPLORE } from "@/lib/journey";
import { HubList, PageHead } from "@/components/ui";

export const metadata = { title: "탐색 백과" };

export default function Page() {
  return (
    <div className="max-w-3xl">
      <PageHead tone="sky" eyebrow="메뉴" title="탐색 백과" desc="직업, 학과, 과목, 경남 고교, 대입 정보를 서로 연결해서 찾아볼 수 있어요." />
      <HubList items={EXPLORE} />
    </div>
  );
}
