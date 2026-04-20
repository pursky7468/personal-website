import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { HeroSection } from "@/components/HeroSection"
import { ProjectCard } from "@/components/ProjectCard"
import { PostCard } from "@/components/PostCard"
import { AnimateIn } from "@/components/AnimateIn"
import { allProjects, allPosts } from "contentlayer/generated"
import { compareDesc } from "date-fns"

export default function Home() {
  const featuredProjects = allProjects
    .filter((p) => p.featured && !p.draft)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
    .slice(0, 3)

  const latestPosts = allPosts
    .filter((p) => !p.draft)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
    .slice(0, 3)

  return (
    <>
      <HeroSection />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-20 space-y-16">
        {latestPosts.length > 0 && (
          <AnimateIn>
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Latest Writing</h2>
                <Link href="/blog" className="flex items-center gap-1 text-sm text-primary hover:underline">
                  All posts <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="space-y-6">
                {latestPosts.map((post) => (
                  <PostCard
                    key={post.slug}
                    title={post.title}
                    summary={post.summary}
                    date={post.date}
                    tags={post.tags}
                    slug={post.slug}
                  />
                ))}
              </div>
            </section>
          </AnimateIn>
        )}

        <AnimateIn delay={0.1}>
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Projects</h2>
              <Link href="/projects" className="flex items-center gap-1 text-sm text-primary hover:underline">
                All projects <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {featuredProjects.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {featuredProjects.map((project) => (
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
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-sm text-muted-foreground">Projects coming soon.</p>
              </div>
            )}
          </section>
        </AnimateIn>
      </div>
    </>
  )
}
