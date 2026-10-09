import type { StaticImageData } from "next/image";
import absensiCover from "@/media/absensi-penggajian/cover.webp";
import absensi1 from "@/media/absensi-penggajian/galeri-1.webp";
import absensi2 from "@/media/absensi-penggajian/galeri-2.webp";
import absensi3 from "@/media/absensi-penggajian/galeri-3.webp";
import absensi4 from "@/media/absensi-penggajian/galeri-4.webp";
import maklonCover from "@/media/maklonos/cover.webp";
import maklon1 from "@/media/maklonos/galeri-1.webp";
import maklon2 from "@/media/maklonos/galeri-2.webp";
import maklon3 from "@/media/maklonos/galeri-3.webp";
import sekolahCover from "@/media/manajemen-sekolah/cover.webp";
import sekolah1 from "@/media/manajemen-sekolah/galeri-1.webp";
import sekolah2 from "@/media/manajemen-sekolah/galeri-2.webp";
import sekolah3 from "@/media/manajemen-sekolah/galeri-3.webp";
import sekolah4 from "@/media/manajemen-sekolah/galeri-4.webp";

export type ProjectCategory = "web-app" | "sistem-internal" | "landing-page";

// Gambar di src/media/<slug>/ dan di-import statis: ukuran & placeholder blur otomatis.
export interface Media {
  src: StaticImageData;
  alt: string;
}

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
  cover: Media;
  video?: { webm: string; mp4: string; poster: string };
  gallery: Media[];
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
// DRAF 2026-10-09: disusun dari PRD lokal & versi live. `result` dan `metrics` masih menunggu
// angka dampak nyata dari pemilik; yang ada sekarang hanya fakta yang bisa dicek.
// Screenshot dari demo live 2026-10-09, tanpa halaman yang memuat nama, kontak, atau foto orang.
export const projects: Project[] = [
  {
    slug: "manajemen-sekolah",
    title: "Manajemen Sekolah",
    tagline: "Absensi, akademik, sarpras, penggajian, dan situs PMB dalam satu aplikasi",
    category: "sistem-internal",
    summary:
      "Sistem operasional sekolah yang berjalan di Web, Desktop, dan Android, tetap bisa dipakai saat internet putus.",
    challenge:
      "Sekolah mengelola kehadiran guru dan siswa, nilai, inventaris, UKS, gaji, dan pendaftaran siswa baru di aplikasi dan spreadsheet yang terpisah. Koneksi internet di sekolah juga tidak selalu stabil.",
    solution:
      "Kami membangun satu aplikasi offline-first dengan database lokal yang tersinkron dua arah ke cloud. Modulnya mencakup absensi QR, presensi kelas, jurnal mengajar, leger dan nilai, bimbingan konseling, inventaris, UKS, penggajian, notifikasi WhatsApp, serta CMS untuk situs publik dan pendaftaran siswa baru (PMB). Hak akses diatur per peran, login mendukung 2FA.",
    result:
      "Satu basis kode berjalan di Web, Desktop (Windows/macOS/Linux), dan Android, dengan situs PMB publik yang kontennya dikelola langsung dari aplikasi.",
    metrics: [
      { label: "Platform dari satu basis kode", value: "3" },
      { label: "Halaman kerja", value: "29" },
    ],
    techStack: ["Next.js", "Tauri v2", "Rust", "SQLite", "Turso", "TypeScript"],
    cover: {
      src: sekolahCover,
      alt: "Beranda Manajemen Sekolah dengan ringkasan kehadiran hari ini dan pintasan modul",
    },
    gallery: [
      { src: sekolah1, alt: "Dashboard rekap kehadiran dengan grafik tren tujuh hari" },
      { src: sekolah2, alt: "Struktur akademik: tahun ajaran, semester, dan jadwal mengajar" },
      { src: sekolah3, alt: "Terminal absensi QR dengan kamera dan riwayat scan real-time" },
      { src: sekolah4, alt: "Situs publik PMB yang kontennya dikelola dari aplikasi" },
    ],
    liveUrl: "https://page-sch-kos.vercel.app",
    featured: true,
    order: 1,
    year: 2026,
  },
  {
    slug: "absensi-penggajian",
    title: "Absensi & Penggajian Perusahaan",
    tagline: "Absensi QR, shift, dan payroll lengkap dengan PPh 21 dan BPJS",
    category: "sistem-internal",
    summary:
      "Absensi karyawan berbasis QR dan geofence yang langsung mengalir ke perhitungan gaji, lembur, PPh 21, dan BPJS.",
    challenge:
      "Rekap kehadiran dan gaji dihitung manual setiap periode: jam lembur, keterlambatan, potongan PPh 21, dan BPJS dicocokkan satu per satu, sehingga rawan salah dan memakan waktu.",
    solution:
      "Karyawan absen dengan memindai kartu QR terenkripsi di dalam radius kantor. Sistem mengatur shift (termasuk shift malam lintas hari), kalender libur, dan koreksi kehadiran dengan jejak audit. Payroll menghitung upah lembur berjenjang sesuai PP 35/2021, PPh 21 metode TER, serta BPJS Kesehatan dan Ketenagakerjaan, lalu mencetak slip dan ID card CR80.",
    result:
      "Rekap kehadiran sampai estimasi take home pay tersedia dari data yang sama, di Web, Desktop, dan Android.",
    metrics: [{ label: "Platform dari satu basis kode", value: "3" }],
    techStack: ["Next.js", "Tauri v2", "Rust", "SQLite", "Turso", "TypeScript"],
    cover: {
      src: absensiCover,
      alt: "Beranda absensi dengan ringkasan kehadiran karyawan hari ini",
    },
    gallery: [
      {
        src: absensi1,
        alt: "Pengaturan shift kerja dengan toleransi keterlambatan dan shift malam",
      },
      { src: absensi2, alt: "Dashboard rekapitulasi absensi dengan tren tujuh hari" },
      { src: absensi3, alt: "Kalender hari libur nasional dan cuti bersama" },
      { src: absensi4, alt: "Terminal absensi QR" },
    ],
    featured: false,
    order: 2,
    year: 2026,
  },
  {
    // Nama produk belum final (lihat catatan di chat 2026-10-09).
    slug: "maklonos",
    title: "MaklonOS",
    tagline: "Sistem operasi perusahaan maklon, dari lead sampai barang terkirim",
    category: "sistem-internal",
    summary:
      "Menggantikan belasan Google Sheets dan Form di perusahaan maklon dengan satu alur kerja untuk sembilan divisi.",
    challenge:
      "Perusahaan maklon kosmetik dan pangan menjalankan seluruh siklus order di belasan spreadsheet: satu sheet per CS, salinan database klien 43 kolom, antrean sampel RnD, antrean desain, dan data uang masuk. Klien yang sama diketik ulang di banyak tempat, urutan proses tidak ditegakkan, dan semuanya berhenti saat internet mati.",
    solution:
      "Kami merancang satu database dengan alur yang ditegakkan sistem untuk CS, CRM, RnD, Desain, Finance, Legal, PPIC, Produksi, dan Logistik: tiket sampel dengan kuota revisi, kalkulator HPP dan margin, invoice PDF dengan cicilan, gerbang DP sebelum pendaftaran BPOM, dan gerbang pelunasan sebelum pengiriman. Setiap divisi menerima notifikasi lewat grup Telegram, dan aplikasi tetap bisa dipakai offline.",
    result:
      "Tahap pertama (CS & CRM) sudah berjalan, disusul modul RnD, Finance, dan Desain. Data lama bisa diimpor dari CSV.",
    metrics: [{ label: "Divisi dalam satu alur", value: "9" }],
    techStack: ["Next.js", "Tauri v2", "Rust", "SQLite", "Turso", "Telegram Bot API"],
    cover: { src: maklonCover, alt: "Pipeline lead dan klien dengan segmentasi Hot, Warm, Cold" },
    gallery: [
      { src: maklon1, alt: "Antrean tiket sampel untuk RnD dan Finance" },
      { src: maklon2, alt: "Log audit perubahan klien dan tiket sampel" },
      { src: maklon3, alt: "Pengaturan database, 2FA, dan kode pemulihan" },
    ],
    featured: false,
    order: 3,
    year: 2026,
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
