import { cx } from "@/lib/cx";

const sizes = {
  mark: { width: 671, height: 335 },
  full: { width: 911, height: 627 },
} as const;

/**
 * Tema gelap wajib versi reversed (DESIGN.md §3.1). Keduanya dirender dan
 * dipilih lewat CSS agar tidak berkedip sebelum next-themes terbaca.
 * <img> biasa: SVG tidak dioptimasi next/image, jadi JS-nya tidak perlu ikut.
 */
export function Logo({
  variant = "mark",
  className,
}: {
  variant?: keyof typeof sizes;
  className?: string;
}) {
  const { width, height } = sizes[variant];

  return (
    <span className={cx("inline-flex", className)}>
      {/* biome-ignore lint/performance/noImgElement: SVG statis */}
      <img
        src={`/brand/logo-${variant}.svg`}
        alt="Kemal Office Studio"
        width={width}
        height={height}
        className="h-full w-auto dark:hidden"
      />
      {/* biome-ignore lint/performance/noImgElement: SVG statis */}
      <img
        src={`/brand/logo-${variant}-reversed.svg`}
        alt="Kemal Office Studio"
        width={width}
        height={height}
        className="hidden h-full w-auto dark:block"
      />
    </span>
  );
}
