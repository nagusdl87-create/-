// 커리어넷 공식 직업 페이지(마이로드 심화 직업과 이어지지 않은 직업). 서버에서 해당 직업 자료만 골라 넘긴다.
import { notFound } from "next/navigation";
import { CN_EXTRA_JOBS, CN_JOBS, cnJobBySeq, ourJobIdOf } from "@/data/careernet";
import { MAJORS } from "@/data/majors";
import { CnJobPage } from "@/components/CareerNetPage";

export function generateStaticParams() {
  return CN_EXTRA_JOBS.map((j) => ({ seq: String(j.seq) }));
}

export async function generateMetadata({ params }: { params: Promise<{ seq: string }> }) {
  const { seq } = await params;
  const j = CN_JOBS.find((x) => x.seq === +seq);
  return { title: j ? j.name : "직업", description: j?.work };
}

export default async function Page({ params }: { params: Promise<{ seq: string }> }) {
  const { seq } = await params;
  const item = CN_EXTRA_JOBS.find((x) => x.seq === +seq);
  const d = cnJobBySeq(+seq);
  if (!item || !d) notFound();
  // 같은 분야 다른 직업(최대 12개), 마이로드 학과 백과에 있는 관련 학과
  const same = CN_JOBS.filter((x) => x.field === item.field && x.seq !== item.seq).slice(0, 12)
    .map((x) => ({ name: x.name, href: ourJobIdOf(x.seq) ? `/jobs/${ourJobIdOf(x.seq)}` : `/jobs/cn/${x.seq}` }));
  const norm = (s: string) => s.replace(/\s|\(.*?\)/g, "");
  const ourMajors = MAJORS.filter((m) => d.majors.some((n) => norm(n) === norm(m.name))).map((m) => ({ id: m.id, name: m.name }));
  return <CnJobPage item={item} d={d} same={same} ourMajors={ourMajors} />;
}
