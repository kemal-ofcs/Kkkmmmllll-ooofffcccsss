/**
 * Teks berputar saat <a>/<button> induknya di-hover atau difokus (DESIGN.md §5.1).
 * Murni CSS (.roll di globals.css). `stagger` untuk tombol utama, tanpa stagger untuk link nav.
 */
export function RollingText({
  children,
  stagger = false,
}: {
  children: string;
  stagger?: boolean;
}) {
  const line = stagger ? (
    [...children].map((char, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: huruf statis, urutan tidak pernah berubah
      <span key={i} style={{ "--i": i } as React.CSSProperties}>
        {char}
      </span>
    ))
  ) : (
    <span>{children}</span>
  );

  return (
    <span className="roll">
      <span className="sr-only">{children}</span>
      <span className="roll-line" aria-hidden>
        {line}
      </span>
      <span className="roll-line" aria-hidden>
        {line}
      </span>
    </span>
  );
}
