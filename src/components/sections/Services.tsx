import { AppWindow, LayoutDashboard, MonitorSmartphone } from "lucide-react";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { site } from "@/data/site";

// Ikon mengikuti isi layanan: jendela aplikasi, dashboard, perangkat ganda.
const icons = [AppWindow, LayoutDashboard, MonitorSmartphone];

/** Layanan (PRD §5.2, DESIGN.md §6.2). Tiap layanan menautkan ke proyek nyata sebagai bukti. */
export function Services() {
  return (
    <section id="layanan" className="container-page py-section">
      <SectionHeading label="01 / Layanan" title="Apa yang Kami Bangun" />
      <ol className="mt-12 grid gap-6 lg:grid-cols-3">
        {site.services.map((service, i) => {
          const Icon = icons[i];
          return (
            <li
              key={service.title}
              className="group flex flex-col gap-5 rounded-lg border border-border bg-surface p-6 transition-colors hover:border-accent hover:bg-surface-2"
            >
              <div className="flex items-center justify-between">
                <Icon
                  aria-hidden
                  className="size-6 text-accent transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:transition-none"
                  strokeWidth={1.75}
                />
                <span className="font-mono text-fg-muted text-label">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-title">{service.title}</h3>
                <p className="mt-3 text-fg-muted">{service.description}</p>
              </div>
              <ul className="flex flex-wrap gap-2" aria-label="Cakupan">
                {service.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-pill border border-border px-3 py-1 font-mono text-fg-muted text-xs"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
              <p className="mt-auto border-border border-t pt-4 text-sm">
                <span className="text-fg-muted">Contoh: </span>
                {/* <a>, bukan <Link>: halaman studi kasus penuh, bukan drawer */}
                <a
                  href={`/proyek/${service.example.slug}`}
                  className="rounded-sm text-accent hover:underline"
                >
                  {service.example.label}
                </a>
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
