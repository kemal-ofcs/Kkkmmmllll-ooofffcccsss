import { RollingText } from "@/components/motion/RollingText";
import { ProjectStrip } from "@/components/project/ProjectStrip";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HeroCanvas } from "@/components/three/HeroCanvas";
import { Button } from "@/components/ui/button";
import { categoryLabels, projects } from "@/data/projects";
import { site } from "@/data/site";
import { picture } from "@/lib/picture";
import { cn } from "@/lib/utils";

const pages = [
  { href: "/#beranda", label: "Beranda" },
  { href: "/#layanan", label: "Layanan" },
  { href: "/#proyek", label: "Proyek" },
  { href: "/#proses", label: "Proses" },
  { href: "/#harga", label: "Harga" },
  { href: "/#faq", label: "FAQ" },
];

/**
 * Hero "Studio Console" (DESIGN.md §5.3, §6.1). Panel HALAMAN hanya terlihat selama
 * hero di layar, jadi item aktifnya selalu Beranda; tidak perlu IntersectionObserver.
 */
export function Hero() {
  const { available, period, reopenMonth } = site.availability;

  return (
    <section id="beranda" className="relative isolate overflow-hidden pb-section">
      <HeroCanvas />

      <div className="container-page grid gap-12 pt-12 pb-14 sm:pt-16 lg:grid-cols-[11rem_1fr] lg:gap-16 lg:pt-20 lg:pb-20">
        <aside className="hidden flex-col gap-3 lg:flex">
          <nav aria-label="Halaman" className="rounded-md border border-border bg-surface/70 p-4">
            <p className="font-mono text-fg-muted text-label uppercase">Halaman</p>
            <ul className="mt-3 flex flex-col gap-0.5">
              {pages.map((page, i) => (
                <li key={page.href}>
                  <a
                    href={page.href}
                    aria-current={i === 0 ? "location" : undefined}
                    className="group/page flex items-center gap-3 rounded-sm py-1.5 text-fg-muted text-sm transition-colors hover:text-fg aria-[current]:text-fg"
                  >
                    {/* sel grid dari logo sebagai penanda halaman */}
                    <span
                      aria-hidden
                      className="size-2.5 rounded-[2px] border border-fg-muted/50 transition-colors group-hover/page:border-accent group-aria-[current]/page:border-accent group-aria-[current]/page:bg-accent"
                    />
                    {page.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center justify-between rounded-md border border-border bg-surface/70 py-0.5 pr-0.5 pl-4">
            <span className="font-mono text-fg-muted text-label uppercase">Tema</span>
            <ThemeToggle />
          </div>
        </aside>

        <div>
          <p className="inline-flex items-center gap-2 font-mono text-fg-muted text-label uppercase">
            <span
              aria-hidden
              className={cn(
                "size-2 rounded-full motion-safe:animate-pulse",
                available ? "bg-green" : "bg-warning",
              )}
            />
            {available
              ? `Tersedia untuk Proyek Baru · ${period}`
              : `Antrean Penuh · Buka Lagi ${reopenMonth}`}
          </p>
          <h1 className="mt-6 max-w-5xl font-bold text-display-xl">
            Software Kustom untuk Bisnis yang Sedang <span className="text-accent">Bertumbuh.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-body-l text-fg-muted">{site.description}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href="/#harga">
                <RollingText stagger>Hitung Estimasi Proyek</RollingText>
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="/#proyek">
                <RollingText stagger>Lihat Proyek</RollingText>
              </a>
            </Button>
          </div>
        </div>
      </div>

      <ProjectStrip
        items={projects.map((p) => ({
          slug: p.slug,
          title: p.title,
          category: categoryLabels[p.category],
          picture: picture(p.cover, "288px"),
        }))}
      />
    </section>
  );
}
