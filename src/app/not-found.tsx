import { Button } from "@/components/ui/button";

/** 404 (DESIGN.md §6.10): grid sel motif logo dengan satu sel yang hilang. */
export default function NotFound() {
  const missing = 9;
  return (
    <main
      id="konten"
      tabIndex={-1}
      className="container-page flex flex-1 flex-col items-start justify-center py-section"
    >
      <div aria-hidden className="grid w-48 grid-cols-6 gap-1.5">
        {Array.from({ length: 24 }, (_, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: sel statis
            key={i}
            className={
              i === missing
                ? "aspect-square rounded-[3px] border border-accent border-dashed"
                : "aspect-square rounded-[3px] bg-accent/25"
            }
          />
        ))}
      </div>
      <p className="mt-10 font-mono text-fg-muted text-label uppercase">404</p>
      <h1 className="mt-3 font-bold text-display-l">Halaman Tidak Ditemukan</h1>
      <p className="mt-4 max-w-md text-body-l text-fg-muted">
        Alamat yang Anda buka tidak ada atau sudah dipindahkan.
      </p>
      <Button asChild size="lg" className="mt-10">
        <a href="/">Kembali ke Beranda</a>
      </Button>
    </main>
  );
}
