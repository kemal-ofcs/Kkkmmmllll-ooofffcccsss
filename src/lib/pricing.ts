// Satu-satunya sumber angka harga (PRD §5.5.A). Dipakai kalkulator, daftar paket,
// pesan WhatsApp, dan server (/api/leads menghitung ulang; harga dari klien diabaikan).

export const scopes = {
  landing: { label: "Landing Page", short: "Landing Page", price: 2_500_000 },
  webapp: { label: "Web App / MVP Dinamis", short: "Web App", price: 5_500_000 },
  internal: { label: "Sistem Internal / Dashboard", short: "Sistem Internal", price: 8_000_000 },
} as const;

// Label berbahasa awam untuk founder & UMKM; nama teknologi di `note` (audit antislop 003).
export const visuals = {
  minimal: { label: "Bersih & Minimalis", short: "Minimalis", price: 0, note: undefined },
  motion: {
    label: "Animasi interaktif",
    short: "Animasi interaktif",
    price: 1_000_000,
    note: "Framer Motion",
  },
  three: { label: "Tampilan 3D interaktif", short: "Tampilan 3D", price: 2_000_000, note: "WebGL" },
} as const;

export const backends = {
  none: { label: "Tanpa database", short: "Tanpa database", price: 0, note: "halaman statis" },
  db: {
    label: "Data tersimpan online",
    short: "Data online",
    price: 1_500_000,
    note: "tambah, ubah, hapus data",
  },
  multirole: {
    label: "Login per peran + ekspor laporan",
    short: "Login per peran",
    price: 3_000_000,
    note: "sudah termasuk database",
  },
} as const;

export const addons = {
  payment: {
    label: "Pembayaran online",
    short: "Pembayaran online",
    price: 1_500_000,
    note: "Midtrans / Xendit",
  },
  bilingual: {
    label: "Dua bahasa",
    short: "Dua bahasa",
    price: 800_000,
    note: "Indonesia & Inggris",
  },
} as const;

// Pengali disimpan sebagai persen bulat agar perhitungan tetap integer (tanpa galat float).
export const timelines = {
  standard: { label: "Standar (3–4 minggu)", short: "Standar", percent: 100 },
  priority: { label: "Priority Sprint (1–2 minggu)", short: "Priority Sprint", percent: 125 },
} as const;

export type Scope = keyof typeof scopes;
export type Visual = keyof typeof visuals;
export type Backend = keyof typeof backends;
export type Addon = keyof typeof addons;
export type Timeline = keyof typeof timelines;

export interface Config {
  scope: Scope;
  visual: Visual;
  backend: Backend;
  addons: Addon[];
  timeline: Timeline;
}

export const defaultConfig: Config = {
  scope: "landing",
  visual: "minimal",
  backend: "none",
  addons: [],
  timeline: "standard",
};

const ROUND_TO = 100_000;

/** total = ceil(subtotal × timeline / 100.000) × 100.000 (PRD §5.5.B). */
export function estimate(config: Config) {
  const lines = [
    { label: scopes[config.scope].label, amount: scopes[config.scope].price },
    { label: visuals[config.visual].label, amount: visuals[config.visual].price },
    { label: backends[config.backend].label, amount: backends[config.backend].price },
    ...config.addons.map((a) => ({ label: addons[a].label, amount: addons[a].price })),
  ];
  const subtotal = lines.reduce((sum, l) => sum + l.amount, 0);
  const percent = timelines[config.timeline].percent;
  const total = Math.ceil((subtotal * percent) / 100 / ROUND_TO) * ROUND_TO;
  return { lines, subtotal, percent, total };
}

// --- Guard rules (PRD §5.5.D) ---

export const reasons = {
  G1: "Tidak tersedia untuk landing page",
  G2: "Butuh database",
  G3: "Aplikasi dinamis butuh database",
} as const;

/** Alasan sebuah opsi nonaktif untuk konfigurasi ini, atau null bila boleh dipilih. */
export function disabledReason(
  config: Pick<Config, "scope" | "backend">,
  option: { backend: Backend } | { addon: Addon },
): string | null {
  if ("backend" in option) {
    if (option.backend === "multirole" && config.scope === "landing") return reasons.G1;
    if (option.backend === "none" && config.scope !== "landing") return reasons.G3;
    return null;
  }
  if (option.addon === "payment" && config.backend === "none") return reasons.G2;
  return null;
}

/**
 * Ganti opsi yang jadi tidak valid ke opsi valid terdekat (atau lepas add-on),
 * lengkap dengan pemberitahuan untuk pengguna (PRD §5.5.D).
 */
export function normalize(config: Config): { config: Config; notices: string[] } {
  const next = { ...config, addons: [...config.addons] };
  const notices: string[] = [];

  if (disabledReason(next, { backend: next.backend })) {
    const from = next.backend;
    next.backend = "db";
    notices.push(
      from === "multirole"
        ? "Login per peran diganti Data tersimpan online karena tidak tersedia untuk landing page."
        : "Data tersimpan online dipilih karena aplikasi dinamis butuh database.",
    );
  }
  if (next.addons.includes("payment") && disabledReason(next, { addon: "payment" })) {
    next.addons = next.addons.filter((a) => a !== "payment");
    notices.push("Pembayaran online dilepas karena butuh database.");
  }
  return { config: next, notices };
}

// --- Paket (PRD §5.5.C): harga "mulai dari" dihitung dari konfigurasi minimumnya ---

const pkg = (scope: Scope, backend: Backend): Config => ({ ...defaultConfig, scope, backend });

export const packages = [
  {
    id: "starter",
    name: "Starter",
    description: "Landing page statis untuk memperkenalkan bisnis Anda.",
    config: pkg("landing", "none"),
  },
  {
    id: "growth",
    name: "Growth",
    description: "Web app atau MVP dengan data tersimpan di database cloud.",
    config: pkg("webapp", "db"),
  },
  {
    id: "bespoke",
    name: "Bespoke",
    description: "Sistem internal dengan banyak peran pengguna dan laporan yang bisa diekspor.",
    config: pkg("internal", "multirole"),
  },
].map((p) => ({
  ...p,
  price: estimate(p.config).total,
  // Dua fitur pembeda saja; gaya visual minimum sama di semua paket (audit antislop 003).
  features: [scopes[p.config.scope].label, backends[p.config.backend].label],
}));

export const formatRupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;
