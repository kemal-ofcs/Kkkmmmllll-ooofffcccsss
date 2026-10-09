import { notFound } from "next/navigation";
import { ProjectDrawer } from "@/components/project/ProjectDrawer";
import { ProjectPreview } from "@/components/project/ProjectPreview";
import { getProject, projects } from "@/data/projects";

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export default async function ProjectModal({ params }: PageProps<"/proyek/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <ProjectDrawer title={project.title}>
      <ProjectPreview project={project} />
    </ProjectDrawer>
  );
}
