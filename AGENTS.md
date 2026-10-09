<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Kemal Office Studio — Portfolio

Situs portofolio + kalkulator estimasi harga + pencatatan lead via WhatsApp.

## Sumber kebenaran

- `prd-portofolio.md` — fitur, data, acceptance criteria, roadmap sprint.
- `DESIGN.md` — token, tipografi, efek, desain per section, microcopy.
- Bila kode bertentangan dengan dua dokumen itu, dokumennya yang benar. Bila dokumennya ambigu atau saling bertentangan, tanya dulu, jangan menebak.

## Stack (versi terpasang)

Next.js 16.4 (App Router, `cacheComponents: true`) · React 19.3 · Tailwind CSS 4 · shadcn/ui (Radix, preset Nova) · next-themes · `motion` (dulu framer-motion; import dari `motion/react`) · Lenis · three + @react-three/fiber · Drizzle ORM + Turso (`drizzle-orm/libsql/http`) · Zod 4 · Vitest · Playwright · Biome (lint + format, menggantikan ESLint/Prettier di PRD §8.5). Package manager: **bun**.

Hook `.claude/hooks/biome-format.sh` memformat setiap file yang ditulis/diedit Claude. Biome tidak mengurutkan class Tailwind (rule-nya masih eksperimental), jadi tulis class dengan urutan rapi secara manual.

## Perintah

```bash
bun dev               # dev server
bun run check         # biome check + typecheck + unit test (wajib lulus sebelum selesai)
bun run format        # biome check --write (format + organize imports + fix aman)
bun run test:e2e      # build + smoke test Playwright (port 3100). Di Windows, shutdown server oleh
                      # Playwright bisa lambat; jalankan `bun run start --port 3100` di terminal lain
                      # lalu `bunx playwright test` (server dipakai ulang).
bun run db:generate   # buat migrasi dari src/db/schema.ts
bun run db:migrate    # jalankan migrasi ke Turso (butuh .env.local)
```

## Aturan proyek

- **Bahasa:** semua teks UI Bahasa Indonesia; "kami" untuk studio, "Anda" untuk pengunjung (DESIGN.md §7). Kode & nama variabel boleh Inggris.
- **Harga:** semua angka harga hanya berasal dari `src/lib/pricing.ts`. Kartu paket, kalkulator, pesan WA, dan server menghitung dari fungsi yang sama. Server selalu menghitung ulang; harga dari klien diabaikan.
- **Konten:** proyek di `src/data/projects.ts`, teks/kontak/FAQ/testimoni di `src/data/site.ts`. Jangan mengarang metrik, testimoni, atau statistik. Section kosong tidak dirender.
- **Token warna:** pakai nama DESIGN.md lewat utilitas Tailwind: `bg-bg`, `bg-surface`, `bg-surface-2`, `text-fg`, `text-fg-muted`, `text-accent`, `bg-accent-bg`, `bg-accent-soft`, `text-green`, `border-border`. Jangan hardcode hex di komponen.
- **Bentrok nama shadcn:** `accent` di proyek ini = biru teks/ikon (DESIGN.md), bukan latar hover abu-abu shadcn. Setiap kali `bunx shadcn add`, ganti `bg-accent`/`focus:bg-accent` di komponen baru menjadi `bg-accent-soft` dan `text-accent-foreground` menjadi `text-fg`.
- **Tema:** next-themes dengan `attribute="data-theme"`, default gelap. Varian `dark:` sudah dipetakan ke `[data-theme="dark"]`. Elemen yang beda per tema (logo, ikon) dirender keduanya lalu disembunyikan dengan `dark:hidden` / `hidden dark:block`, bukan dengan `useTheme()` saat render.
- **Tipografi:** `font-heading` (Plus Jakarta Sans) untuk judul, `font-sans` (Inter) untuk body, `font-mono text-label uppercase` untuk label. Skala: `text-display-xl`, `text-display-l`, `text-title`, `text-body-l`, `text-label`. Harga pakai `tabular-nums`.
- **Layout:** `container-page` untuk lebar 1280 px + gutter; `py-section` untuk jarak antar section; radius `rounded-sm|md|lg|pill`.
- **Motion:** easing & durasi dari `src/lib/motion.ts`. Animasikan hanya `transform` dan `opacity`. Setiap efek harus punya jalur `prefers-reduced-motion` (DESIGN.md §10).
- **Performa:** JS awal ≤ 130 KB gzip; R3F dan Lenis dimuat terpisah (`next/dynamic`), bukan di bundle awal. Headline hero = elemen LCP.
- **Server:** `src/db` hanya diimport dari kode server (`server-only`).
- **Logo:** SVG di `public/brand/`, PNG sumber di `kos-logo/`. Tema gelap wajib versi reversed. Pakai komponen `Logo`. Favicon: `src/app/icon.svg` (awan "O" + grid 2×2) dan `src/app/apple-icon.png`.
- **Kontak:** nomor WA dari `NEXT_PUBLIC_WA_NUMBER`; email & sosial di `site.ts` (sumber: linktr.ee/kemalofficestudio).

## Skill (di `.claude/skills/`)

- `antislop` (core) + `antislop-ui`, `antislop-copywriting`, `antislop-human` (berisi `contrast-check.py`), `antislop-layoutmobile`, `antislop-code` — wajib dimuat sebelum mengerjakan UI, copy, aksesibilitas, layout mobile, atau komentar kode.
- `ponytail` (+ `ponytail-review`, `ponytail-audit`, `ponytail-debt`) — solusi paling sederhana yang benar. Aturannya di `.claude/skills/ponytail/RULES.md`.
- `find-docs` — dokumentasi library terkini via Context7 CLI (`npx ctx7@latest`). Untuk Next.js, baca `node_modules/next/dist/docs/` lebih dulu.

<!-- antislop:start -->
## antislop
For UI, copy, people, mobile layout, or code comments work, read `.claude/skills/antislop/SKILL.md` (core) and then the skill for the task:
- UI / visual: `.claude/skills/antislop-ui/SKILL.md`
- Copy & text: `.claude/skills/antislop-copywriting/SKILL.md`
- People: `.claude/skills/antislop-human/SKILL.md`
- Mobile / responsive: `.claude/skills/antislop-layoutmobile/SKILL.md`
- Code comments: `.claude/skills/antislop-code/SKILL.md`

Direction: `DESIGN.md` (ditulis oleh pemilik proyek).

Kapan diterapkan: **setelah pekerjaan selesai** (keputusan pemilik proyek, 2026-10-09). Bangun dulu sesuai DESIGN.md, lalu jalankan pass antislop pada hasilnya sebelum melapor selesai.
<!-- antislop:end -->

<!-- ponytail:start -->
## ponytail
Kerjakan dengan solusi paling sederhana yang benar: YAGNI, pakai yang sudah ada, standard library & fitur platform sebelum dependensi baru. Baca `.claude/skills/ponytail/RULES.md`.
<!-- ponytail:end -->
