import "server-only";
import { getImageProps } from "next/image";
import type { PictureData } from "@/components/Picture";
import type { Media } from "@/data/projects";

/**
 * Atribut <img> teroptimasi (srcset AVIF/WebP) dihitung di server, sehingga komponen
 * klien `next/image` tidak ikut ke bundle browser (anggaran JS PRD §8.1).
 */
export function picture(
  media: Media,
  sizes: string,
  opts: { eager?: boolean; alt?: string } = {},
): PictureData {
  const { props } = getImageProps({
    src: media.src,
    alt: opts.alt ?? media.alt,
    fill: true,
    sizes,
    loading: opts.eager ? "eager" : "lazy",
    fetchPriority: opts.eager ? "high" : undefined,
  });
  return { props, blur: media.src.blurDataURL };
}
