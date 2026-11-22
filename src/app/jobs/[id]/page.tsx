import { notFound } from "next/navigation";
import { JOBS, JOB_MAP } from "@/data/jobs";
import { JobDetail } from "./JobDetail";
import { JOB_DEEP } from "@/data/deep"; // 서버에서만 읽고 해당 직업 것만 넘김(전체를 화면 코드에 싣지 않음)

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
  return <JobDetail id={id} deep={JOB_DEEP[id]} />;
}
