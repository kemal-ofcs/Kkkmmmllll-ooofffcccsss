"use client";

import { useEffect, useRef, useState } from "react";

type Nav = Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };

/**
 * Latar hero (DESIGN.md §5.2). Fallback CSS selalu ada; canvas Data Grid dimuat
 * saat browser idle dan hanya bila perangkat mampu, lalu masuk dengan fade 600 ms.
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
    const start = () =>
      import("./data-grid").then(({ startDataGrid }) => {
        if (cancelled || !canvas.current) return;
        stop = startDataGrid(canvas.current, () => setOn(true));
      });
    // Safari belum punya requestIdleCallback; tipe DOM menganggapnya selalu ada.
    const w: Partial<Pick<Window, "requestIdleCallback" | "cancelIdleCallback">> = window;
    const idle = w.requestIdleCallback
      ? w.requestIdleCallback(start)
      : window.setTimeout(start, 1200);

    return () => {
      cancelled = true;
      if (w.cancelIdleCallback) w.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
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
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-bg" />
    </div>
  );
}
