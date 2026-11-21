import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { JOBS } from "@/data/jobs";
import { MAJORS } from "@/data/majors";

export const dynamic = "force-static";

const PAGES = ["", "discover", "jobs", "majors", "subjects", "schools", "highschool", "admission", "industry", "credits", "credits/school", "path", "plan", "portfolio", "tests", "resources", "guide", "explore", "tools", "future", "transition"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...PAGES.map((p) => ({ url: `${SITE_URL}/${p}`, lastModified: now })),
    ...JOBS.map((j) => ({ url: `${SITE_URL}/jobs/${j.id}`, lastModified: now })),
    ...MAJORS.map((m) => ({ url: `${SITE_URL}/majors/${m.id}`, lastModified: now })),
  ];
}
