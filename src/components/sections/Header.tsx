"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { RollingText } from "@/components/motion/RollingText";
import { ThemeToggle } from "@/components/ThemeToggle";
import { buttonVariants } from "@/components/ui/button-variants";

// "/#id" (bukan "#id") agar tetap benar dari halaman /proyek/[slug].
const nav = [
  { href: "/#layanan", label: "Layanan" },
  { href: "/#proyek", label: "Proyek" },
  { href: "/#proses", label: "Proses" },
  { href: "/#harga", label: "Harga" },
  { href: "/#faq", label: "FAQ" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const menu = useRef<HTMLDialogElement>(null);
  const closeMenu = () => menu.current?.close();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className="sticky top-0 z-50 border-b border-transparent transition-colors duration-300 data-[scrolled=true]:border-border data-[scrolled=true]:bg-bg/80 data-[scrolled=true]:backdrop-blur-md"
    >
      <div className="container-page flex h-16 items-center justify-between gap-6 lg:h-18">
        <a href="/#beranda" className="rounded-sm">
          <Logo className="h-7 lg:h-8" />
        </a>

        <nav aria-label="Navigasi utama" className="hidden lg:block">
          <ul className="flex gap-8 font-medium text-fg-muted text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="inline-flex py-2 rounded-sm transition-colors hover:text-fg"
                >
                  <RollingText>{item.label}</RollingText>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {/* Pembungkus menyembunyikan di mobile; class hidden di tombol akan bentrok dengan inline-flex */}
          <span className="hidden lg:block">
            <a href="/#harga" className={buttonVariants()}>
              <RollingText stagger>Hitung Estimasi</RollingText>
            </a>
          </span>
          <button
            type="button"
            aria-label="Buka menu"
            aria-haspopup="dialog"
            onClick={() => menu.current?.showModal()}
            className="inline-flex size-11 items-center justify-center rounded-pill text-fg lg:hidden"
          >
            <Menu className="size-6" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* <dialog> modal: fokus terkunci & Esc menutup dari browser. */}
      <dialog
        ref={menu}
        aria-label="Menu"
        data-lenis-prevent
        className="mobile-menu m-0 h-dvh max-h-none w-full max-w-none bg-bg p-0 text-fg backdrop:bg-transparent"
      >
        <div className="container-page flex h-16 items-center justify-between">
          <Logo className="h-7" />
          <button
            type="button"
            aria-label="Tutup menu"
            onClick={closeMenu}
            className="inline-flex size-11 items-center justify-center rounded-pill"
          >
            <X className="size-6" strokeWidth={1.75} />
          </button>
        </div>
        <nav aria-label="Navigasi utama" className="container-page pt-8">
          <ul className="flex flex-col gap-2">
            {nav.map((item, i) => (
              <li key={item.href} data-menu-item style={{ "--i": i } as React.CSSProperties}>
                <a
                  href={item.href}
                  onClick={closeMenu}
                  className="block py-2 font-heading font-semibold text-display-l"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div
            data-menu-item
            style={{ "--i": nav.length } as React.CSSProperties}
            className="mt-10"
          >
            {/* biome-ignore lint/a11y/useValidAnchor: navigasi ke #harga; onClick hanya menutup menu */}
            <a
              href="/#harga"
              onClick={closeMenu}
              className={buttonVariants({ size: "lg", className: "w-full" })}
            >
              Hitung Estimasi Proyek
            </a>
          </div>
        </nav>
      </dialog>
    </header>
  );
}
