export type ProjectCategory = "web-app" | "sistem-internal" | "landing-page";

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  category: ProjectCategory;
  summary: string; // 1–2 kalimat untuk kartu & drawer
  challenge: string;
  solution: string;
  result: string;
  metrics: { label: string; value: string }[]; // hanya angka yang bisa dipertanggungjawabkan
  techStack: string[];
  cover: { src: string; alt: string };
  video?: { webm: string; mp4: string; poster: string };
  gallery: { src: string; alt: string }[];
  liveUrl?: string;
  featured: boolean;
  order: number;
  year: number;
}

export const categoryLabels: Record<ProjectCategory, string> = {
  "web-app": "Web App",
  "sistem-internal": "Sistem Internal",
  "landing-page": "Landing Page",
};

// PRD §5.3: rilis dengan 3–5 proyek.
export const projects: Project[] = [];
