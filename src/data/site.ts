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
  tagline: "Studio Web & Software Kustom",
  description:
    "Web app, sistem operasional internal, dan dashboard data yang dibangun rapi, dari perencanaan hingga rilis.",
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
  // PRD §5.2. `example` menautkan ke proyek nyata sebagai bukti.
  services: [
    {
      title: "Web App & Landing Page",
      description:
        "Landing page untuk menjaring prospek dan web app untuk produk digital Anda, disusun agar mudah ditemukan di Google dan nyaman dibuka di HP.",
      tags: ["Next.js", "SEO", "Responsif"],
      example: { label: "Situs PMB Manajemen Sekolah", slug: "manajemen-sekolah" },
    },
    {
      title: "Sistem Manajemen Bisnis Kustom",
      description:
        "Dashboard internal, absensi dan penggajian, serta alur data otomatis yang menggantikan spreadsheet yang tersebar.",
      tags: ["Dashboard", "Hak akses per peran", "Ekspor laporan"],
      example: { label: "MaklonOS", slug: "maklonos" },
    },
    {
      title: "Multiplatform & Database Modern",
      description:
        "Satu aplikasi untuk Web, Desktop, dan Android, dengan data yang tetap bisa dipakai saat internet putus.",
      tags: ["Web · Desktop · Android", "Tetap jalan offline", "Sinkron otomatis"],
      example: { label: "Absensi & Penggajian", slug: "absensi-penggajian" },
    },
  ],
  // PRD §5.4. `visual` memilih ilustrasi CSS di Process.tsx.
  process: [
    {
      title: "Discovery & PRD",
      description:
        "Kami memetakan kebutuhan, alur pengguna, dan struktur data bersama Anda, lalu menuliskannya dalam PRD (dokumen kebutuhan) yang disepakati.",
      visual: "document",
    },
    {
      title: "UI/UX & Prototipe",
      description:
        "Antarmuka fungsional dirancang dari alur yang sudah disepakati, dan Anda tinjau sebelum kode ditulis.",
      visual: "wireframe",
    },
    {
      title: "Pengembangan Iteratif",
      description:
        "Fitur dikerjakan per modul dengan preview berkala, jadi kemajuan terlihat tanpa menunggu akhir proyek.",
      visual: "checklist",
    },
    {
      title: "Deploy & Serah Terima",
      description:
        "Aplikasi dirilis ke production, lalu dokumentasi, repositori kode, dan domain diserahkan kepada Anda.",
      visual: "grid",
    },
  ] as const,
  // PRD §5.7. Jawaban hanya dari ketentuan PRD (§5.5.E, §5.5.F, §7) dan opsi timeline kalkulator.
  faq: [
    {
      question: "Berapa lama proyek dikerjakan?",
      answer:
        "Timeline standar 3–4 minggu, atau 1–2 minggu dengan Priority Sprint (biaya × 1,25). Durasi pastinya kami tetapkan bersama setelah sesi discovery, sesuai ruang lingkup.",
    },
    {
      question: "Apa yang perlu saya siapkan sebelum mulai?",
      answer:
        "Ceritakan masalah yang ingin diselesaikan, alur kerja yang berjalan sekarang, dan contoh data atau dokumen yang dipakai, misalnya spreadsheet. Sisanya kami susun bersama di sesi discovery menjadi PRD (dokumen kebutuhan).",
    },
    {
      question: "Bagaimana cara pembayarannya?",
      answer:
        "Dua termin: DP 50% sebelum perancangan antarmuka dan arsitektur dimulai, lalu pelunasan 50% setelah versi uji (staging) Anda tinjau dan siap diserahterimakan.",
    },
    {
      question: "Apakah ada garansi?",
      answer:
        "Ada. Garansi bebas bug selama 30 hari kalender setelah serah terima, untuk galat yang berasal dari ruang lingkup yang disepakati.",
    },
    {
      question: "Siapa pemilik kode dan domainnya?",
      answer:
        "Anda. Setelah pelunasan, repositori kode dan domain diserahkan sepenuhnya kepada Anda.",
    },
    {
      question: "Bagaimana jika saya ingin menambah fitur di tengah proyek?",
      answer:
        "Perubahan di luar ruang lingkup PRD dicatat sebagai permintaan perubahan (change request), dengan biaya dan jadwal terpisah yang kami sepakati sebelum dikerjakan.",
    },
    {
      question: "Apakah angka di kalkulator sudah harga final?",
      answer:
        "Belum. Angka kalkulator adalah estimasi awal; harga akhir ditetapkan setelah sesi discovery.",
    },
  ] as Faq[],
};
