import type { Metadata } from "next";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description:
    "Data apa yang dicatat kalkulator estimasi Kemal Office Studio, untuk apa, dan berapa lama.",
  alternates: { canonical: "/kebijakan-privasi" },
};

/** PRD §8.4, DESIGN.md §6.11. Isi harus tetap sesuai perilaku /api/leads. */
export default function PrivacyPage() {
  return (
    <main id="konten" tabIndex={-1} className="container-page pt-12 pb-section lg:pt-16">
      <article className="max-w-[68ch] [&_h2]:mt-10 [&_h2]:font-semibold [&_h2]:text-title [&_li]:mt-2 [&_p]:mt-4 [&_p]:text-fg-muted [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-fg-muted">
        <p className="font-mono text-label uppercase">Berlaku sejak 9 Oktober 2026</p>
        <h1 className="mt-4 font-bold text-display-l">Kebijakan Privasi</h1>
        <p>
          Situs ini tidak memakai cookie pelacak, iklan, atau analitik pihak ketiga. Satu-satunya
          data yang kami catat berasal dari kalkulator estimasi, saat Anda menekan tombol konsultasi
          via WhatsApp.
        </p>

        <h2>Data yang dicatat</h2>
        <ul>
          <li>Pilihan di kalkulator: tipe proyek, gaya visual, backend, add-on, dan timeline.</li>
          <li>Estimasi harga yang dihitung server dari pilihan tersebut.</li>
          <li>
            Hash alamat IP: alamat IP Anda diubah dengan fungsi SHA-256 dan kunci rahasia. Alamat IP
            aslinya tidak pernah disimpan.
          </li>
          <li>Waktu tombol ditekan.</li>
        </ul>
        <p>
          Kami tidak mencatat nama, nomor telepon, email, atau isi percakapan dari kalkulator. Data
          di atas tidak terhubung dengan identitas Anda.
        </p>

        <h2>Untuk apa</h2>
        <ul>
          <li>Memahami jenis proyek yang diminati calon klien (analitik minat).</li>
          <li>
            Membatasi pengiriman berulang: paling banyak 5 catatan per alamat IP dalam 10 menit.
          </li>
          <li>
            Memberi tahu tim kami lewat grup Telegram internal (berisi pilihan dan estimasi, tanpa
            hash IP).
          </li>
        </ul>
        <p>
          Data tidak dijual, tidak dibagikan untuk iklan, dan tidak dipakai untuk menghubungi Anda.
        </p>

        <h2>Penyimpanan dan masa simpan</h2>
        <p>
          Data disimpan di layanan database Turso dengan server di Amerika Serikat, dan situs ini
          berjalan di Vercel. Setiap catatan dihapus otomatis setelah 12 bulan.
        </p>

        <h2>WhatsApp</h2>
        <p>
          Percakapan yang Anda mulai setelah menekan tombol WhatsApp berlangsung di aplikasi
          WhatsApp dan tunduk pada kebijakan privasi WhatsApp. Isi pesan awalnya berasal dari
          pilihan kalkulator dan bisa Anda ubah sebelum dikirim.
        </p>

        <h2>Penyimpanan di browser</h2>
        <p>
          Pilihan tema terang atau gelap disimpan di browser Anda (localStorage) dan tidak dikirim
          ke server kami.
        </p>

        <h2>Dasar dan kontak</h2>
        <p>
          Kebijakan ini disusun mengikuti prinsip Undang-Undang Nomor 27 Tahun 2022 tentang
          Pelindungan Data Pribadi. Pertanyaan tentang data Anda dapat dikirim ke{" "}
          <a href={`mailto:${site.email}`} className="rounded-sm text-accent hover:underline">
            {site.email}
          </a>
          .
        </p>
      </article>
    </main>
  );
}
