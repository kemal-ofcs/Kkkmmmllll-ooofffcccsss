import {
  addons,
  backends,
  type Config,
  estimate,
  formatRupiah,
  scopes,
  timelines,
  visuals,
} from "./pricing";

const waBase = (number: string) => `https://wa.me/${number}`;

/** Pesan estimasi dari kalkulator (PRD §5.5.G). */
export function estimateMessage(config: Config) {
  const chosen = config.addons.map((a) => addons[a].short).join(", ") || "Tidak ada";
  return [
    "Halo Kemal Office Studio! Saya tertarik konsultasi proyek baru dengan estimasi dari kalkulator website:",
    "",
    `• Tipe Proyek: ${scopes[config.scope].label}`,
    `• Gaya Visual: ${visuals[config.visual].label}`,
    `• Data & Backend: ${backends[config.backend].label}`,
    `• Add-ons: ${chosen}`,
    `• Timeline: ${timelines[config.timeline].short}`,
    `• Estimasi Biaya: ${formatRupiah(estimate(config).total)}`,
    "",
    "Apakah ada waktu untuk diskusi lebih lanjut?",
  ].join("\n");
}

export const estimateUrl = (number: string, config: Config) =>
  `${waBase(number)}?text=${encodeURIComponent(estimateMessage(config))}`;

/** Pesan umum tanpa estimasi (CTA penutup, PRD §5.8). */
export const generalUrl = (number: string) =>
  `${waBase(number)}?text=${encodeURIComponent("Halo Kemal Office Studio! Saya ingin diskusi proyek baru.")}`;
