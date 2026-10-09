import type { Metadata } from "next";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { Pricing } from "@/components/sections/Pricing";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";
import { Showcase } from "@/components/sections/Showcase";
import { site } from "@/data/site";

export const metadata: Metadata = { alternates: { canonical: "/" } };

// PRD §5.6: section testimoni & statistik tidak dirender selama datanya kosong.
export default function Home() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    description: site.description,
    url: siteUrl,
    logo: new URL("/brand/logo-full.svg", siteUrl).href,
    email: site.email,
    telephone: `+${site.waNumber}`,
    areaServed: "ID",
    sameAs: site.socials.map((s) => s.href),
  };

  return (
    <main id="konten" tabIndex={-1}>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD dari data statis sendiri
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <Services />
      <Showcase />
      <Process />
      <Pricing />
      <Faq />
      <ClosingCta />
    </main>
  );
}
