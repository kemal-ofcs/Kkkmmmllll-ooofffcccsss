/**
 * Gabung class tanpa logika merge, untuk komponen klien. `cn` (lib/utils) membawa mesin
 * merge ± 10 KB gzip; di klien, hindari class yang saling bentrok dan pakai cx.
 */
export const cx = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ");
