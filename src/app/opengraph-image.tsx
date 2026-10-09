import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/data/site";

// Gambar pratinjau tautan (PRD §8.2). Halaman proyek memakai cover proyeknya sendiri.
export const alt = `${site.name} · ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const logo = `data:image/svg+xml;base64,${await readFile(join(process.cwd(), "public/brand/logo-mark-reversed.svg"), "base64")}`;

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: "linear-gradient(135deg, #0C182C 0%, #070E1B 60%)",
        color: "#EEF3FA",
      }}
    >
      {/* biome-ignore lint/performance/noImgElement: Satori (next/og) hanya mengenal <img> */}
      <img src={logo} width={202} height={101} alt="" />
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -2,
          }}
        >
          Software Kustom untuk Bisnis yang Sedang Bertumbuh.
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "#8FA3BF" }}>
          {site.name} · Web App, Sistem Internal, Dashboard
        </div>
      </div>
    </div>,
    size,
  );
}
