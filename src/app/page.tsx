import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { site } from "@/data/site";

// Placeholder Sprint 1: memastikan token, font, logo, dan tema bekerja.
// Diganti section asli (DESIGN.md §6) mulai Sprint 2.
export default function Home() {
  return (
    <>
      <header className="container-page flex h-16 items-center justify-between lg:h-18">
        <Logo className="h-7 lg:h-8" />
        <ThemeToggle />
      </header>

      <main id="beranda" className="container-page flex flex-1 flex-col justify-center py-section">
        <p className="inline-flex items-center gap-2 font-mono text-label text-fg-muted uppercase">
          <span className="size-2 rounded-full bg-green" aria-hidden />
          Tersedia untuk Proyek Baru · {site.availability.period}
        </p>
        <h1 className="mt-6 max-w-5xl text-display-xl font-bold">
          Software Kustom untuk Bisnis yang Sedang <span className="text-accent">Bertumbuh.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-body-l text-fg-muted">{site.description}</p>
      </main>
    </>
  );
}
