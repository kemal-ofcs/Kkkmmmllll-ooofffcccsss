"use client";

import { useEffect, useRef, useState } from "react";

type Nav = Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };

/**
 * Latar hero (DESIGN.md §5.2). Fallback CSS selalu ada; canvas Data Grid dimuat
 * setelah interaksi pertama dan hanya bila perangkat mampu, lalu masuk dengan fade 600 ms.
 * Interaksi, bukan idle: shader + loop render tidak boleh menyita main thread saat
 * halaman dimuat (terukur 2,4 dtk TBT di Lighthouse mobile, 2026-10-09).
 */
export function HeroCanvas() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const nav = navigator as Nav;
    const skip =
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      nav.connection?.saveData ||
      (nav.deviceMemory !== undefined && nav.deviceMemory <= 4);
    if (skip) return;

    let cancelled = false;
    let stop: (() => void) | null = null;
    const events = ["pointermove", "pointerdown", "keydown", "scroll", "touchstart"] as const;
    const start = () => {
      for (const e of events) window.removeEventListener(e, start);
      import("./data-grid").then(({ startDataGrid }) => {
        if (cancelled || !canvas.current) return;
        stop = startDataGrid(canvas.current, () => setOn(true));
      });
    };
    for (const e of events) window.addEventListener(e, start, { passive: true });

    return () => {
      cancelled = true;
      for (const e of events) window.removeEventListener(e, start);
      stop?.();
    };
  }, []);

  return (
    <div aria-hidden className="-z-10 pointer-events-none absolute inset-0 overflow-hidden">
      <div className="hero-glow absolute inset-0" />
      <div
        data-off={on}
        className="hero-grid absolute inset-0 transition-opacity duration-700 data-[off=true]:opacity-0"
      />
      <canvas
        ref={canvas}
        data-on={on}
        className="absolute inset-0 size-full opacity-0 transition-opacity duration-600 data-[on=true]:opacity-100"
      />
      {/* Scrim di belakang kolom teks: sel yang menyala tidak menurunkan kontras subteks
          di bawah AA (terburuk 6,2:1). Mobile tanpa kursor cukup diredam merata. */}
      <div className="absolute inset-0 bg-bg/60 lg:bg-transparent lg:bg-linear-to-r lg:from-bg/75 lg:via-70% lg:via-bg/75 lg:to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-bg" />
    </div>
  );
}
