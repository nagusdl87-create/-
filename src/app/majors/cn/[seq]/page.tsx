// 커리어넷 공식 학과 페이지(마이로드 심화 학과와 이어지지 않은 학과)
import { notFound } from "next/navigation";
import { CN_EXTRA_MAJORS, CN_MAJORS, cnMajorBySeq, ourMajorIdOf } from "@/data/careernet";
import { CnMajorPage } from "@/components/CareerNetPage";

export function generateStaticParams() {
  return CN_EXTRA_MAJORS.map((m) => ({ seq: String(m.seq) }));
}

export async function generateMetadata({ params }: { params: Promise<{ seq: string }> }) {
  const { seq } = await params;
  const m = CN_MAJORS.find((x) => x.seq === +seq);
  return { title: m ? m.name : "학과", description: m ? `${m.name}(${m.field}) — 커리어넷 학과정보` : undefined };
}

export default async function Page({ params }: { params: Promise<{ seq: string }> }) {
  const { seq } = await params;
  const item = CN_EXTRA_MAJORS.find((x) => x.seq === +seq);
  const d = cnMajorBySeq(+seq);
  if (!item || !d) notFound();
  const same = CN_MAJORS.filter((x) => x.field === item.field && x.seq !== item.seq).slice(0, 12)
    .map((x) => ({ name: x.name, href: ourMajorIdOf(x.seq) ? `/majors/${ourMajorIdOf(x.seq)}` : `/majors/cn/${x.seq}` }));
  return <CnMajorPage item={item} d={d} same={same} />;
}
