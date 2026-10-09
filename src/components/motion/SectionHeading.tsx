"use client";

import { Fragment, useEffect, useRef } from "react";

/**
 * Label + judul section (DESIGN.md §5.5): judul muncul per baris dari balik mask.
 * Baris dihitung dari posisi kata saat mount, jadi tetap benar di layar sempit.
 */
export function SectionHeading({ label, title }: { label: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let line = -1;
    let top = Number.NEGATIVE_INFINITY;
    for (const word of el.querySelectorAll<HTMLElement>(".heading-word")) {
      if (word.offsetTop > top + 2) {
        line++;
        top = word.offsetTop;
      }
      word.style.setProperty("--line", String(line));
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.shown = "";
        io.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-heading>
      <p className="font-mono text-accent text-label uppercase">{label}</p>
      <h2 className="mt-4 max-w-3xl font-bold text-display-l">
        {title.split(" ").map((word, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: kata statis, urutan tidak berubah
          <Fragment key={i}>
            <span className="heading-word">
              <span>{word}</span>
            </span>{" "}
          </Fragment>
        ))}
      </h2>
    </div>
  );
}
