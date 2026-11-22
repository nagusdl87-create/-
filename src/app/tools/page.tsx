import { HubList, PageHead } from "@/components/ui";

export const metadata = { title: "도구" };

export default function Page() {
  return (
    <div className="max-w-3xl">
      <PageHead tone="indigo" eyebrow="메뉴" title="도구" desc="과목 설계, 성적 계산, 포트폴리오 작성처럼 직접 써 보는 도구 모음이에요." />
      <HubList group="tools" />
    </div>
  );
}
