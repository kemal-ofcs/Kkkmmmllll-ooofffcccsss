import { SectionHeading } from "@/components/motion/SectionHeading";
import { ProjectCard } from "@/components/project/ProjectCard";
import { projects } from "@/data/projects";

// ponytail: filter kategori (PRD §5.3) belum dibangun. Aturannya menyembunyikan filter
// bila hanya satu kategori terisi, dan saat ini semua proyek "sistem-internal".
// Bangun saat kategori kedua ditambahkan.
export function Showcase() {
  return (
    <section id="proyek" className="container-page py-section">
      <SectionHeading label="02 / Proyek" title="Karya Terpilih" />
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
