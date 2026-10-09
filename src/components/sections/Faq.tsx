import { Plus } from "lucide-react";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { site } from "@/data/site";

/**
 * FAQ (PRD §5.7, DESIGN.md §6.8). <details name="faq"> bawaan browser: satu terbuka
 * sekaligus, keyboard & pembaca layar gratis, tanpa JS (pengganti Accordion shadcn).
 */
export function Faq() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: site.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <section id="faq" className="container-page py-section">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD dari data statis sendiri
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <SectionHeading label="05 / FAQ" title="Pertanyaan yang Sering Diajukan" />
        </div>
        <div className="divide-y divide-border border-border border-y lg:col-span-8">
          {site.faq.map((f) => (
            <details key={f.question} name="faq" className="group">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 py-5 font-medium text-body-l [&::-webkit-details-marker]:hidden">
                {f.question}
                <Plus
                  aria-hidden
                  strokeWidth={1.75}
                  className="size-5 shrink-0 text-accent transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none"
                />
              </summary>
              <p className="max-w-2xl pb-6 text-fg-muted">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
