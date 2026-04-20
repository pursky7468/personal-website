import type { Metadata } from "next"
import { allProjects } from "contentlayer/generated"
import { compareDesc } from "date-fns"
import { ProjectCard } from "@/components/ProjectCard"

export const metadata: Metadata = {
  title: "Projects",
  description: "Things I've built.",
}

export default function ProjectsPage() {
  const projects = allProjects
    .filter((p) => !p.draft)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight mb-10">Projects</h1>

      {projects.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              title={project.title}
              description={project.description}
              tags={project.tags}
              slug={project.slug}
              github={project.github}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">Projects coming soon.</p>
        </div>
      )}
    </div>
  )
}
