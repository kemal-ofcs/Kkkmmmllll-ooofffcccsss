"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Picture, type PictureData } from "@/components/Picture";

export type StripItem = { slug: string; title: string; category: string; picture: PictureData };

const COPIES = 5; // satu salinan ± 900 px; perlu 1 salinan + lebar layar 2560 px
const LOOP_SECONDS = 30;

/**
 * Strip proyek di hero (DESIGN.md §5.3): marquee pelan yang bisa digeser.
 * Scroll horizontal native (inersia sentuh & trackpad gratis) + geser mouse.
 * Berhenti saat hover, fokus, digeser, di luar layar, atau reduced-motion.
 */
export function ProjectStrip({ items }: { items: StripItem[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const setWidth = () => el.scrollWidth / COPIES;
    let paused = false;
    let visible = true;
    let raf = 0;
    let last = 0;
    // Posisi dijaga di [0, lebar satu salinan): isinya identik, jadi lompatannya tak terlihat.
    let pos = 0;
    let drag: { x: number; left: number } | null = null;
    let dragged = false;

    const tick = (now: number) => {
      const dt = last ? (now - last) / 1000 : 0;
      last = now;
      const width = setWidth();
      if (!paused && visible && !reduce) {
        pos = (pos + (width / LOOP_SECONDS) * dt) % width;
        el.scrollLeft = pos;
      } else {
        pos = el.scrollLeft;
      }
      raf = requestAnimationFrame(tick);
    };
    // Marquee mulai setelah interaksi pertama: tidak ada kerja per frame selama halaman dimuat.
    const begin = () => {
      for (const e of starters) window.removeEventListener(e, begin);
      raf = requestAnimationFrame(tick);
    };
    const starters = ["pointermove", "pointerdown", "keydown", "scroll", "touchstart"] as const;
    for (const e of starters) window.addEventListener(e, begin, { passive: true });

    // Geser manual melewati satu salinan: lompat balik agar tak pernah habis.
    const onScroll = () => {
      if (!paused) return;
      const width = setWidth();
      let shift = 0;
      if (el.scrollLeft >= width) shift = -width;
      else if (el.scrollLeft <= 0) shift = width;
      if (!shift) return;
      el.scrollLeft += shift;
      if (drag) drag.left += shift;
    };

    // Geser dengan mouse; klik dibatalkan bila sempat bergeser.
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      drag = { x: e.clientX, left: el.scrollLeft };
      dragged = false;
    };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (Math.abs(dx) > 5) dragged = true;
      if (dragged) el.scrollLeft = drag.left - dx;
    };
    const up = () => {
      drag = null;
    };
    const click = (e: MouseEvent) => {
      if (dragged) {
        e.preventDefault();
        e.stopPropagation();
        dragged = false;
      }
    };
    const pause = () => {
      paused = true;
    };
    const resume = () => {
      if (!el.matches(":hover, :focus-within")) paused = false;
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(el);

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    el.addEventListener("click", click, true);
    el.addEventListener("pointerenter", pause);
    el.addEventListener("pointerleave", resume);
    el.addEventListener("focusin", pause);
    el.addEventListener("focusout", resume);
    el.addEventListener("touchstart", pause, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      for (const e of starters) window.removeEventListener(e, begin);
      io.disconnect();
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      el.removeEventListener("click", click, true);
      el.removeEventListener("pointerenter", pause);
      el.removeEventListener("pointerleave", resume);
      el.removeEventListener("focusin", pause);
      el.removeEventListener("focusout", resume);
      el.removeEventListener("touchstart", pause);
    };
  }, []);

  return (
    <section
      ref={ref}
      aria-label="Strip proyek"
      className="project-strip flex cursor-grab overflow-x-auto active:cursor-grabbing"
    >
      {Array.from({ length: COPIES }, (_, copy) =>
        items.map((p) => (
          <Link
            // biome-ignore lint/suspicious/noArrayIndexKey: salinan marquee statis
            key={`${copy}-${p.slug}`}
            href={`/proyek/${p.slug}`}
            scroll={false}
            draggable={false}
            // Salinan kedua dst. hanya visual: disembunyikan dari pembaca layar & Tab.
            aria-hidden={copy > 0 || undefined}
            tabIndex={copy > 0 ? -1 : undefined}
            className="group mr-4 w-64 shrink-0 rounded-md sm:w-72"
          >
            <div className="relative aspect-16/10 overflow-hidden rounded-md border border-border bg-surface-2">
              <Picture
                // salinan visual: alt kosong agar tidak dibacakan ulang
                data={
                  copy > 0 ? { ...p.picture, props: { ...p.picture.props, alt: "" } } : p.picture
                }
                className="transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <p className="mt-3 flex flex-col gap-1">
              <span className="truncate font-medium text-sm">{p.title}</span>
              <span className="font-mono text-fg-muted text-label uppercase">{p.category}</span>
            </p>
          </Link>
        )),
      )}
    </section>
  );
}
