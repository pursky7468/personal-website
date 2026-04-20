import type { Metadata } from "next"
import { allPosts } from "contentlayer/generated"
import { compareDesc } from "date-fns"
import { PostCard } from "@/components/PostCard"
import { AnimateIn } from "@/components/AnimateIn"

export const metadata: Metadata = {
  title: "Blog",
  description: "Writing about things I build and learn.",
}

export default function BlogPage() {
  const posts = allPosts
    .filter((p) => !p.draft)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <AnimateIn>
        <h1 className="text-3xl font-bold tracking-tight mb-10">Writing</h1>
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
              />
            ))}
          </div>
        </AnimateIn>
      ) : (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">文章籌備中，請稍後再來。</p>
        </div>
      )}
    </div>
  )
}
