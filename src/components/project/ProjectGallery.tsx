"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useRef, useState } from "react";
import { Picture, type PictureData } from "@/components/Picture";

export type GalleryImage = { alt: string; thumb: PictureData; full: PictureData };

const pad = (n: number) => String(n).padStart(2, "0");

/** Galeri studi kasus + lightbox (DESIGN.md §6.4): panah layar & keyboard, Esc menutup. */
export function ProjectGallery({ images }: { images: GalleryImage[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const go = (step: number) => setIndex((i) => (i + step + images.length) % images.length);
  const open = (i: number) => {
    setIndex(i);
    dialog.current?.showModal();
  };
  const current = images[index];

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2">
        {images.map((img, i) => (
          <li key={img.alt}>
            <button
              type="button"
              onClick={() => open(i)}
              className="group block w-full overflow-hidden rounded-md border border-border bg-surface-2 text-left"
            >
              <span className="relative block aspect-16/10">
                <Picture
                  data={img.thumb}
                  className="transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-label="Galeri"
        data-lenis-prevent
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
        onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
        className="lightbox m-auto max-h-none w-full max-w-6xl bg-transparent p-4 text-fg"
      >
        <figure className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono text-label text-white/80 uppercase">
              {pad(index + 1)} / {pad(images.length)}
            </span>
            <button
              type="button"
              aria-label="Tutup galeri"
              onClick={() => dialog.current?.close()}
              className="inline-flex size-11 items-center justify-center rounded-pill bg-surface"
            >
              <X className="size-5" strokeWidth={1.75} />
            </button>
          </div>
          <div className="relative aspect-16/10 overflow-hidden rounded-md bg-surface-2">
            <Picture data={current.full} fit="contain" />
          </div>
          <figcaption className="flex items-center justify-between gap-4">
            <button
              type="button"
              aria-label="Gambar sebelumnya"
              onClick={() => go(-1)}
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-pill bg-surface"
            >
              <ChevronLeft className="size-5" strokeWidth={1.75} />
            </button>
            <span className="text-center text-sm text-white/90">{current.alt}</span>
            <button
              type="button"
              aria-label="Gambar berikutnya"
              onClick={() => go(1)}
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-pill bg-surface"
            >
              <ChevronRight className="size-5" strokeWidth={1.75} />
            </button>
          </figcaption>
        </figure>
      </dialog>
    </>
  );
}
