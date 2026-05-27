import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { GithubIcon } from '@/components/icons'
import { allProjects } from 'contentlayer/generated'
import { MDXContent } from '@/components/MDXContent'
import { Badge } from '@/components/ui/badge'
import { routing } from '@/i18n/routing'

interface Props {
  params: { slug: string; locale: string }
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    allProjects
      .filter((p) => !p.draft)
      .map((p) => ({ locale, slug: p.slug }))
  )
}

export function generateMetadata({ params }: Props): Metadata {
  const project = allProjects.find((p) => p.slug === params.slug && !p.draft)
  if (!project) return {}
  return {
    title: project.title,
    description: project.description,
    openGraph: { title: project.title, description: project.description },
  }
}

export default function ProjectPage({ params }: Props) {
  const t = useTranslations('projects')
  const project = allProjects.find((p) => p.slug === params.slug && !p.draft)
  if (!project) notFound()

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <Link
        href={`/${params.locale}/projects`}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="h-3 w-3" /> {t('title')}
      </Link>

      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-3">{project.title}</h1>
        <p className="text-muted-foreground mb-4">{project.description}</p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="font-normal">
                {tag}
              </Badge>
            ))}
          </div>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <GithubIcon className="h-4 w-4" /> GitHub
            </a>
          )}
        </div>
      </header>

      <MDXContent code={project.body.code} />
    </div>
  )
}
