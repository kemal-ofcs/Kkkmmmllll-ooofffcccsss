import type { getImageProps } from "next/image";
import { cn } from "@/lib/utils";

export type PictureData = { props: ReturnType<typeof getImageProps>["props"]; blur?: string };

/**
 * Gambar dari `picture()` (lib/picture.ts) + placeholder blur statis di belakangnya.
 * Tanpa state: aman di server maupun klien. Induknya harus `relative` + rasio tetap.
 */
export function Picture({ data, className }: { data: PictureData; className?: string }) {
  return (
    <>
      {data.blur && (
        <span
          aria-hidden
          className="absolute inset-0 scale-110 bg-center bg-cover blur-xl"
          style={{ backgroundImage: `url(${data.blur})` }}
        />
      )}
      {/* biome-ignore lint/performance/noImgElement: props dari getImageProps (sudah teroptimasi) */}
      <img
        {...data.props}
        alt={data.props.alt}
        className={cn("object-cover object-top", className)}
      />
    </>
  );
}
