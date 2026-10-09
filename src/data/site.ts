export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  photo?: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export const site = {
  name: "Kemal Office Studio",
  tagline: "Studio Web & Software Kustom Berperforma Tinggi",
  description:
    "Web app cepat, sistem operasional internal, dan dashboard data yang dibangun rapi dari PRD hingga production.",
  waNumber: process.env.NEXT_PUBLIC_WA_NUMBER ?? "",
  email: "kemalofficestudio@gmail.com",
  availability: {
    available: true,
    period: "Q4 2026",
    // Dipakai saat available = false: "Antrean Penuh · Buka Lagi [reopenMonth]"
    reopenMonth: "",
  },
  // Sumber: linktr.ee/kemalofficestudio. WhatsApp tidak di sini; pakai waNumber.
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/kemal_ofcs" },
    { label: "TikTok", href: "https://www.tiktok.com/@kemal_ofcs" },
    { label: "YouTube", href: "https://www.youtube.com/@KemalOfcs" },
    { label: "Threads", href: "https://www.threads.com/@kemal_ofcs" },
    { label: "Facebook", href: "https://www.facebook.com/share/18ZmcTjUPd/" },
  ],
  // PRD §5.6: hanya angka & testimoni nyata. Kosong = section tidak dirender.
  stats: [] as { label: string; value: string }[],
  testimonials: [] as Testimonial[],
  // PRD §5.7: minimal 5 pertanyaan sebelum rilis.
  faq: [] as Faq[],
};
