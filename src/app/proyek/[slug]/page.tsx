import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { Picture } from "@/components/Picture";
import { ProjectGallery } from "@/components/project/ProjectGallery";
import { Button } from "@/components/ui/button";
import { categoryLabels, getProject, projects } from "@/data/projects";
import { site } from "@/data/site";
import { picture } from "@/lib/picture";

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/proyek/[slug]">): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/proyek/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.summary,
      images: [{ url: project.cover.src.src, alt: project.cover.alt }],
    },
  };
}

export default async function ProjectPage({ params }: PageProps<"/proyek/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const i = projects.indexOf(project);
  const next = projects[(i + 1) % projects.length];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    image: new URL(project.cover.src.src, siteUrl).href,
    url: new URL(`/proyek/${project.slug}`, siteUrl).href,
    dateCreated: String(project.year),
    keywords: project.techStack.join(", "),
    creator: { "@type": "Organization", name: site.name, url: siteUrl },
  };

  const story = [
    { title: "Tantangan", body: project.challenge },
    { title: "Solusi", body: project.solution },
    { title: "Hasil", body: project.result },
  ];

  return (
    <main id="konten" tabIndex={-1} className="container-page pt-10 pb-section lg:pt-14">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD dari data statis sendiri
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 font-mono text-fg-muted text-label uppercase">
          <li>
            <a href="/#proyek" className="rounded-sm hover:text-fg">
              Proyek
            </a>
          </li>
          <li aria-hidden>/</li>
          <li>{categoryLabels[project.category]}</li>
        </ol>
      </nav>

      <header className="mt-6 max-w-4xl">
        <h1 className="font-bold text-display-l">{project.title}</h1>
        <p className="mt-4 text-body-l text-fg-muted">{project.tagline}</p>
        <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-fg-muted text-label uppercase">
          <span>{project.year}</span>
          <span aria-hidden>·</span>
          <span>{categoryLabels[project.category]}</span>
          {project.liveUrl && (
            <>
              <span aria-hidden>·</span>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1 rounded-sm text-accent hover:underline"
              >
                Lihat versi live
                <ArrowUpRight className="size-3.5" strokeWidth={1.75} />
              </a>
            </>
          )}
        </p>
      </header>

      <div className="relative mt-10 aspect-16/10 overflow-hidden rounded-lg border border-border bg-surface-2">
        <Picture
          data={picture(project.cover, "(min-width: 1280px) 1216px, 100vw", { eager: true })}
        />
      </div>

      {project.metrics.length > 0 && (
        <dl className="mt-10 grid gap-6 border-border border-y py-8 sm:grid-cols-2 lg:grid-cols-4">
          {project.metrics.map((m) => (
            <div key={m.label} className="flex flex-col-reverse">
              <dt className="mt-2 text-fg-muted text-sm">{m.label}</dt>
              <dd className="font-bold font-heading text-display-l text-green tabular-nums">
                {m.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-section flex flex-col gap-16">
        {story.map((block) => (
          <Reveal key={block.title} className="grid gap-4 lg:grid-cols-12 lg:gap-10">
            <h2 className="font-bold text-title lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
              {block.title}
            </h2>
            <p className="text-body-l text-fg-muted lg:col-span-8">{block.body}</p>
          </Reveal>
        ))}

        <Reveal className="grid gap-4 lg:grid-cols-12 lg:gap-10">
          <h2 className="font-bold text-title lg:col-span-4">Teknologi</h2>
          <ul className="flex flex-wrap gap-2 lg:col-span-8">
            {project.techStack.map((tech) => (
              <li
                key={tech}
                className="rounded-pill border border-border px-3 py-1.5 font-mono text-fg-muted text-sm"
              >
                {tech}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      {project.gallery.length > 0 && (
        <section aria-labelledby="galeri" className="mt-section">
          <h2 id="galeri" className="font-bold text-title">
            Galeri
          </h2>
          <div className="mt-6">
            <ProjectGallery
              images={project.gallery.map((img) => ({
                alt: img.alt,
                thumb: picture(img, "(min-width: 640px) 600px, 100vw"),
                full: picture(img, "(min-width: 1152px) 1120px, 100vw"),
              }))}
            />
          </div>
        </section>
      )}

      <section className="mt-section flex flex-col items-start gap-6 rounded-lg border border-border bg-surface p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-bold text-title">Punya proyek serupa?</h2>
          <p className="mt-2 text-fg-muted">
            Hitung estimasi biayanya dulu, lalu diskusikan lewat WhatsApp.
          </p>
        </div>
        <Button asChild size="lg">
          <a href="/#harga">Hitung Estimasi</a>
        </Button>
      </section>

      {next.slug !== project.slug && (
        // <a>, bukan <Link>: Link ke /proyek/* akan tertangkap intercepting route (drawer).
        <a
          href={`/proyek/${next.slug}`}
          className="group mt-16 flex items-center gap-6 rounded-lg border border-border p-4 transition-colors hover:border-accent"
        >
          <span className="relative aspect-16/10 w-28 shrink-0 overflow-hidden rounded-sm bg-surface-2 sm:w-40">
            <Picture data={picture(next.cover, "160px", { alt: "" })} />
          </span>
          <span>
            <span className="font-mono text-fg-muted text-label uppercase">
              Proyek Berikutnya →
            </span>
            <span className="mt-1 block font-semibold text-title">{next.title}</span>
          </span>
        </a>
      )}
    </main>
  );
}
