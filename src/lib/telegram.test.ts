import { describe, expect, it } from "vitest";
import { defaultConfig } from "./pricing";
import { leadMessage } from "./telegram";

describe("pesan Telegram (PRD §5.5.G)", () => {
  it("format sesuai PRD, jam dalam WIB", () => {
    const at = new Date("2026-10-08T12:20:00Z"); // 19.20 WIB
    const msg = leadMessage(
      {
        scope: "webapp",
        visual: "motion",
        backend: "db",
        addons: ["payment"],
        timeline: "priority",
      },
      11_900_000,
      at,
    );
    expect(msg).toBe(
      [
        "🆕 Lead baru — Rp 11.900.000",
        "Web App · Animasi interaktif · Data online",
        "Add-ons: Pembayaran online",
        "Timeline: Priority Sprint",
        "08 Okt 2026, 19.20 WIB",
      ].join("\n"),
    );
  });

  it("tanpa add-on ditulis 'Tidak ada'", () => {
    expect(leadMessage(defaultConfig, 2_500_000, new Date())).toContain("Add-ons: Tidak ada");
  });
});
