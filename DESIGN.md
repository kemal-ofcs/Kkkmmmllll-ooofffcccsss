# DESIGN.md — Kemal Office Studio

**Versi:** 2.1
**Terhubung ke:** `prd-portofolio.md` v4.0
**Stack:** Next.js (App Router) · Tailwind CSS · shadcn/ui · next-themes · Framer Motion · Lenis · React Three Fiber

> Dokumen ini adalah sumber kebenaran desain visual, interaksi, dan teks antarmuka. Semua keputusan tunduk pada target performa PRD §8.1 (Lighthouse ≥ 90, LCP < 1,8 dtk, CLS < 0,05). Bila sebuah efek mengancam target itu, efeknya yang dikurangi.

### Riwayat Perubahan

| Versi | Perubahan utama |
| :--- | :--- |
| 1.0 | Draf awal |
| 2.1 | Tagline logo menjadi "Application · Documents · Management"; logo tersedia sebagai SVG vektor & PNG transparan |
| 2.0 | Palet dari logo KOS; tema gelap sebagai default; Lenis; seluruh teks UI Bahasa Indonesia; canvas hero bermotif grid sel dari logo; halaman studi kasus + drawer intercepting route; spesifikasi kalkulator lengkap dengan guard rules; aturan pemakaian logo |

---

## 1. Prinsip Desain

1. **Premium lewat restraint.** Ruang kosong lega, tipografi besar, satu aksen dominan. Kesan mahal datang dari presisi.
2. **Aplikasi yang terlihat bekerja.** Tagline logo ("Application · Documents · Management") diterjemahkan menjadi motif grid sel, dokumen, dan panel ala tool kerja.
3. **Gerak punya fungsi.** Animasi memberi umpan balik, menuntun perhatian, atau menjelaskan proses. Bukan sekadar hiasan.
4. **Semua jalan menuju dua aksi:** *Hitung Estimasi Proyek* dan *Konsultasi via WhatsApp*.
5. **Tetap utuh tanpa efek.** Tanpa WebGL, dengan `prefers-reduced-motion`, atau di koneksi lambat, situs tetap lengkap, cepat, dan rapi.

---

## 2. Referensi Gaya

Inspirasi: visuvate.com. Pola yang diadaptasi (bukan disalin):

| Pola referensi | Adaptasi Kemal Office Studio |
| :--- | :--- |
| Teks tombol yang "berputar" saat hover | `RollingText` di semua CTA & link nav |
| Hero bergaya editor desain (panel Pages/Layers, strip proyek bisa di-drag) | Hero "Studio Console" dengan panel struktur halaman & strip proyek |
| Press & hold untuk preview | Hover-to-play (desktop), play saat terlihat (mobile) |
| Latar video bertema bintang | Canvas R3F prosedural bermotif grid sel dari logo |
| Ilustrasi proses yang bergerak mengikuti scroll | Section Proses Kerja dengan visual sticky |
| Smooth scroll yang terasa "berat" | Lenis |

Jangan menyalin aset, teks, angka, atau tata letak persis dari situs referensi.

---

## 3. Identitas Brand

### 3.1 Logo
Logo terdiri dari **mark "KOS"** (K navy, O berbentuk awan biru bergradien dengan ikon grid/dokumen, S navy) dan **wordmark** "KEMAL OFFICE STUDIO" dengan tagline "APPLICATION · DOCUMENTS · MANAGEMENT" (menggantikan "Data · Documents · Productivity" sejak v2.1). Wordmark memakai Poppins (Medium untuk KEMAL dengan penebalan tipis, Regular untuk OFFICE, Medium untuk STUDIO dan tagline) dan sudah dikonversi menjadi path, jadi file SVG tidak bergantung pada font.

**File logo** (sudah tersedia; letakkan di `public/brand/`). SVG vektor sudah final, PNG transparan untuk keperluan non-web:

| File | Pemakaian |
| :--- | :--- |
| `logo-mark.svg` / `.png` | Header, loader |
| `logo-mark-reversed.svg` / `.png` | Header di tema gelap (K & S putih, awan biru lebih terang) |
| `logo-full.svg` / `.png` | Footer tema terang, dokumen, invoice |
| `logo-full-reversed.svg` / `.png` | Footer tema gelap, OG image |
| `favicon.svg` + `icon-192.png`, `icon-512.png`, `apple-icon.png` | Ikon situs & PWA (**belum dibuat**, turunkan dari mark yang disederhanakan) |

**Aturan**
- Selalu pakai file SVG di website; PNG hanya untuk dokumen, media sosial, dan aplikasi lain.
- **Tema gelap wajib memakai versi reversed.** Huruf K, S, dan "KEMAL" berwarna navy akan hilang di latar gelap.
- Favicon dan ukuran < 32 px: pakai mark yang disederhanakan (grid 3×3 dikurangi menjadi 2×2 atau dihapus), karena detail kecil hilang.
- Tagline logo tidak dipakai di bawah 160 px lebar (tidak terbaca); tampilkan sebagai teks HTML terpisah bila perlu.
- Ruang aman: minimal setinggi huruf "O" di sekeliling logo. Jangan diberi bayangan, outline, atau diputar.
- Tinggi mark di header: 28 px (mobile), 32 px (desktop).

### 3.2 Palet Brand (diambil dari logo)

| Token | Hex | Asal di logo | Peran |
| :--- | :--- | :--- | :--- |
| `brand-navy` | `#0A2A5E` | Huruf K, S, "KEMAL" | Warna teks utama tema terang, dasar gradien |
| `brand-blue` | `#2E8CE8` | Bagian terang awan "O", "OFFICE" | Aksen utama, sorotan, gradien |
| `brand-blue-deep` | `#1F6FD1` | Transisi gradien awan | Latar tombol utama (kontras teks putih 4,9:1) |
| `brand-green` | `#4FAE45` | Sudut dokumen, garis kanan | Aksen sekunder: status, keberhasilan, titik penekanan |

**Gradien brand** (meniru awan di logo): `linear-gradient(135deg, #2E8CE8 0%, #1F6FD1 45%, #0A2A5E 100%)`. Dipakai hemat: canvas hero, garis pemisah, dan satu-dua highlight. Tidak untuk latar teks panjang.

**Rasio pemakaian:** netral ~85%, biru ~12%, hijau ~3%. Hijau tidak pernah dipakai untuk tombol utama.

---

## 4. Design Tokens

### 4.1 Warna Semantik

Default **tema gelap** via `next-themes` (`defaultTheme="dark"`, `attribute="data-theme"`, `enableSystem={false}`), dengan toggle ke terang. `next-themes` menyuntikkan script sebelum render sehingga tidak ada kedipan tema.

```css
/* src/app/globals.css */
:root,
[data-theme="dark"] {
  --bg:          #070E1B;   /* navy sangat gelap, turunan brand-navy */
  --surface:     #0C182C;
  --surface-2:   #12223B;
  --border:      #1C2E4D;
  --fg:          #EEF3FA;
  --fg-muted:    #8FA3BF;   /* kontras 7,5:1 terhadap --bg */
  --accent:      #4A9EF0;   /* brand-blue diterangkan untuk teks/ikon di gelap (6,8:1) */
  --accent-bg:   #1F6FD1;   /* latar tombol utama, teks putih */
  --accent-soft: #10284A;
  --green:       #5BBF4A;
  --green-soft:  #12301A;
  --warning:     #F2B33D;
  --danger:      #F06A6A;
  --ring:        #4A9EF0;
}

[data-theme="light"] {
  --bg:          #F5F7FA;   /* senada latar logo */
  --surface:     #FFFFFF;
  --surface-2:   #EAEFF6;
  --border:      #D5DEEA;
  --fg:          #0A2A5E;   /* brand-navy sebagai warna teks */
  --fg-muted:    #4A5B73;   /* 6,5:1 */
  --accent:      #1F6FD1;   /* 4,6:1 untuk link */
  --accent-bg:   #1F6FD1;
  --accent-soft: #DCEAFB;
  --green:       #237A30;   /* digelapkan agar lolos AA sebagai teks (5:1) */
  --green-soft:  #E1F2DE;
  --warning:     #946000;   /* 5:1, lolos AA sebagai teks */
  --danger:      #C23B3B;
  --ring:        #1F6FD1;
}
```

**Aturan**
- Teks di atas `--accent-bg` selalu putih `#FFFFFF`.
- `--green` hanya untuk: titik status "tersedia", tanda centang fitur paket, angka hasil/metrik positif, dan notifikasi sukses.
- Kontras: teks normal ≥ 4,5:1, teks besar & ikon ≥ 3:1. Semua pasangan teks/latar di atas sudah dihitung dan lolos AA (terendah: `--accent` terang 4,6:1, `--danger` terang 4,9:1). Uji ulang bila nilai warna diubah.
- `brand-blue` asli (`#2E8CE8`) hanya untuk elemen dekoratif dan gradien; sebagai teks di latar terang kontrasnya kurang dari 4,5:1.

### 4.2 Tipografi

| Peran | Font (`next/font/google`) | Gaya |
| :--- | :--- | :--- |
| Display & heading | **Plus Jakarta Sans** | Weight 600–700, tracking -0.03em. Geometris, cocok dengan huruf logo, dan karya desainer Indonesia |
| Body & UI | **Inter** | Weight 400/500 |
| Label & angka teknis | **JetBrains Mono** | Uppercase, tracking +0.08em, 11–12 px |

Semua dengan `display: "swap"`, subset `latin`, dan `adjustFontFallback` aktif agar tidak memicu CLS. Total maksimal 5 file font.

| Token | Nilai |
| :--- | :--- |
| `display-xl` (hero) | `clamp(2.5rem, 7.5vw, 6.5rem)` / 0.98 |
| `display-l` (judul section) | `clamp(2rem, 4.5vw, 3.75rem)` / 1.05 |
| `title` | `clamp(1.25rem, 2vw, 1.625rem)` / 1.25 |
| `body-l` | `1.125rem` / 1.6 |
| `body` | `1rem` / 1.6 |
| `label` | `0.75rem` / 1.2, mono, uppercase |

Angka harga memakai `font-variant-numeric: tabular-nums` agar tidak "bergoyang" saat beranimasi.

### 4.3 Spacing, Radius, Layout
- Grid dasar 8 px. Container maks. **1280 px**; gutter **16 px** mobile, **32 px** desktop.
- Jarak antar section: `clamp(5rem, 12vw, 9rem)`.
- Radius: `sm 8px` · `md 14px` · `lg 24px` · `pill 999px`. Kartu memakai `lg`, tombol memakai `pill`.
- Pemisah: border 1 px `--border`. Elevasi lewat perbedaan surface, bukan bayangan tebal. Di tema terang boleh `shadow-sm` lembut.
- Breakpoint: `sm 640` · `md 768` · `lg 1024` · `xl 1280`. Mobile-first.

### 4.4 Ikon
lucide-react, stroke 1.75, ukuran 16/20/24. Warna mengikuti teks, atau `--accent` untuk ikon fitur.

### 4.5 Motion

```ts
// src/lib/motion.ts
export const ease = {
  out:   [0.22, 1, 0.36, 1],   // masuk & hover
  inOut: [0.65, 0, 0.35, 1],   // transisi besar
} as const;

export const duration = { fast: 0.18, base: 0.45, slow: 0.9 } as const;

export const stagger = { list: 0.04, letters: 0.012 } as const;
```

Hanya `transform` dan `opacity` yang dianimasikan.

---

## 5. Efek Signature

### 5.1 Rolling Text
Teks digandakan dalam wrapper `overflow-hidden`; saat hover/fokus, salinan atas keluar ke atas dan salinan bawah masuk. Murni CSS transform.
- Salinan kedua `aria-hidden="true"`.
- Tombol utama: stagger per huruf 12 ms. Link nav: tanpa stagger.
- Reduced-motion: diganti perubahan warna saja.

### 5.2 Canvas Hero "Data Grid"
Motif dari ikon grid di dalam awan logo.

- Bidang grid sel persegi (± 40×24 sel) dalam perspektif miring, warna sel memakai gradien brand (biru → navy) dengan opasitas rendah.
- Sel di sekitar kursor "terangkat" dan menyala biru (falloff lembut, damping 0,08). Sesekali satu sel acak menyala **hijau** lalu memudar, seperti sudut dokumen pada logo.
- Saat tanpa kursor (mobile): gelombang pelan otomatis.
- Implementasi: satu `InstancedMesh` + shader kustom; tanpa tekstur. Target < 30 KB.
- Dimuat via `next/dynamic` (`ssr: false`) setelah `requestIdleCallback`; masuk dengan fade 600 ms.
- DPR dibatasi `Math.min(devicePixelRatio, 1.5)`; render berhenti saat hero keluar viewport atau tab tersembunyi.
- **Nonaktif** bila `prefers-reduced-motion`, `saveData`, WebGL tidak ada, atau perangkat ≤ 4 GB RAM (`navigator.deviceMemory`). Fallback: gradien radial biru-navy statis + pola grid tipis via CSS.
- Elemen canvas `aria-hidden="true"`.

### 5.3 Hero "Studio Console"
- **Panel kiri (≥ 1024 px):** label mono `HALAMAN` berisi daftar section (Beranda, Layanan, Proyek, Proses, Harga, FAQ). Item aktif mengikuti posisi scroll (IntersectionObserver); klik = scroll halus.
- **Strip proyek:** kartu cover 3–5 proyek, diduplikasi agar menjadi marquee tak berujung yang berjalan pelan (30 dtk/putaran). Bisa di-drag (`drag="x"` + inertia); marquee berhenti saat hover/drag dan saat reduced-motion. Klik kartu membuka drawer proyek.
- **Kontrol mini:** toggle tema (ikon matahari/bulan) dengan label mono `TEMA`.
- Mobile: panel dan kontrol mini disembunyikan.

### 5.4 Smooth Scroll (Lenis)
- `lerp: 0.1`, `smoothWheel: true`. **Tidak aktif** di perangkat sentuh (`pointer: coarse`) dan saat reduced-motion; di sana scroll bawaan.
- `lenis.stop()` saat drawer/menu terbuka, `lenis.start()` saat ditutup.
- Link anchor memakai `lenis.scrollTo(target, { offset: -80 })` (tinggi header).
- RAF Lenis disatukan dengan Framer Motion (`frame.update`) agar tidak ada dua loop.

### 5.5 Reveal & Scroll-Linked
- Reveal default: `opacity 0→1`, `y 24→0`, `duration.base`, sekali saja, `amount: 0.2`.
- Judul section: reveal per baris dengan mask.
- Scroll-linked hanya di section Proses Kerja.

### 5.6 Kursor Kustom (desktop, opsional)
Titik 10 px mengikuti kursor dengan spring; di atas kartu proyek membesar 72 px berisi label `LIHAT`. Kursor asli tetap tampil. Nonaktif di perangkat sentuh dan reduced-motion.

### 5.7 Magnetic CTA (desktop)
Tombol utama bergeser maks. 6 px ke arah kursor dalam radius 80 px. Nonaktif di sentuh dan reduced-motion.

---

## 6. Desain Per Section

### 6.0 Header
- Tinggi 64 px (mobile) / 72 px (desktop), sticky. Transparan di atas hero; setelah scroll 24 px menjadi `--bg` 80% + `backdrop-blur-md` + border bawah.
- Kiri: logo mark (reversed di gelap). Tengah: Layanan · Proyek · Proses · Harga · FAQ. Kanan: toggle tema + tombol **Hitung Estimasi**.
- Mobile: hamburger membuka menu layar penuh; item masuk dengan stagger 40 ms; fokus terkunci; `Esc` menutup.
- Link "Lewati ke konten" muncul saat fokus keyboard pertama.

### 6.1 Hero (`#beranda`)
- Status pill: titik `--green` berdenyut (2 dtk) + `Tersedia untuk Proyek Baru · Q4 2026`. Saat penuh: titik `--warning`, teks `Antrean Penuh · Buka Lagi [bulan]`.
- Headline `display-xl`: **"Software Kustom untuk Bisnis yang Sedang Bertumbuh."** Kata "Bertumbuh" diberi warna `--accent`.
- Subteks `body-l`, `--fg-muted`, maks. 2 baris: "Web app cepat, sistem operasional internal, dan dashboard data yang dibangun rapi dari PRD hingga production."
- CTA: **Hitung Estimasi Proyek** (utama) dan **Lihat Proyek** (outline).
- Latar: canvas Data Grid, dengan gradien bawah ke `--bg` agar menyatu.
- Di bawah CTA: strip proyek (§5.3).

### 6.2 Layanan (`#layanan`)
- Label mono `01 — LAYANAN`, judul: "Apa yang Kami Bangun".
- Tiga kartu bernomor `01 / 02 / 03` dengan ikon lucide, judul, deskripsi 2 baris, dan chip teknologi.
- Hover: border menjadi `--accent`, ikon naik 4 px, surface naik satu level.

### 6.3 Proyek (`#proyek`)
- Label `02 — PROYEK`, judul: "Karya Terpilih".
- Filter pill dengan indikator aktif bergeser (`layoutId`). Kategori kosong disembunyikan; filter hilang bila hanya satu kategori.
- Grid: 1 kolom (mobile), 2 kolom (≥ 768). Proyek `featured` span 2 kolom.
- **Kartu:** cover `aspect-[16/10]` + blur; badge kategori (mono); judul `title`; tagline; maks. 4 chip teknologi (+N); satu metrik dengan angka berwarna `--green`.
- **Hover-to-play:** video dipasang saat hover pertama; poster tetap sampai `canplay`, lalu crossfade 200 ms.
- Animasi filter: `AnimatePresence` + `layout`, durasi `base`.

**Drawer pratinjau** (intercepting route `@modal/(.)proyek/[slug]`)
- Desktop: shadcn `Sheet` dari kanan, lebar 560 px. Mobile: dari bawah, tinggi 90 vh, bisa diusap turun.
- Isi: video/cover, judul, ringkasan, 2–3 metrik, stack, tombol **Baca Studi Kasus Lengkap** (utama) dan **Buka Aplikasi** (jika ada).
- Tutup: tombol ×, `Esc`, klik overlay, atau tombol back browser (`router.back()`).

### 6.4 Halaman Studi Kasus `/proyek/[slug]`
1. Breadcrumb mono: `PROYEK / [KATEGORI]`.
2. Judul `display-l`, tagline, baris info: tahun · kategori · tautan live.
3. Cover lebar penuh container, radius `lg`.
4. Pita metrik: 2–4 angka besar (`--green`) dengan label kecil.
5. Tiga blok: **Tantangan**, **Solusi**, **Hasil**. Layout dua kolom di desktop (judul sticky kiri, isi kanan).
6. Tech stack sebagai chip.
7. Galeri: grid 2 kolom, klik membuka lightbox (navigasi panah & keyboard).
8. CTA: "Punya proyek serupa?" + tombol **Hitung Estimasi** (ke `/#harga`).
9. Navigasi "Proyek Berikutnya →" dengan cover kecil.

### 6.5 Proses Kerja (`#proses`)
- Label `03 — PROSES`, judul: "Dari Ide ke Production".
- Desktop: kiri sticky berisi 4 langkah (aktif = teks `--fg` + garis progres `--accent`), kanan visual yang berganti sesuai scroll.
- Visual sederhana berbasis SVG/CSS dengan warna brand:
  1. **Discovery & PRD:** dokumen dengan baris teks yang terisi satu per satu.
  2. **UI/UX & Prototipe:** wireframe yang berubah menjadi UI berwarna.
  3. **Pengembangan Iteratif:** jendela terminal dengan baris commit muncul berurutan, ditutup centang hijau.
  4. **Deploy & Serah Terima:** grid sel (motif logo) yang menyala satu per satu hingga penuh, lalu label `LIVE` hijau.
- Mobile: daftar vertikal biasa dengan visual kecil di tiap langkah, tanpa sticky.

### 6.6 Harga & Kalkulator (`#harga`)
Label `04 — HARGA`, judul: "Estimasi Transparan, Tanpa Tebak-tebakan".

**Kartu paket** (3 kolom desktop, carousel geser di mobile)
- Nama, harga "mulai Rp X" (angka dari `pricing.ts`), deskripsi singkat, daftar fitur dengan centang `--green`.
- Paket **Growth** diberi border `--accent` dan badge `PALING DIPILIH`.
- Tombol **Hitung Paket Ini** → scroll ke kalkulator dengan konfigurasi paket terpilih; panel kalkulator berkedip highlight 600 ms.

**Kalkulator**
- **Desktop (≥ 1024):** dua kolom. Kiri: lima grup parameter bertumpuk. Kanan: panel ringkasan sticky (top 96 px).
- **Mobile:** wizard 5 langkah dengan indikator progres (`Langkah 2 dari 5`), tombol Kembali/Lanjut; ringkasan total menempel di bawah layar (bottom bar) dan bisa diketuk untuk melihat rincian.
- **Kontrol:**
  - Pilih satu → kartu radio (seluruh kartu bisa diklik), terpilih = border `--accent` + latar `--accent-soft` + ikon centang.
  - Pilih beberapa (add-ons) → kartu checkbox dengan gaya sama.
  - Setiap opsi menampilkan harga tambahannya (mono kecil, mis. `+ Rp 1.500.000`).
- **Opsi nonaktif:** opacity 40%, `aria-disabled="true"`, kursor `not-allowed`, dan teks alasan kecil langsung di kartu (bukan tooltip, agar terbaca di mobile):
  - G1 Multi-role saat Landing Page: "Tidak tersedia untuk landing page"
  - G2 Payment Gateway saat Tanpa Database: "Butuh database"
  - G3 Tanpa Database saat Web App/Sistem Internal: "Aplikasi dinamis butuh database"
- **Penggantian otomatis:** bila pilihan berubah membuat opsi terpilih tidak valid, opsi diganti/dilepas dan muncul toast kecil (atas panel ringkasan, 3 dtk), mis. "Payment Gateway dilepas karena butuh database." Diumumkan juga via `aria-live="polite"`.
- **Panel ringkasan:** rincian per baris (label + harga), garis pemisah, baris pengali timeline bila Priority (`× 1,25`), lalu **total** besar `display-l` tabular-nums. Total beranimasi (tween 400 ms) setiap berubah; reduced-motion = langsung berganti.
- Di bawah total: penafian estimasi (PRD §5.5.F) dalam `--fg-muted` kecil.
- Termin pembayaran: timeline dua titik `DP 50%` → `Pelunasan 50%` dengan keterangan singkat.
- Tombol penuh lebar: ikon WhatsApp + **Konsultasikan Estimasi Ini via WhatsApp** (latar `--accent-bg`). Setelah diklik, label sementara berubah 2 dtk menjadi "Membuka WhatsApp…".

### 6.7 Testimoni & Statistik (`#testimoni`, opsional)
- Hanya dirender bila `site.ts` berisi data nyata.
- Baris statistik: angka besar dengan count-up sekali saat terlihat.
- Testimoni: carousel satu kartu (kutipan, nama, peran, foto opsional), tombol panah + indikator `01 / 03`; tidak auto-play.

### 6.8 FAQ (`#faq`)
- Label `05 — FAQ`, judul: "Pertanyaan yang Sering Diajukan".
- shadcn `Accordion` (satu terbuka sekaligus), ikon plus berputar menjadi ×.

### 6.9 CTA Penutup & Footer (`#kontak`)
- Blok CTA besar dengan gradien brand halus di latar: **"Punya ide? Mari wujudkan bersama."** + tombol WhatsApp + tautan email.
- Footer 4 kolom (stack di mobile): logo full reversed/normal + tagline; Navigasi; Kontak; Legal (Kebijakan Privasi, garansi 30 hari).
- Baris bawah: `© 2026 Kemal Office Studio` + garis tipis gradien brand.

### 6.10 Halaman 404
Grid sel motif logo dengan satu sel "hilang", judul "Halaman Tidak Ditemukan", tombol **Kembali ke Beranda**.

### 6.11 Kebijakan Privasi
Layout artikel sederhana, lebar teks maks. 68 karakter, heading `title`.

---

## 7. Teks Antarmuka (Microcopy)

| Tempat | Teks |
| :--- | :--- |
| CTA utama | Hitung Estimasi Proyek |
| CTA sekunder | Lihat Proyek |
| Header CTA | Hitung Estimasi |
| Status tersedia | Tersedia untuk Proyek Baru · Q4 2026 |
| Status penuh | Antrean Penuh · Buka Lagi [Bulan] |
| Kartu proyek → drawer | Baca Studi Kasus Lengkap / Buka Aplikasi |
| Kartu paket | Hitung Paket Ini |
| Kalkulator WA | Konsultasikan Estimasi Ini via WhatsApp |
| Setelah klik WA | Membuka WhatsApp… |
| Penafian | Angka ini estimasi awal, bukan penawaran final. Harga akhir ditetapkan setelah sesi discovery. |
| Video gagal | (diam, poster tetap tampil) |
| 404 | Halaman Tidak Ditemukan |

Gaya bahasa: "kami" untuk studio, "Anda" untuk pengunjung; kalimat pendek dan aktif; hindari jargon tanpa penjelasan.

---

## 8. Struktur Komponen

```
src/
  app/
    layout.tsx               # ThemeProvider, font, LenisProvider
    page.tsx
    @modal/(.)proyek/[slug]/page.tsx   # drawer
    @modal/default.tsx
    proyek/[slug]/page.tsx   # halaman penuh
    kebijakan-privasi/page.tsx
    not-found.tsx
    api/leads/route.ts
  components/
    ui/                      # shadcn
    brand/Logo.tsx           # pilih mark/full & normal/reversed sesuai tema
    motion/
      RollingText.tsx
      Reveal.tsx
      Magnetic.tsx
      CustomCursor.tsx
      LenisProvider.tsx
    sections/
      Header.tsx  Hero.tsx  Services.tsx  Showcase.tsx
      ProcessSteps.tsx  Pricing.tsx  CostEstimator.tsx
      Testimonials.tsx  Faq.tsx  Footer.tsx
    project/
      ProjectCard.tsx  ProjectDrawer.tsx  ProjectGallery.tsx
    three/
      DataGridCanvas.tsx
      shaders/
  lib/
    motion.ts
    pricing.ts               # formula, guard rules, harga paket (diuji)
    whatsapp.ts              # pembentuk URL & pesan
  data/
    site.ts  projects.ts
```

---

## 9. Performa

| Item | Batas |
| :--- | :--- |
| JS awal (gzip) | ≤ 130 KB (R3F & Lenis terpisah dari bundle awal) |
| Canvas | ≤ 30 KB kode/shader, tanpa tekstur |
| Font | Maks. 5 file, self-hosted via `next/font` |
| Video preview | ≤ 4 MB, 720p, `preload="none"` |
| Logo SVG | ≤ 8 KB per file |
| LCP | < 1,8 dtk; elemen LCP = headline hero |
| CLS | < 0,05 |
| INP | < 200 ms |

- `will-change` hanya selama animasi berjalan.
- Semua loop RAF (Lenis, Framer, kursor) memakai satu sumber frame.
- Audit Lighthouse di akhir setiap sprint.

---

## 10. Aksesibilitas

- `prefers-reduced-motion`: matikan canvas, Lenis, rolling text, marquee, magnetic, kursor kustom, count-up, dan tween total; pertahankan fade ≤ 150 ms.
- Ring fokus 2 px `--ring`, offset 2 px, di semua elemen interaktif.
- Keyboard: strip proyek (panah), filter, drawer (fokus terkunci, `Esc`), kalkulator (radio group dengan panah, checkbox dengan spasi), lightbox galeri.
- Kalkulator memakai `role="radiogroup"` / checkbox native; total di `aria-live="polite"`.
- Gambar bermakna punya `alt` deskriptif dari `projects.ts`; video dekoratif `aria-hidden`.
- Target sentuh ≥ 44×44 px.

---

## 11. Pemetaan ke Sprint PRD

| Sprint | Pekerjaan desain |
| :--- | :--- |
| 1 | Pasang file logo & buat favicon; tokens warna/tipografi/spacing; next-themes; LenisProvider; `RollingText`, `Reveal`, Header |
| 2 | `DataGridCanvas` + fallback, Hero Studio Console, kartu proyek, drawer intercepting route, halaman studi kasus, galeri |
| 3 | Kartu paket, `CostEstimator` (desktop & wizard mobile), guard rules + toast, animasi total, alur WhatsApp |
| 4 | Proses Kerja scroll-linked, testimoni, FAQ, CTA & footer, 404, kebijakan privasi, OG image, audit performa & aksesibilitas |

---

## 12. Checklist Sebelum Rilis

- [ ] Logo SVG tajam di kedua tema; favicon terbaca di tab browser
- [ ] Tidak ada kedipan tema saat load pertama
- [ ] Kontras AA lolos di tema gelap & terang (termasuk teks hijau)
- [ ] Canvas, Lenis, dan efek gerak mati pada reduced-motion
- [ ] Tidak ada layout shift saat font, gambar, atau video dimuat
- [ ] Harga di kartu paket = hasil kalkulator untuk konfigurasi minimumnya
- [ ] Ketiga guard rule & penggantian otomatis bekerja, pesan alasan terbaca di mobile
- [ ] Klik WhatsApp langsung membuka chat; lead masuk DB & Telegram
- [ ] Drawer → refresh menampilkan halaman studi kasus penuh
- [ ] Lighthouse ≥ 90 desktop & mobile di `/` dan `/proyek/[slug]`
- [ ] Tidak ada aset, teks, atau angka yang disalin dari situs referensi
