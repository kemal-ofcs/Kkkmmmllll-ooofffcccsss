import { Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";
import { generalUrl } from "@/lib/whatsapp";

/** CTA penutup (PRD §5.8, DESIGN.md §6.9): WhatsApp dengan pesan umum + email. */
export function ClosingCta() {
  return (
    <section id="kontak" className="container-page pb-section">
      <div className="relative isolate overflow-hidden rounded-lg border border-border bg-surface px-6 py-14 sm:px-12 sm:py-20">
        {/* Gradien brand dibuat tipis agar teks di atasnya tetap kontras penuh (R-25) */}
        <div aria-hidden className="-z-10 absolute inset-0 bg-brand-gradient opacity-15" />
        <h2 className="max-w-2xl font-bold text-display-l">Punya ide? Mari wujudkan bersama.</h2>
        <p className="mt-4 max-w-xl text-body-l text-fg-muted">
          Ceritakan kebutuhan Anda lewat WhatsApp atau email. Langkah berikutnya adalah sesi
          discovery untuk memetakan ruang lingkup bersama.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
          <Button asChild size="lg">
            <a href={generalUrl(site.waNumber)} target="_blank" rel="noopener">
              <MessageCircle data-icon="inline-start" strokeWidth={1.75} />
              Chat via WhatsApp
            </a>
          </Button>
          <a
            href={`mailto:${site.email}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-sm hover:text-accent"
          >
            <Mail aria-hidden className="size-5" strokeWidth={1.75} />
            {site.email}
          </a>
        </div>
      </div>
    </section>
  );
}
