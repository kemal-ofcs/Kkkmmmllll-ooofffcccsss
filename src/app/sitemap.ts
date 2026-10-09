import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const url = (path: string) => new URL(path, siteUrl).href;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: url("/"), priority: 1 },
    ...projects.map((p) => ({ url: url(`/proyek/${p.slug}`), priority: 0.8 })),
    { url: url("/kebijakan-privasi"), priority: 0.3 },
  ];
}
