"use client";

import { useEffect, useRef } from "react";

/**
 * Reveal default DESIGN.md §5.5, tanpa library: CSS [data-reveal] di globals.css
 * + IntersectionObserver, sekali saja. Jangan dipakai pada headline hero (elemen LCP).
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // rootMargin, bukan threshold: elemen yang lebih tinggi dari layar tetap terpicu.
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
    <div
      ref={ref}
      data-reveal
      className={className}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
