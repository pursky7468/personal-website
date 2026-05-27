import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { allPosts } from 'contentlayer/generated'
import { compareDesc } from 'date-fns'
import { PostCard } from '@/components/PostCard'
import { AnimateIn } from '@/components/AnimateIn'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'meta' })
  return { title: 'Blog', description: t('blogDescription') }
}

export default function BlogPage({ params }: { params: { locale: string } }) {
  const t = useTranslations('blog')
  const locale = params.locale

  // Show posts in current locale; fall back to include all if none
  const localePosts = allPosts
    .filter((p) => !p.draft && p.lang === locale)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))

  const posts = localePosts.length > 0
    ? localePosts
    : allPosts
        .filter((p) => !p.draft)
        .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <AnimateIn>
        <h1 className="text-3xl font-bold tracking-tight mb-10">{t('title')}</h1>
      </AnimateIn>

      {posts.length > 0 ? (
        <AnimateIn delay={0.1}>
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard
                key={post.slug}
                title={post.title}
                summary={post.summary}
                date={post.date}
                tags={post.tags}
                slug={post.slug}
                locale={locale}
              />
            ))}
          </div>
        </AnimateIn>
      ) : (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">{t('noPosts')}</p>
        </div>
      )}
    </div>
  )
}
