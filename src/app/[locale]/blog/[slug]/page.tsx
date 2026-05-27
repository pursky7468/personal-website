import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { allPosts } from 'contentlayer/generated'
import readingTime from 'reading-time'
import { MDXContent } from '@/components/MDXContent'
import { Badge } from '@/components/ui/badge'

interface Props {
  params: { slug: string; locale: string }
}

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = []
  for (const post of allPosts.filter((p) => !p.draft)) {
    params.push({ locale: post.lang, slug: post.slug })
    // Also generate the opposite locale path (will show fallback banner)
    const other = post.lang === 'zh-TW' ? 'en' : 'zh-TW'
    params.push({ locale: other, slug: post.slug })
  }
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = allPosts.find((p) => p.slug === params.slug && p.lang === params.locale && !p.draft)
    ?? allPosts.find((p) => p.slug === params.slug && !p.draft)
  if (!post) return {}
  return {
    title: post.title,
    description: post.summary,
    openGraph: { title: post.title, description: post.summary },
  }
}

export default function BlogPost({ params }: Props) {
  const t = useTranslations('blog')
  const { slug, locale } = params

  const post =
    allPosts.find((p) => p.slug === slug && p.lang === locale && !p.draft) ??
    allPosts.find((p) => p.slug === slug && !p.draft)

  if (!post) notFound()

  const isFallback = post.lang !== locale
  const stats = readingTime(post.body.raw)
  const formattedDate = new Date(post.date).toLocaleDateString(
    locale === 'zh-TW' ? 'zh-TW' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  )

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <Link
        href={`/${locale}/blog`}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="h-3 w-3" /> {t('backToBlog')}
      </Link>

      {isFallback && (
        <div className="mb-6 rounded-md border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-600 dark:text-yellow-400">
          {t('noTranslation')}
        </div>
      )}

      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-3">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
          <time>{formattedDate}</time>
          <span>·</span>
          <span>{stats.text}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="font-normal">
              {tag}
            </Badge>
          ))}
        </div>
      </header>

      <MDXContent code={post.body.code} />
    </div>
  )
}
