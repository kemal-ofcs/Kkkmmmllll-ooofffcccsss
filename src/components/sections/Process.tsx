"use client";

import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { site } from "@/data/site";
import { cx } from "@/lib/cx";

type Kind = (typeof site.process)[number]["visual"];
const pad = (n: number) => String(n + 1).padStart(2, "0");
const delay = (ms: number) => ({ transitionDelay: `${ms}ms` });
// Transisi hanya saat diizinkan; reduced-motion langsung ke keadaan akhir.
const ease = "motion-safe:transition motion-safe:duration-700 motion-safe:ease-out";

/** Ilustrasi CSS per langkah (DESIGN.md §6.5); aktif = animasi ke keadaan akhir. */
function Visual({ kind, active }: { kind: Kind; active: boolean }) {
  const on = (a: string, b: string) => (active ? a : b);
  return (
    <div aria-hidden className="w-full max-w-md rounded-lg border border-border bg-surface p-6">
      {kind === "document" && (
        <div className="flex flex-col gap-3">
          <span className="font-mono text-fg-muted text-label uppercase">PRD · v1</span>
          {[70, 95, 82, 64, 88, 45].map((w, i) => (
            <span
              key={w}
              style={{ width: `${w}%`, ...delay(i * 120) }}
              className={cx(
                "h-2.5 origin-left rounded-pill",
                i === 0 ? "bg-accent" : "bg-fg-muted/30",
                ease,
                on("scale-x-100", "scale-x-0"),
              )}
            />
          ))}
        </div>
      )}

      {kind === "wireframe" && (
        <div className="grid aspect-16/10 grid-cols-4 grid-rows-4 gap-2">
          {[
            "col-span-4 row-span-1",
            "col-span-1 row-span-3",
            "col-span-3 row-span-1",
            "col-span-2 row-span-2",
            "col-span-1 row-span-2",
          ].map((area, i) => (
            <span
              key={area}
              className={cx("relative rounded-sm border border-fg-muted/40 border-dashed", area)}
            >
              <span
                style={delay(i * 150)}
                className={cx(
                  "absolute inset-0 rounded-sm",
                  i === 0 ? "bg-accent-bg" : i === 3 ? "bg-accent-soft" : "bg-surface-2",
                  ease,
                  on("opacity-100", "opacity-0"),
                )}
              />
            </span>
          ))}
        </div>
      )}

      {kind === "checklist" && (
        <ul className="flex flex-col gap-3 text-sm">
          {["Login & hak akses", "Data utama", "Laporan & ekspor", "Notifikasi"].map((item, i) => (
            <li
              key={item}
              className="flex items-center gap-3 rounded-md border border-border px-4 py-3"
            >
              <span className="relative flex size-5 items-center justify-center rounded-full border border-fg-muted/50">
                <span
                  style={delay(200 + i * 300)}
                  className={cx(
                    "absolute inset-0 flex items-center justify-center rounded-full bg-green",
                    ease,
                    on("scale-100 opacity-100", "scale-50 opacity-0"),
                  )}
                >
                  <Check className="size-3.5 text-bg" strokeWidth={3} />
                </span>
              </span>
              {item}
              <span className="ml-auto font-mono text-fg-muted text-xs">modul {pad(i)}</span>
            </li>
          ))}
        </ul>
      )}

      {kind === "grid" && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-6 gap-1.5">
            {Array.from({ length: 24 }, (_, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: sel statis
                key={i}
                style={delay(i * 40)}
                className={cx(
                  "aspect-square rounded-[3px] bg-accent",
                  ease,
                  on("opacity-100", "opacity-15"),
                )}
              />
            ))}
          </div>
          <span
            style={delay(1050)}
            className={cx(
              "self-start rounded-sm bg-green-soft px-2 py-1 font-mono text-green text-label uppercase",
              ease,
              on("opacity-100", "opacity-0"),
            )}
          >
            Live
          </span>
        </div>
      )}
    </div>
  );
}

/** Proses Kerja (PRD §5.4, DESIGN.md §6.5). Desktop: langkah sticky + visual mengikuti scroll. */
export function Process() {
  const [active, setActive] = useState(0);
  const panels = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Panel yang melewati garis tengah layar menjadi langkah aktif.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    for (const el of panels.current) if (el) io.observe(el);
    return () => io.disconnect();
  }, []);

  const steps = site.process;

  return (
    <section id="proses" className="container-page py-section">
      <SectionHeading label="03 / Proses" title="Dari Ide ke Production" />

      <div className="mt-12 hidden lg:grid lg:grid-cols-12 lg:gap-12">
        <div className="sticky top-28 col-span-5 self-start">
          <ol className="relative flex flex-col gap-8 pl-8">
            <span aria-hidden className="absolute top-0 left-0 h-full w-px bg-border" />
            <span
              aria-hidden
              style={{ transform: `scaleY(${(active + 1) / steps.length})` }}
              className="absolute top-0 left-0 h-full w-px origin-top bg-accent motion-safe:transition-transform motion-safe:duration-500"
            />
            {steps.map((step, i) => (
              <li
                key={step.title}
                aria-current={i === active ? "step" : undefined}
                className={cx(
                  "transition-colors duration-300",
                  i === active ? "text-fg" : "text-fg-muted",
                )}
              >
                <span className="font-mono text-label">{pad(i)}</span>
                <h3 className="mt-1 font-semibold text-title">{step.title}</h3>
                <p className="mt-2 text-fg-muted">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="col-span-7">
          {steps.map((step, i) => (
            <div
              key={step.title}
              ref={(el) => {
                panels.current[i] = el;
              }}
              data-index={i}
              className="flex min-h-[70vh] items-center justify-center"
            >
              <Visual kind={step.visual} active={i === active} />
            </div>
          ))}
        </div>
      </div>

      <ol className="mt-10 flex flex-col gap-12 lg:hidden">
        {steps.map((step, i) => (
          <li key={step.title} className="flex flex-col gap-4">
            <div>
              <span className="font-mono text-accent text-label">{pad(i)}</span>
              <h3 className="mt-1 font-semibold text-title">{step.title}</h3>
              <p className="mt-2 text-fg-muted">{step.description}</p>
            </div>
            <Visual kind={step.visual} active />
          </li>
        ))}
      </ol>
    </section>
  );
}
