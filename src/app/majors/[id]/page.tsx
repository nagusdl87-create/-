import { notFound } from "next/navigation";
import { MAJORS, MAJOR_MAP } from "@/data/majors";
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
  return <MajorDetail id={id} deep={MAJOR_DEEP[id]} deepEn={MAJOR_DEEP_EN[id]} cn={cnMajor(id)} />;
}
