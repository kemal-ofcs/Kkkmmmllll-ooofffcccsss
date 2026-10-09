import { SectionHeading } from "@/components/motion/SectionHeading";
import { Hero } from "@/components/sections/Hero";
import { Pricing } from "@/components/sections/Pricing";
import { Showcase } from "@/components/sections/Showcase";

// Kerangka section yang isinya menyusul Sprint 3–4 (DESIGN.md §6).
const upcoming = [
  { id: "layanan", label: "01 / Layanan", title: "Apa yang Kami Bangun" },
  { id: "proses", label: "03 / Proses", title: "Dari Ide ke Production" },
  { id: "faq", label: "05 / FAQ", title: "Pertanyaan yang Sering Diajukan" },
];

export default function Home() {
  const [layanan, proses, faq] = upcoming;
  return (
    <main id="konten" tabIndex={-1}>
      <Hero />
      <Placeholder {...layanan} />
      <Showcase />
      <Placeholder {...proses} />
      <Pricing />
      <Placeholder {...faq} />
    </main>
  );
}

function Placeholder({ id, label, title }: (typeof upcoming)[number]) {
  return (
    <section id={id} className="container-page min-h-[60vh] py-section">
      <SectionHeading label={label} title={title} />
    </section>
  );
}
