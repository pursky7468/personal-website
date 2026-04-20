import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { allPosts } from "contentlayer/generated"
import readingTime from "reading-time"
import { MDXContent } from "@/components/MDXContent"
import { Badge } from "@/components/ui/badge"

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return allPosts
    .filter((p) => !p.draft)
    .map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const post = allPosts.find((p) => p.slug === params.slug && !p.draft)
  if (!post) return {}
  return {
    title: post.title,
    description: post.summary,
    openGraph: { title: post.title, description: post.summary },
  }
}

export default function BlogPost({ params }: Props) {
  const post = allPosts.find((p) => p.slug === params.slug && !p.draft)
  if (!post) notFound()

  const stats = readingTime(post.body.raw)
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <Link
        href="/blog"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="h-3 w-3" /> All posts
      </Link>

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
