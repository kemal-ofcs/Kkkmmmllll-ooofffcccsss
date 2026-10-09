import { SectionHeading } from "@/components/motion/SectionHeading";
import { CostEstimator } from "@/components/pricing/CostEstimator";
import { site } from "@/data/site";

/** Harga & Kalkulator (PRD §5.5, DESIGN.md §6.6). */
export function Pricing() {
  return (
    <section id="harga" className="container-page py-section">
      <SectionHeading label="04 / Harga" title="Estimasi Transparan, Tanpa Tebak-tebakan" />
      <CostEstimator waNumber={site.waNumber} />
    </section>
  );
}
