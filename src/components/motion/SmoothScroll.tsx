"use client";

import { useEffect } from "react";

/**
 * Lenis (DESIGN.md §5.4), dimuat terpisah setelah halaman interaktif. Tidak aktif
 * di perangkat sentuh dan reduced-motion. Elemen yang punya scroll sendiri (menu,
 * drawer) diberi atribut `data-lenis-prevent`. Offset anchor diambil Lenis dari
 * scroll-padding-top di globals.css.
 *
 * ponytail: Lenis memakai RAF sendiri (autoRaf), bukan frame.update motion seperti
 * DESIGN.md §5.4, agar motion tidak masuk bundle awal. Loop motion hanya berjalan
 * selama ada animasi, jadi dua loop jarang aktif bersamaan.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let destroy: (() => void) | undefined;

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const lenis = new Lenis({
        autoRaf: true,
        lerp: 0.1,
        smoothWheel: true,
        anchors: true,
      });
      destroy = () => lenis.destroy();
    });

    return () => {
      cancelled = true;
      destroy?.();
    };
  }, []);

  useEffect(() => {
    // Link "/#id" di halaman yang sama lewat history.pushState (yang di-patch Next),
    // bukan navigasi hash native. Entri native tidak punya state router, sehingga
    // tombol back ke sana diabaikan Next (app-router handlePopState) dan drawer
    // proyek tertinggal terbuka di atas halaman yang inert.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      const link = (e.target as Element).closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement) || link.target) return;
      const url = new URL(link.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;

      e.preventDefault();
      if (url.hash !== location.hash) history.pushState(null, "", url.hash);
      // Lenis aktif menggulir sendiri lewat opsi `anchors`; tanpa Lenis, gulir native.
      if (!document.documentElement.classList.contains("lenis")) {
        const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
        target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      }
      // Pindahkan fokus agar Tab berikutnya mulai dari target (link "Lewati ke konten").
      if (target.hasAttribute("tabindex")) target.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
