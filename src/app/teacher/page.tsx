import { PageHead } from "@/components/ui";
import { TeacherBoard } from "@/components/TeacherBoard";
import { ShareLink } from "@/components/TeacherShare";
import { StaffPanel } from "@/components/StaffPanel";

export default function TeacherPage() {
  return (
    <div>
      <div className="no-print">
        <PageHead
          tone="indigo"
          eyebrow="선생님용"
          title="선생님 모아 보기"
          desc="학생들이 보낸 공유 코드·링크나 파일을 모아 학급의 흥미 유형, 관심 직업·학과, 진행 단계, 학점 설계 현황을 한 표로 볼 수 있어요."
        />
        <ShareLink />
      </div>
      <StaffPanel />
      <div data-print-hide className="mt-6">
        <TeacherBoard />
      </div>
    </div>
  );
}
