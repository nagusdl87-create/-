import { notFound } from "next/navigation";
import { MAJORS, MAJOR_MAP } from "@/data/majors";
import { JOB_MAP } from "@/data/jobs";
import { majorVideoSet } from "@/data/videos";
import { MajorDetail } from "./MajorDetail";
import { MAJOR_DEEP } from "@/data/deep";
import { MAJOR_DEEP_EN } from "@/data/deep/majors-en";
import { cnMajor } from "@/data/careernet";

export function generateStaticParams() {
  return MAJORS.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: MAJOR_MAP[id]?.name ?? "학과", description: MAJOR_DEEP[id]?.intro ?? MAJOR_MAP[id]?.desc };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!MAJOR_MAP[id]) notFound();
  const m = MAJOR_MAP[id];
  // 화면 코드가 학과·직업 전체와 영상 목록을 싣지 않도록, 이 학과에 필요한 것만 여기서 골라 넘긴다
  const ctx = {
    major: m,
    similar: MAJORS.filter((x) => x.track === m.track && x.id !== m.id).slice(0, 6).map((x) => ({ id: x.id, name: x.name })),
    jobs: m.jobs.filter((j) => JOB_MAP[j]).map((j) => ({ id: j, name: JOB_MAP[j].name, emoji: JOB_MAP[j].emoji })),
    vset: majorVideoSet(m, MAJORS),
  };
  return <MajorDetail id={id} deep={MAJOR_DEEP[id]} deepEn={MAJOR_DEEP_EN[id]} cn={cnMajor(id)} ctx={ctx} />;
}
