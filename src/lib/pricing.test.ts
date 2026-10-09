import { describe, expect, it } from "vitest";
import {
  type Config,
  defaultConfig,
  disabledReason,
  estimate,
  formatRupiah,
  normalize,
  packages,
  reasons,
} from "./pricing";
import { estimateMessage, estimateUrl } from "./whatsapp";

const cfg = (c: Partial<Config>): Config => ({ ...defaultConfig, ...c });

describe("estimate (PRD §5.5.B)", () => {
  it("contoh uji PRD: Web App + Framer Motion + Database Cloud + Payment + Priority = Rp 11.900.000", () => {
    const r = estimate(
      cfg({
        scope: "webapp",
        visual: "motion",
        backend: "db",
        addons: ["payment"],
        timeline: "priority",
      }),
    );
    expect(r.subtotal).toBe(9_500_000);
    expect(r.total).toBe(11_900_000);
  });

  it("nilai default = Rp 2.500.000", () => {
    expect(estimate(defaultConfig).total).toBe(2_500_000);
  });

  it("membulatkan ke atas per Rp 100.000", () => {
    // 2.500.000 + 800.000 = 3.300.000 × 1,25 = 4.125.000 -> 4.200.000
    expect(estimate(cfg({ addons: ["bilingual"], timeline: "priority" })).total).toBe(4_200_000);
  });

  it("tidak membulatkan angka yang sudah kelipatan Rp 100.000", () => {
    expect(estimate(cfg({ addons: ["bilingual"] })).total).toBe(3_300_000);
  });
});

describe("paket (PRD §5.5.C): harga = hasil kalkulator untuk konfigurasi minimumnya", () => {
  const price = (id: string) => packages.find((p) => p.id === id)?.price;
  it("Starter mulai Rp 2.500.000", () => expect(price("starter")).toBe(2_500_000));
  it("Growth mulai Rp 7.000.000", () => expect(price("growth")).toBe(7_000_000));
  it("Bespoke mulai Rp 11.000.000", () => expect(price("bespoke")).toBe(11_000_000));
  it("setiap paket sama dengan estimate() konfigurasinya", () => {
    for (const p of packages) expect(p.price).toBe(estimate(p.config).total);
  });
  it("konfigurasi paket sudah valid (tidak diubah normalize)", () => {
    for (const p of packages) expect(normalize(p.config).notices).toEqual([]);
  });
});

describe("guard rules (PRD §5.5.D)", () => {
  it("G1: Multi-role nonaktif untuk Landing Page", () => {
    expect(disabledReason(cfg({ scope: "landing" }), { backend: "multirole" })).toBe(reasons.G1);
    expect(disabledReason(cfg({ scope: "webapp" }), { backend: "multirole" })).toBeNull();
  });

  it("G2: Payment Gateway nonaktif tanpa database", () => {
    expect(disabledReason(cfg({ backend: "none" }), { addon: "payment" })).toBe(reasons.G2);
    expect(disabledReason(cfg({ backend: "db" }), { addon: "payment" })).toBeNull();
    expect(disabledReason(cfg({ backend: "none" }), { addon: "bilingual" })).toBeNull();
  });

  it("G3: Tanpa Database nonaktif untuk Web App dan Sistem Internal", () => {
    expect(disabledReason(cfg({ scope: "webapp" }), { backend: "none" })).toBe(reasons.G3);
    expect(disabledReason(cfg({ scope: "internal" }), { backend: "none" })).toBe(reasons.G3);
    expect(disabledReason(cfg({ scope: "landing" }), { backend: "none" })).toBeNull();
  });
});

describe("normalize: penggantian otomatis (PRD §5.5.D)", () => {
  it("G1: Landing Page + Login per peran -> Data tersimpan online, dengan pemberitahuan", () => {
    const r = normalize(cfg({ scope: "landing", backend: "multirole" }));
    expect(r.config.backend).toBe("db");
    expect(r.notices).toHaveLength(1);
  });

  it("G2: Tanpa database + Pembayaran online -> dilepas", () => {
    const r = normalize(cfg({ backend: "none", addons: ["payment", "bilingual"] }));
    expect(r.config.addons).toEqual(["bilingual"]);
    expect(r.notices).toEqual(["Pembayaran online dilepas karena butuh database."]);
  });

  it("G3: Web App + Tanpa database -> Data tersimpan online", () => {
    const r = normalize(cfg({ scope: "webapp", backend: "none" }));
    expect(r.config.backend).toBe("db");
    expect(r.notices).toEqual([
      "Data tersimpan online dipilih karena aplikasi dinamis butuh database.",
    ]);
  });

  it("G3 lalu G2 tidak bertabrakan: Payment tetap ada karena backend jadi Database Cloud", () => {
    const r = normalize(cfg({ scope: "internal", backend: "none", addons: ["payment"] }));
    expect(r.config).toMatchObject({ backend: "db", addons: ["payment"] });
  });

  it("konfigurasi valid tidak diubah dan tidak memunculkan pemberitahuan", () => {
    const valid = cfg({ scope: "webapp", backend: "db", addons: ["payment"] });
    expect(normalize(valid)).toEqual({ config: valid, notices: [] });
  });

  it("tidak memutasi objek asli", () => {
    const original = cfg({ backend: "none", addons: ["payment"] });
    normalize(original);
    expect(original.addons).toEqual(["payment"]);
  });
});

describe("WhatsApp (PRD §5.5.G)", () => {
  const config = cfg({
    scope: "webapp",
    visual: "motion",
    backend: "db",
    addons: ["payment"],
    timeline: "priority",
  });

  it("pesan memuat estimasi yang sama dengan kalkulator", () => {
    const msg = estimateMessage(config);
    expect(msg).toContain("• Tipe Proyek: Web App / MVP Dinamis");
    expect(msg).toContain("• Add-ons: Pembayaran online");
    expect(msg).toContain("• Timeline: Priority Sprint");
    expect(msg).toContain(`• Estimasi Biaya: ${formatRupiah(11_900_000)}`);
    expect(formatRupiah(11_900_000)).toBe("Rp 11.900.000");
  });

  it("tanpa add-on ditulis 'Tidak ada'", () => {
    expect(estimateMessage(defaultConfig)).toContain("• Add-ons: Tidak ada");
  });

  it("URL wa.me memakai nomor tanpa + dan teks ter-encode", () => {
    const url = new URL(estimateUrl("6285846153092", config));
    expect(url.origin + url.pathname).toBe("https://wa.me/6285846153092");
    expect(url.searchParams.get("text")).toBe(estimateMessage(config));
  });
});
