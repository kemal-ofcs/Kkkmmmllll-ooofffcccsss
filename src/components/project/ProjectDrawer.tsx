"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Drawer pratinjau proyek (DESIGN.md §6.3), dirender intercepting route
 * `@modal/(.)proyek/[slug]`. <dialog> modal: fokus terkunci & Esc dari browser.
 * Ditutup pengguna (×, Esc, overlay, usap) -> router.back(), URL kembali ke asal.
 * Ditutup navigasi (tombol back) -> Next 16 menyembunyikan rute lewat React <Activity>
 * (display:none, efek di-cleanup) tanpa melepas status `open`; dialog modal yang
 * masih open membuat seluruh halaman inert. Karena itu cleanup efek ikut menutupnya.
 */
export function ProjectDrawer({ title, children }: { title: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const closedByNav = useRef(false);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    closedByNav.current = false;
    if (!dialog.open) dialog.showModal();
    return () => {
      if (!dialog.open) return;
      closedByNav.current = true;
      dialog.close();
    };
  }, []);

  const onClose = () => {
    if (closedByNav.current) closedByNav.current = false;
    else router.back();
  };

  // Usap turun untuk menutup (mobile), dari pegangan di atas drawer.
  const swipe = useRef<{ y: number; dy: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    swipe.current = { y: e.clientY, dy: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const dialog = ref.current;
    if (!swipe.current || !dialog) return;
    swipe.current.dy = Math.max(0, e.clientY - swipe.current.y);
    dialog.style.transform = `translateY(${swipe.current.dy}px)`;
  };
  const onPointerUp = () => {
    const dialog = ref.current;
    if (!swipe.current || !dialog) return;
    if (swipe.current.dy > 120) dialog.close();
    else dialog.style.transform = "";
    swipe.current = null;
  };

  return (
    // Klik di luar panel (backdrop) menutup drawer; Esc ditangani <dialog> sendiri.
    // biome-ignore lint/a11y/useKeyWithClickEvents: padanan keyboard = Esc bawaan dialog
    <dialog
      ref={ref}
      aria-label={title}
      data-lenis-prevent
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
      className="drawer m-0 ml-auto h-dvh max-h-none w-full max-w-[560px] overflow-hidden bg-surface p-0 text-fg max-md:mt-auto max-md:ml-0 max-md:h-[90dvh] max-md:max-w-none max-md:rounded-t-lg"
    >
      <div className="flex h-full flex-col">
        <div className="relative flex items-center justify-end border-border border-b px-4 py-2">
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="-translate-x-1/2 absolute top-0 left-1/2 flex h-full w-32 touch-none items-start justify-center pt-2 md:hidden"
          >
            <span className="h-1 w-10 rounded-pill bg-fg-muted/40" />
          </button>
          <button
            type="button"
            aria-label="Tutup pratinjau"
            onClick={() => ref.current?.close()}
            className="inline-flex size-11 items-center justify-center rounded-pill"
          >
            <X className="size-5" strokeWidth={1.75} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </dialog>
  );
}
