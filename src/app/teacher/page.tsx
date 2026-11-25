import { PageHead } from "@/components/ui";
import { TeacherBoard } from "@/components/TeacherBoard";
import { ShareLink } from "@/components/TeacherShare";
import { StaffPanel } from "@/components/StaffPanel";
import Link from "next/link";

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
        <Link href="/teacher/lesson" className="card mt-4 flex flex-wrap items-center justify-between gap-3 border-indigo-200 bg-indigo-50/60 hover:border-indigo-300">
          <span>
            <b className="block text-sm">진로 시간 수업 꾸러미</b>
            <span className="text-xs text-slate-600">45분 수업 3차시 · 학생 활동지(인쇄) · 우리 학교 편제표 나눠 주는 방법</span>
          </span>
          <span className="text-sm font-semibold text-indigo-700">열어 보기 →</span>
        </Link>
      </div>
      <StaffPanel />
      <div data-print-hide className="mt-6">
        <TeacherBoard />
      </div>
    </div>
  );
}
