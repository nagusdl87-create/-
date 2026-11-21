import { notFound } from "next/navigation";
import { JOBS, JOB_MAP } from "@/data/jobs";
import { JobDetail } from "./JobDetail";

export function generateStaticParams() {
  return JOBS.map((j) => ({ id: j.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const j = JOB_MAP[id];
  return { title: j ? `${j.name} — 마이로드` : "마이로드" };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!JOB_MAP[id]) notFound();
  return <JobDetail id={id} />;
}
