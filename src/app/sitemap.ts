import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { JOBS } from "@/data/jobs";
import { MAJORS } from "@/data/majors";
import { CN_EXTRA_JOBS, CN_EXTRA_MAJORS } from "@/data/careernet";

export const dynamic = "force-static";

const PAGES = ["", "discover", "jobs", "majors", "subjects", "schools", "highschool", "admission", "industry", "credits", "credits/school", "path", "plan", "portfolio", "tests", "resources", "guide", "explore", "tools", "future", "transition", "account", "privacy", "middle"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...PAGES.map((p) => ({ url: `${SITE_URL}/${p}`, lastModified: now })),
    ...JOBS.map((j) => ({ url: `${SITE_URL}/jobs/${j.id}`, lastModified: now })),
    ...MAJORS.map((m) => ({ url: `${SITE_URL}/majors/${m.id}`, lastModified: now })),
    ...CN_EXTRA_JOBS.map((j) => ({ url: `${SITE_URL}/jobs/cn/${j.seq}`, lastModified: now })),
    ...CN_EXTRA_MAJORS.map((m) => ({ url: `${SITE_URL}/majors/cn/${m.seq}`, lastModified: now })),
  ];
}
