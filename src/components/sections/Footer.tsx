import { Logo } from "@/components/brand/Logo";
import { site } from "@/data/site";
import { generalUrl } from "@/lib/whatsapp";

const nav = [
  { href: "/#layanan", label: "Layanan" },
  { href: "/#proyek", label: "Proyek" },
  { href: "/#proses", label: "Proses" },
  { href: "/#harga", label: "Harga" },
  { href: "/#faq", label: "FAQ" },
];

// 6285846153092 -> +62 858-4615-3092
const phone = (n: string) => `+${n.slice(0, 2)} ${n.slice(2, 5)}-${n.slice(5, 9)}-${n.slice(9)}`;

/** Footer bergaya kop dokumen, dua kolom asimetris 7/5 (DESIGN.md §6.9 v2.2). */
export function Footer() {
  return (
    <footer className="mt-auto border-border border-t">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <Logo variant="full" loading="lazy" className="h-28" />
          <p className="mt-6 max-w-md text-fg-muted">{site.description}</p>
          <dl className="mt-8 grid max-w-md grid-cols-[6rem_1fr] gap-x-6 gap-y-3 text-sm">
            <dt className="pt-0.5 font-mono text-fg-muted text-label uppercase">WhatsApp</dt>
            <dd>
              <a
                href={generalUrl(site.waNumber)}
                target="_blank"
                rel="noopener"
                className="rounded-sm hover:text-accent"
              >
                {phone(site.waNumber)}
              </a>
            </dd>
            <dt className="pt-0.5 font-mono text-fg-muted text-label uppercase">Email</dt>
            <dd>
              <a href={`mailto:${site.email}`} className="rounded-sm hover:text-accent">
                {site.email}
              </a>
            </dd>
            <dt className="pt-0.5 font-mono text-fg-muted text-label uppercase">Sosial</dt>
            <dd>
              <ul className="flex flex-wrap gap-x-4 gap-y-1">
                {site.socials.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener"
                      className="rounded-sm hover:text-accent"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </dd>
          </dl>
        </div>

        <div className="flex flex-col gap-8 lg:col-span-5">
          <nav aria-label="Navigasi footer">
            <p className="font-mono text-fg-muted text-label uppercase">Halaman</p>
            <ul className="mt-3 flex flex-col gap-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="rounded-sm hover:text-accent">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="text-fg-muted text-sm">
            <a href="/kebijakan-privasi" className="rounded-sm text-fg hover:text-accent">
              Kebijakan Privasi
            </a>
            <p className="mt-3 max-w-sm">
              Garansi bebas bug 30 hari setelah serah terima, untuk galat dari ruang lingkup yang
              disepakati.
            </p>
          </div>
        </div>
      </div>

      <div className="container-page flex flex-col gap-4 pb-8">
        <span aria-hidden className="h-px bg-brand-gradient" />
        <p className="text-fg-muted text-sm">© 2026 Kemal Office Studio</p>
      </div>
    </footer>
  );
}
