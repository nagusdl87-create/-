import { notFound } from "next/navigation";
import { JOBS, JOB_MAP } from "@/data/jobs";
import { MAJORS } from "@/data/majors";
import { jobVideos, jobRelatedVideos } from "@/data/videos";
import { JobDetail } from "./JobDetail";
import { JOB_DEEP } from "@/data/deep"; // 서버에서만 읽고 해당 직업 것만 넘김(전체를 화면 코드에 싣지 않음)
import { JOB_DEEP_EN } from "@/data/deep/jobs-en"; // 영어판도 서버에서 해당 직업 것만 골라 넘김
import { cnJob } from "@/data/careernet"; // 커리어넷 공식 정보도 해당 직업 것만

export function generateStaticParams() {
  return JOBS.map((j) => ({ id: j.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const j = JOB_MAP[id];
  return { title: j ? j.name : "직업", description: JOB_DEEP[id]?.intro ?? j?.summary };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!JOB_MAP[id]) notFound();
  const ko = JOB_MAP[id];
  // 화면 코드가 직업·학과 전체와 영상 목록을 싣지 않도록, 이 직업에 필요한 것만 여기서 골라 넘긴다
  const ctx = {
    job: ko,
    majors: MAJORS.filter((m) => m.jobs.includes(id)).map((m) => ({ id: m.id, name: m.name })),
    similar: JOBS.filter((j) => j.id !== id && (j.field === ko.field || j.riasec[0] === ko.riasec[0])).slice(0, 4).map((j) => ({ id: j.id, name: j.name, emoji: j.emoji })),
    videos: jobVideos(id),
    related: jobRelatedVideos(id),
  };
  return <JobDetail id={id} deep={JOB_DEEP[id]} deepEn={JOB_DEEP_EN[id]} cn={cnJob(id)} ctx={ctx} />;
}
