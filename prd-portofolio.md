# Product Requirement Document (PRD)

**Nama Produk:** Kemal Office Studio – Portfolio & Client Acquisition Platform
**File:** `prd-portofolio.md`
**Versi:** 4.0
**Status:** Approved for Development
**Owner:** Kemal Office Studio
**Target Rilis:** v1.0
**Dokumen pendamping:** `DESIGN.md` v2.1 (desain visual & interaksi)

### Riwayat Perubahan

| Versi | Perubahan utama |
| :--- | :--- |
| 3.0 | Baseline awal |
| 4.0 | Harga kartu paket diturunkan dari kalkulator (satu sumber kebenaran); situs berbahasa Indonesia; halaman studi kasus `/proyek/[slug]`; notifikasi lead via Telegram; validasi harga di server, rate limit, dan kebijakan privasi; tabel `projects` dipindah ke v2; guard rule tambahan; acceptance criteria per fitur |

---

## 1. Ringkasan & Positioning

* **Nama Studio:** Kemal Office Studio
* **Positioning:** Studio rekayasa software dan produk digital skala butik.
* **Tagline:** *Studio Web & Software Kustom Berperforma Tinggi.* (Bagian "Berperforma Tinggi" belum ditampilkan di situs sampai ada bukti terukur, mis. skor Lighthouse; situs memakai "Studio Web & Software Kustom".)
* **Value Proposition:** Membantu founder, bisnis, dan UMKM membangun aplikasi web yang cepat dimuat (di bawah 2 detik), sistem operasional internal kustom, dan solusi multiplatform dengan arsitektur data yang andal, tampilan interaktif, dan proses kerja yang transparan.
* **Bahasa situs:** Bahasa Indonesia (`<html lang="id">`). Istilah teknis (Next.js, landing page, dashboard) boleh tetap dalam bahasa aslinya.
* **Target Klien:**
  1. *Founder & Solopreneur:* butuh MVP SaaS atau landing page yang menghasilkan prospek.
  2. *UMKM / Bisnis Tradisional:* digitalisasi operasional (dashboard, absensi/payroll, order/katalog).
  3. *Agensi & Scale-up:* butuh partner engineering full-stack.

### 1.1 Tujuan & Metrik Keberhasilan

| Tujuan | Metrik | Target 3 bulan pasca rilis |
| :--- | :--- | :--- |
| Menghasilkan prospek | Jumlah klik "Konsultasi via WhatsApp" (tercatat di tabel `leads`) | ≥ 10 lead/bulan |
| Memperlihatkan kualitas teknis | Skor Lighthouse halaman utama | ≥ 90 di desktop & mobile |
| Menyaring prospek | Persentase lead dengan estimasi ≥ Rp 7.000.000 | Dipantau, tanpa target |

### 1.2 Di Luar Ruang Lingkup v1

* CMS atau panel admin (konten dikelola lewat file TypeScript).
* Blog, halaman template, atau toko.
* Versi bahasa Inggris.
* Formulir kontak berbasis email (kontak utama via WhatsApp; email hanya tautan `mailto:`).
* Pembayaran online di situs studio.

---

## 2. Arsitektur Teknologi & Infrastruktur

### 2.1 Core Stack

| Komponen | Pilihan | Alasan |
| :--- | :--- | :--- |
| Framework | Next.js (App Router) | Server Components, SSG untuk halaman proyek, `after()` untuk tugas latar |
| Styling & UI | Tailwind CSS + shadcn/ui | Konsisten dan ringan |
| Ikon | lucide-react | Bawaan ekosistem shadcn |
| Tema | next-themes | Default gelap tanpa kedipan saat load |
| Animasi | Framer Motion | Micro-interaction & transisi layout |
| Smooth scroll | Lenis | Scroll halus di desktop; nonaktif di perangkat sentuh & reduced-motion |
| 3D | WebGL2 tanpa library (satu fragment shader) | Shader prosedural ± 4 KB; three.js/R3F (± 190 KB gzip) tidak sepadan untuk satu bidang grid |
| Database | Turso (libSQL over HTTP) | SQLite serverless, latensi rendah |
| ORM | Drizzle ORM | Type-safe dan ringan |
| Validasi | Zod | Validasi input lead di server |
| Media | Folder `src/media/[slug]/`, di-import statis (ukuran & blur otomatis) | Cukup untuk 3–5 proyek; R2 ditunda sampai media membesar |
| Notifikasi | Telegram Bot API | Lead baru dikirim ke chat pemilik |
| Deployment | Vercel | Dukungan Next.js penuh, termasuk `after()` dan Image Optimization |
| Testing | Vitest (unit), Playwright (smoke test) | Logika harga wajib teruji |

### 2.2 Pengelolaan Konten (v1)

* **Config-driven:** semua data proyek, teks situs, dan pengaturan disimpan di file TypeScript:
  * `src/data/projects.ts` — daftar proyek (tipe pada §6.2).
  * `src/data/site.ts` — nomor WhatsApp, email, status ketersediaan, tautan sosial, statistik, testimoni, FAQ.
  * `src/lib/pricing.ts` — tabel harga dan aturan kalkulator (satu-satunya sumber angka harga).
* Database hanya menyimpan `leads` pada v1. Tabel `projects` ditunda ke v2 bila CMS dibutuhkan.

### 2.3 Variabel Lingkungan

| Nama | Keterangan |
| :--- | :--- |
| `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` | Koneksi database |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Notifikasi lead |
| `IP_HASH_SALT` | Garam rahasia untuk hash IP |
| `NEXT_PUBLIC_WA_NUMBER` | Format internasional tanpa `+`, mis. `6281234567890` |
| `NEXT_PUBLIC_SITE_URL` | URL produksi untuk SEO & OG |

---

## 3. Peta Halaman (Sitemap)

| Route | Isi | Rendering |
| :--- | :--- | :--- |
| `/` | Halaman utama (semua section §5) | Static |
| `/proyek/[slug]` | Halaman studi kasus per proyek | SSG via `generateStaticParams` |
| `/kebijakan-privasi` | Data yang dikumpulkan kalkulator & cara penggunaannya | Static |
| `/api/leads` | Route Handler `POST` untuk pencatatan lead | Dynamic |
| `not-found` | Halaman 404 bermerek dengan tautan kembali | Static |
| `sitemap.xml`, `robots.txt` | Dibuat via `app/sitemap.ts` dan `app/robots.ts` | Static |

**Pola drawer + halaman:** klik kartu proyek di halaman utama membuka drawer pratinjau memakai *intercepting route* (`app/@modal/(.)proyek/[slug]`). URL berubah menjadi `/proyek/[slug]`, sehingga tautan bisa dibagikan; refresh atau akses langsung menampilkan halaman penuh.

---

## 4. Pipeline Media & Performa

### 4.1 Video Showcase
* **Pra-upload:** maksimal 720p, `.webm` (utama) + `.mp4` H.264 (cadangan), tanpa audio, loop 6–12 detik, < 4 MB. Setiap video wajib punya gambar poster.
* **Rendering:** `<video preload="none" muted loop playsInline poster=...>`. Sumber video baru dipasang saat hover pertama (desktop) atau saat kartu ≥ 60% terlihat (mobile), dan dijeda saat keluar viewport.
* Video tidak diputar bila `prefers-reduced-motion` atau `navigator.connection.saveData` aktif; poster tetap tampil.

### 4.2 Gambar
* `next/image` dengan AVIF/WebP, placeholder blur, rasio tetap (`aspect-[16/10]`) untuk mencegah CLS.
* Gambar disimpan di `src/media/[slug]/` dan di-import statis; video (bila ada) di `public/media/[slug]/`. R2 ditunda dari v1.
* Gambar dirender lewat `getImageProps()` di server, bukan komponen `<Image>`, agar kode klien next/image tidak masuk bundle (lihat §8.1).
* Cover proyek minimal 1600×1000 px.

---

## 5. Struktur Halaman Utama & Fitur

Urutan section beserta ID anchor (dipakai navigasi):

| # | Section | Anchor |
| :--- | :--- | :--- |
| 1 | Hero | `#beranda` |
| 2 | Layanan | `#layanan` |
| 3 | Proyek | `#proyek` |
| 4 | Proses Kerja | `#proses` |
| 5 | Harga & Kalkulator | `#harga` |
| 6 | Testimoni & Statistik (opsional) | `#testimoni` |
| 7 | FAQ | `#faq` |
| 8 | CTA Penutup + Footer | `#kontak` |

### 5.1 Hero
* Status pill dari `site.ts` (mis. `Tersedia untuk Proyek Baru · Q4 2026`). Bila `available: false`, teks berganti menjadi `Antrean Penuh · Buka Lagi [bulan]` dengan titik kuning.
* Headline nilai bisnis, mis. *"Software Kustom untuk Bisnis yang Sedang Bertumbuh."*
* Canvas 3D prosedural yang merespons kursor; nonaktif pada reduced-motion, `saveData`, atau tanpa WebGL (fallback gradien statis).
* CTA utama **Hitung Estimasi Proyek** → scroll ke `#harga`. CTA sekunder **Lihat Proyek** → scroll ke `#proyek`.

**Acceptance criteria**
- Headline adalah elemen LCP dan tampil tanpa menunggu canvas.
- Canvas dimuat setelah halaman interaktif dan tidak menambah JS awal.

### 5.2 Layanan
1. **Web App & Landing Page:** Next.js, arsitektur edge, Core Web Vitals, SEO teknis.
2. **Sistem Manajemen Bisnis Kustom:** dashboard internal, absensi/payroll, otomasi alur data.
3. **Multiplatform & Database Modern:** database terdistribusi, integrasi REST/tRPC, aplikasi desktop.

### 5.3 Proyek (Showcase)
* Rilis dengan **3–5 proyek**.
* Filter kategori: `Semua`, `Web App`, `Sistem Internal`, `Landing Page`. Kategori tanpa proyek **disembunyikan**; bila hanya satu kategori terisi, baris filter tidak ditampilkan.
* Kartu: cover, preview video (hover/viewport), judul, tagline, tag teknologi (maks. 4 ditampilkan), satu metrik dampak.
* Klik kartu → drawer pratinjau (intercepting route) berisi ringkasan, metrik, dan tombol **Baca Studi Kasus Lengkap** serta **Buka Aplikasi** (jika `liveUrl` ada).
* Proyek dengan `featured: true` tampil lebih besar (span 2 kolom di desktop).

**Halaman `/proyek/[slug]`:** cover besar, ringkasan, bagian *Tantangan → Solusi → Hasil*, metrik dampak, tech stack, galeri screenshot, tautan live app, CTA "Punya proyek serupa? Hitung estimasinya", dan navigasi ke proyek berikutnya.

**Acceptance criteria**
- Setiap proyek punya URL sendiri, meta title/description, OG image, dan JSON-LD `CreativeWork`.
- Metrik dampak hanya diisi bila benar dan bisa dipertanggungjawabkan.

### 5.4 Proses Kerja
1. **Discovery & PRD:** pemetaan kebutuhan, alur pengguna, struktur data.
2. **UI/UX & Prototipe:** perancangan antarmuka fungsional.
3. **Pengembangan Iteratif:** pengembangan modular dengan preview berkala.
4. **Deploy & Serah Terima:** deployment production, dokumentasi, serah terima kode.

### 5.5 Harga & Kalkulator Estimasi

#### A. Sumber Kebenaran Harga
Semua angka berasal dari `src/lib/pricing.ts`. Kartu paket menampilkan harga **"mulai dari"** yang dihitung otomatis dari konfigurasi minimum paket tersebut, sehingga kartu dan kalkulator tidak pernah berbeda.

#### B. Parameter Kalkulator

| Grup | Tipe input | Opsi | Harga |
| :--- | :--- | :--- | ---: |
| Tipe Solusi (Base) | Pilih satu | Landing Page | Rp 2.500.000 |
| | | Web App / MVP Dinamis | Rp 5.500.000 |
| | | Sistem Internal / Dashboard | Rp 8.000.000 |
| Gaya Visual | Pilih satu | Bersih & Minimalis | Rp 0 |
| | | Animasi interaktif (catatan: Framer Motion) | + Rp 1.000.000 |
| | | Tampilan 3D interaktif (catatan: WebGL) | + Rp 2.000.000 |
| Backend & Data | Pilih satu | Tanpa database (catatan: halaman statis) | Rp 0 |
| | | Data tersimpan online (catatan: tambah, ubah, hapus data) | + Rp 1.500.000 |
| | | Login per peran + ekspor laporan (catatan: sudah termasuk database) | + Rp 3.000.000 |
| Add-ons | Pilih beberapa | Pembayaran online (catatan: Midtrans / Xendit) | + Rp 1.500.000 |
| | | Dua bahasa (catatan: Indonesia & Inggris) | + Rp 800.000 |

Label tampil berbahasa awam untuk founder & UMKM; nama teknologi menjadi catatan kecil di kartu (audit antislop 003).
| Timeline | Pilih satu | Standar (3–4 minggu) | × 1,0 |
| | | Priority Sprint (1–2 minggu) | × 1,25 |

**Formula**

```
subtotal = base + gayaVisual + backend + Σ addons
total    = ceil(subtotal × timeline / 100.000) × 100.000   // dibulatkan ke atas per Rp 100.000
```

**Contoh uji:** Web App + Framer Motion + Database Cloud + Payment Gateway + Priority → (5.500.000 + 1.000.000 + 1.500.000 + 1.500.000) × 1,25 = 11.875.000 → **Rp 11.900.000**.

**Nilai default saat dibuka:** Landing Page, Bersih & Minimalis, Tanpa Database, tanpa add-on, Standar → Rp 2.500.000.

#### C. Kartu Paket (dihitung dari kalkulator)

| Paket | Konfigurasi minimum | Harga tampil |
| :--- | :--- | ---: |
| Starter (Landing Page) | Landing Page + Minimalis + Tanpa DB + Standar | mulai Rp 2.500.000 |
| Growth (Web App / MVP) | Web App + Minimalis + Database Cloud + Standar | mulai Rp 7.000.000 |
| Bespoke (Sistem Bisnis) | Sistem Internal + Minimalis + Multi-role + Standar | mulai Rp 11.000.000 |

Tombol pada tiap kartu: **Hitung Paket Ini** → scroll ke kalkulator dengan konfigurasi minimum paket tersebut sudah terpilih.

#### D. Aturan Dependensi (Guard Rules)

| # | Kondisi | Akibat | Alasan yang ditampilkan |
| :--- | :--- | :--- | :--- |
| G1 | Tipe = Landing Page | Opsi *Multi-role Auth + Export* nonaktif | "Tidak tersedia untuk landing page" |
| G2 | Backend = Tanpa Database | Add-on *Payment Gateway* nonaktif | "Butuh database" |
| G3 | Tipe = Web App atau Sistem Internal | Opsi *Tanpa Database* nonaktif; backend minimal *Database Cloud* | "Aplikasi dinamis butuh database" |

Bila perubahan pilihan membuat opsi yang sudah terpilih menjadi tidak valid, opsi itu **otomatis diganti ke opsi valid terdekat** (atau dilepas, untuk add-on), dan muncul pemberitahuan singkat, mis. "Pembayaran online dilepas karena butuh database."

#### E. Termin Pembayaran
* **Termin 1 (DP 50%):** sebelum perancangan antarmuka dan arsitektur dimulai.
* **Termin 2 (Pelunasan 50%):** setelah deployment staging di-review dan siap serah terima repo/domain.

#### F. Penafian
Di bawah total selalu tampil: *"Angka ini estimasi awal, bukan penawaran final. Harga akhir ditetapkan setelah sesi discovery."*

#### G. Konversi WhatsApp & Pencatatan Lead

**Alur saat tombol "Konsultasikan Estimasi Ini via WhatsApp" diklik:**
1. Tombol adalah `<a href="https://wa.me/{WA_NUMBER}?text={pesan ter-encode}" target="_blank" rel="noopener">`, sehingga WhatsApp terbuka seketika dan tidak diblokir popup blocker.
2. Pada event klik yang sama, browser mengirim pilihan kalkulator via `navigator.sendBeacon('/api/leads', payload)` (cadangan: `fetch` dengan `keepalive: true`). Beacon tetap terkirim walau tab berpindah ke aplikasi WhatsApp.
3. Server memvalidasi payload dengan Zod, **menghitung ulang harga di server** memakai `pricing.ts` (harga dari klien diabaikan), memeriksa guard rules, lalu menyimpan ke tabel `leads`.
4. Setelah respons dikirim, `after()` mengirim notifikasi ke Telegram. Kegagalan Telegram dicatat di log dan kolom `notifiedAt` tetap kosong; lead tetap tersimpan.

**Format pesan WhatsApp:**
```text
Halo Kemal Office Studio! Saya tertarik konsultasi proyek baru dengan estimasi dari kalkulator website:

• Tipe Proyek: [Tipe]
• Gaya Visual: [Gaya]
• Data & Backend: [Backend]
• Add-ons: [Daftar add-on / Tidak ada]
• Timeline: [Standar / Priority Sprint]
• Estimasi Biaya: Rp [Total]

Apakah ada waktu untuk diskusi lebih lanjut?
```

**Format notifikasi Telegram:**
```text
🆕 Lead baru — Rp 11.900.000
Web App · Animasi interaktif · Data online
Add-ons: Pembayaran online
Timeline: Priority Sprint
08 Okt 2026, 19.20 WIB
```

**Keamanan & anti-spam**
- IP di-hash dengan SHA-256 + `IP_HASH_SALT`; IP mentah tidak pernah disimpan.
- Rate limit: maksimal 5 lead per hash IP per 10 menit (dicek ke tabel `leads`); kelebihan ditolak diam-diam (respons 204, tidak disimpan, WhatsApp tetap terbuka).
- Payload maksimal 2 KB; opsi di luar daftar ditolak.

**Acceptance criteria**
- Total di kalkulator, kartu paket, pesan WhatsApp, dan baris database selalu sama untuk konfigurasi yang sama.
- Ketiga guard rule teruji di unit test, termasuk penggantian otomatis.
- Mengklik tombol WhatsApp tidak pernah tertunda oleh pencatatan lead.
- Lead tersimpan walau Telegram gagal.

### 5.6 Testimoni & Statistik (Opsional)
Diambil dari `site.ts`. Section **tidak dirender** bila datanya kosong. Hanya boleh berisi testimoni dan angka nyata.

### 5.7 FAQ
Minimal 5 pertanyaan di `site.ts`, mis.: lama pengerjaan, apa yang perlu disiapkan klien, garansi, kepemilikan kode & domain, cara pembayaran. Ditandai JSON-LD `FAQPage`.

### 5.8 CTA Penutup & Footer
CTA besar ke WhatsApp (pesan umum tanpa estimasi), email, tautan sosial, ringkasan garansi, tautan kebijakan privasi, hak cipta.

---

## 6. Data & Basis Data

### 6.1 Skema Turso (Drizzle)

```typescript
// src/db/schema.ts
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

export const leads = sqliteTable(
  'leads',
  {
    id: text('id').primaryKey(),                       // crypto.randomUUID()
    scope: text('scope').notNull(),                    // 'landing' | 'webapp' | 'internal'
    visual: text('visual').notNull(),                  // 'minimal' | 'motion' | 'three'
    backend: text('backend').notNull(),                // 'none' | 'db' | 'multirole'
    addons: text('addons', { mode: 'json' }).$type<string[]>().notNull().default([]),
    timeline: text('timeline').notNull(),              // 'standard' | 'priority'
    estimatedPrice: integer('estimated_price').notNull(), // dihitung di server, Rupiah
    ipHash: text('ip_hash'),
    source: text('source').notNull().default('estimator_wa_click'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    notifiedAt: integer('notified_at', { mode: 'timestamp' }),
  },
  (t) => [index('leads_ip_created_idx').on(t.ipHash, t.createdAt)],
);
```

### 6.2 Tipe Data Proyek

```typescript
// src/data/projects.ts
export type ProjectCategory = 'web-app' | 'sistem-internal' | 'landing-page';

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  category: ProjectCategory;
  summary: string;              // 1–2 kalimat untuk kartu & drawer
  challenge: string;
  solution: string;
  result: string;
  metrics: { label: string; value: string }[];  // mis. { label: 'Waktu rekap gaji', value: '-80%' }
  techStack: string[];
  cover: { src: string; alt: string };
  video?: { webm: string; mp4: string; poster: string };
  gallery: { src: string; alt: string }[];
  liveUrl?: string;
  featured: boolean;
  order: number;
  year: number;
}
```

---

## 7. Garansi & Batasan Ruang Lingkup

1. **Garansi Bebas Bug:** 30 hari kalender pasca serah terima untuk galat yang berasal dari ruang lingkup yang disepakati.
2. **Perubahan di Luar Lingkup:** perubahan alur bisnis di luar PRD proyek klien dihitung sebagai *Change Request* dengan biaya dan jadwal terpisah.
3. **Kepemilikan:** setelah pelunasan, repositori kode dan domain diserahkan sepenuhnya kepada klien.

---

## 8. Persyaratan Non-Fungsional

### 8.1 Performa
* Lighthouse ≥ 90 (desktop & mobile) untuk `/` dan `/proyek/[slug]`.
* LCP < 1,8 detik, CLS < 0,05, INP < 200 ms.
* JS awal ≤ 160 KB gzip, tanpa polyfill `noModule` (canvas dimuat terpisah). Next 16.4 + React kosong sudah ~138 KB, jadi tambahan milik situs maks. ~22 KB.

### 8.2 SEO
* Metadata per halaman via Metadata API; OG image dinamis via `next/og`.
* JSON-LD: `ProfessionalService` (halaman utama), `CreativeWork` (proyek), `FAQPage` (FAQ).
* `sitemap.xml` dan `robots.txt` otomatis; canonical URL di setiap halaman.

### 8.3 Aksesibilitas
* Navigasi keyboard penuh; kontras WCAG AA; dukungan `prefers-reduced-motion`.
* Fallback statis bila WebGL tidak didukung.

### 8.4 Privasi
* Halaman `/kebijakan-privasi` menjelaskan data yang dicatat kalkulator (pilihan estimasi, hash IP, waktu), tujuannya (analitik minat klien), dan masa simpan (12 bulan), sejalan dengan prinsip UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi.
* Tidak ada cookie pelacak pihak ketiga pada v1.

### 8.5 Kualitas Kode
* TypeScript strict, Biome (lint + format).
* Unit test `pricing.ts` (formula, pembulatan, guard rules, harga paket) wajib lulus sebelum deploy.
* Smoke test Playwright: halaman utama termuat, kalkulator menghitung contoh uji §5.5.B, tautan WhatsApp terbentuk benar.

---

## 9. Roadmap Sprint

| Sprint | Fokus | Selesai bila |
| :--- | :--- | :--- |
| 1 — Fondasi | Inisialisasi Next.js, Tailwind, shadcn, next-themes, Lenis; design tokens; `site.ts`, `projects.ts`; Turso + Drizzle (`leads`) | Halaman kosong ber-tema tampil, migrasi DB jalan |
| 2 — Visual & Proyek | Hero + canvas WebGL, kartu proyek + hover-to-play, drawer intercepting route, halaman `/proyek/[slug]` | 3–5 proyek tampil lengkap dengan URL masing-masing |
| 3 — Harga & Konversi | `pricing.ts` + unit test, kartu paket, kalkulator + guard rules, `/api/leads`, Telegram, rate limit | Contoh uji lulus; lead masuk DB & Telegram |
| 4 — Penyelesaian & Rilis | Proses kerja, testimoni, FAQ, footer, kebijakan privasi, 404, SEO, audit Lighthouse, uji mobile & reduced-motion, domain production | Semua acceptance criteria & checklist DESIGN.md lulus |

---

## 10. Keputusan Terbuka

| Hal | Default sementara |
| :--- | :--- |
| Warna & logo brand | **Selesai:** palet dari logo KOS; logo SVG + PNG (normal & reversed) tersedia (DESIGN.md §3). Sisa: favicon |
| Tagline logo | **Selesai:** "Application · Documents · Management", selaras dengan layanan aplikasi & sistem manajemen |
| Nomor WhatsApp & domain | Diisi lewat variabel lingkungan |
| Statistik & testimoni nyata | Section disembunyikan sampai data tersedia |
| Jumlah putaran revisi desain per proyek klien | Belum ditentukan; tidak dicantumkan di situs |
