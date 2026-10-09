import Link from "next/link";
import { Picture } from "@/components/Picture";
import { categoryLabels, type Project } from "@/data/projects";
import { picture } from "@/lib/picture";
import { cn } from "@/lib/utils";

/** Kartu proyek (DESIGN.md §6.3). Klik membuka drawer lewat intercepting route. */
export function ProjectCard({ project }: { project: Project }) {
  const { slug, title, tagline, category, techStack, metrics, cover, featured } = project;
  const metric = metrics[0];
  const shownStack = techStack.slice(0, 4);
  const moreStack = techStack.length - shownStack.length;

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-6 rounded-lg border border-border bg-surface p-3 transition-colors hover:border-accent sm:p-4",
        featured && "md:col-span-2 lg:grid lg:grid-cols-12 lg:items-center lg:gap-10",
      )}
    >
      <div
        className={cn(
          "relative aspect-16/10 overflow-hidden rounded-md bg-surface-2",
          featured && "lg:col-span-7",
        )}
      >
        <Picture
          data={picture(
            cover,
            featured ? "(min-width: 1024px) 700px, 100vw" : "(min-width: 768px) 600px, 100vw",
          )}
          className="transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />
      </div>

      <div className={cn("flex flex-col gap-4 px-2 pb-2", featured && "lg:col-span-5")}>
        <p className="font-mono text-fg-muted text-label uppercase">{categoryLabels[category]}</p>
        <div>
          <h3 className="font-semibold text-title">
            <Link
              href={`/proyek/${slug}`}
              scroll={false}
              className="rounded-sm after:absolute after:inset-0 after:rounded-lg after:content-['']"
            >
              {title}
            </Link>
          </h3>
          <p className="mt-2 text-fg-muted">{tagline}</p>
        </div>

        <ul className="flex flex-wrap gap-2" aria-label="Teknologi">
          {shownStack.map((tech) => (
            <li
              key={tech}
              className="rounded-pill border border-border px-3 py-1 font-mono text-fg-muted text-xs"
            >
              {tech}
            </li>
          ))}
          {moreStack > 0 && (
            <li className="rounded-pill px-2 py-1 font-mono text-fg-muted text-xs">+{moreStack}</li>
          )}
        </ul>

        {metric && (
          <p className="flex items-baseline gap-3 border-border border-t pt-4">
            <span className="font-bold font-heading text-2xl text-green tabular-nums">
              {metric.value}
            </span>
            <span className="text-fg-muted text-sm">{metric.label}</span>
          </p>
        )}
      </div>
    </article>
  );
}
