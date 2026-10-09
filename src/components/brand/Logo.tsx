import Image from "next/image";
import { cn } from "@/lib/utils";

const sizes = {
  mark: { width: 671, height: 335 },
  full: { width: 911, height: 627 },
} as const;

/**
 * Tema gelap wajib versi reversed (DESIGN.md §3.1). Keduanya dirender dan
 * dipilih lewat CSS agar tidak berkedip sebelum next-themes terbaca.
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
    <span className={cn("inline-flex", className)}>
      <Image
        src={`/brand/logo-${variant}.svg`}
        alt="Kemal Office Studio"
        width={width}
        height={height}
        className="h-full w-auto dark:hidden"
      />
      <Image
        src={`/brand/logo-${variant}-reversed.svg`}
        alt="Kemal Office Studio"
        width={width}
        height={height}
        className="hidden h-full w-auto dark:block"
      />
    </span>
  );
}
