import { notFound } from "next/navigation";
import { MAJORS, MAJOR_MAP } from "@/data/majors";
import { MajorDetail } from "./MajorDetail";

export function generateStaticParams() {
  return MAJORS.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: MAJOR_MAP[id]?.name ?? "학과", description: MAJOR_MAP[id]?.desc };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!MAJOR_MAP[id]) notFound();
  return <MajorDetail id={id} />;
}
