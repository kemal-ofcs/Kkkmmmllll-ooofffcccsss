import { ArrowUpRight } from "lucide-react";
import { Picture } from "@/components/Picture";
import { Button } from "@/components/ui/button";
import { categoryLabels, type Project } from "@/data/projects";
import { picture } from "@/lib/picture";

/** Isi drawer pratinjau (DESIGN.md §6.3). Server component, dibungkus ProjectDrawer. */
export function ProjectPreview({ project }: { project: Project }) {
  const { slug, title, summary, category, year, metrics, techStack, cover, liveUrl } = project;

  return (
    <article className="flex flex-col gap-6 p-5 sm:p-6">
      <div className="relative aspect-16/10 overflow-hidden rounded-md border border-border bg-surface-2">
        <Picture data={picture(cover, "(min-width: 768px) 512px, 100vw", { eager: true })} />
      </div>

      <div>
        <p className="font-mono text-fg-muted text-label uppercase">
          {categoryLabels[category]} · {year}
        </p>
        <h2 className="mt-3 font-bold text-display-l">{title}</h2>
        <p className="mt-4 text-body-l text-fg-muted">{summary}</p>
      </div>

      {metrics.length > 0 && (
        <dl className="grid grid-cols-2 gap-4 border-border border-y py-5">
          {metrics.slice(0, 3).map((m) => (
            <div key={m.label}>
              <dt className="text-fg-muted text-sm">{m.label}</dt>
              <dd className="mt-1 font-bold font-heading text-3xl text-green tabular-nums">
                {m.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      <ul className="flex flex-wrap gap-2" aria-label="Teknologi">
        {techStack.map((tech) => (
          <li
            key={tech}
            className="rounded-pill border border-border px-3 py-1 font-mono text-fg-muted text-xs"
          >
            {tech}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col gap-3 sm:flex-row">
        {/* <a>, bukan <Link>: navigasi penuh agar halaman studi kasus tampil, bukan drawer lagi. */}
        <Button asChild size="lg">
          <a href={`/proyek/${slug}`}>Baca Studi Kasus Lengkap</a>
        </Button>
        {liveUrl && (
          <Button asChild size="lg" variant="outline">
            <a href={liveUrl} target="_blank" rel="noopener">
              Buka Aplikasi
              <ArrowUpRight data-icon="inline-end" strokeWidth={1.75} />
            </a>
          </Button>
        )}
      </div>
    </article>
  );
}
